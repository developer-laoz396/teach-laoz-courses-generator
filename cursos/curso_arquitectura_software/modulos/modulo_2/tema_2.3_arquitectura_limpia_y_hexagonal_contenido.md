# Tema 2.3: Arquitectura Limpia y Hexagonal

**Tiempo estimado**: 60 minutos  
**Nivel**: Avanzado  
**Prerrequisitos**: Temas 2.1 (Modularidad), 2.2 (SOLID)

## ¿Por qué importa este concepto?

La **Arquitectura Limpia** (Clean Architecture) de Robert C. Martin y la **Arquitectura Hexagonal** (Ports & Adapters) de Alistair Cockburn son dos enfoques complementarios que resuelven el mismo problema fundamental:

**¿Cómo diseñar sistemas donde la lógica de negocio es independiente de frameworks, bases de datos, UI, y cualquier detalle técnico?**

**Beneficios**:

- **Testabilidad máxima**: Lógica de negocio testeable sin BD, sin HTTP, sin frameworks
- **Independencia de frameworks**: Puedes cambiar de Django a Flask, de React a Vue
- **Independencia de UI**: La misma lógica sirve para web, mobile, CLI
- **Independencia de BD**: Puedes cambiar de PostgreSQL a MongoDB sin tocar lógica
- **Postponement de decisiones**: Puedes decidir tecnologías después, no antes

En la industria, sistemas con arquitectura limpia son más fáciles de mantener, evolucionar y migrar. Empresas como Netflix, Spotify, y Uber usan variantes de estas arquitecturas.

---

## Arquitectura Limpia (Clean Architecture)

### Principio fundamental: Regla de Dependencia

> **Las dependencias de código fuente solo pueden apuntar hacia adentro, hacia políticas de más alto nivel.**

```
┌─────────────────────────────────────────┐
│  Frameworks & Drivers (UI, DB, Web)    │  ← Capa más externa
├─────────────────────────────────────────┤
│  Interface Adapters (Controllers, etc) │
├─────────────────────────────────────────┤
│  Use Cases (Application Business Rules)│
├─────────────────────────────────────────┤
│  Entities (Enterprise Business Rules)  │  ← Capa más interna (núcleo)
└─────────────────────────────────────────┘

Dependencias: Externo → Interno (nunca al revés)
```

### Las 4 capas

#### 1. Entities (Entidades - Núcleo del dominio)

**Qué son**: Objetos de negocio de la empresa. Reglas que existirían incluso sin el sistema.

```python
from dataclasses import dataclass
from typing import List
from datetime import datetime

@dataclass
class Order:
    """
    Entidad de dominio: Orden de compra.
    No depende de frameworks, BD, ni UI.
    """
    id: str
    customer_id: str
    items: List['OrderItem']
    created_at: datetime
    status: str
    
    def calculate_total(self) -> float:
        """Regla de negocio pura."""
        return sum(item.subtotal() for item in self.items)
    
    def can_be_cancelled(self) -> bool:
        """Regla de negocio: solo órdenes pendientes se pueden cancelar."""
        return self.status == 'PENDING'
    
    def apply_discount(self, percentage: float):
        """Regla de negocio: aplicar descuento."""
        if not 0 <= percentage <= 100:
            raise ValueError("Discount must be between 0 and 100")
        
        for item in self.items:
            item.price *= (1 - percentage / 100)

@dataclass
class OrderItem:
    product_id: str
    quantity: int
    price: float
    
    def subtotal(self) -> float:
        return self.quantity * self.price
```

#### 2. Use Cases (Casos de Uso - Reglas de aplicación)

**Qué son**: Lógica específica de la aplicación. Orquestan el flujo de datos hacia/desde entidades.

```python
from abc import ABC, abstractmethod
from typing import Optional

# ===== PORTS (Interfaces) =====
class OrderRepository(ABC):
    """Puerto: Abstracción de persistencia."""
    @abstractmethod
    def save(self, order: Order) -> bool: pass
    
    @abstractmethod
    def find_by_id(self, order_id: str) -> Optional[Order]: pass

class PaymentGateway(ABC):
    """Puerto: Abstracción de pagos."""
    @abstractmethod
    def process_payment(self, order_id: str, amount: float) -> bool: pass

class NotificationService(ABC):
    """Puerto: Abstracción de notificaciones."""
    @abstractmethod
    def notify_order_placed(self, order: Order): pass

# ===== USE CASE =====
class PlaceOrderUseCase:
    """
    Caso de uso: Realizar una orden.
    Depende de abstracciones (puertos), no de implementaciones.
    """
    def __init__(self,
                 order_repo: OrderRepository,
                 payment_gateway: PaymentGateway,
                 notification_service: NotificationService):
        self.order_repo = order_repo
        self.payment_gateway = payment_gateway
        self.notification_service = notification_service
    
    def execute(self, order: Order) -> bool:
        """
        Ejecuta el caso de uso.
        Orquesta entidades y servicios externos.
        """
        # 1. Validar orden (regla de negocio)
        if order.calculate_total() <= 0:
            raise ValueError("Order total must be positive")
        
        # 2. Guardar orden
        if not self.order_repo.save(order):
            return False
        
        # 3. Procesar pago
        if not self.payment_gateway.process_payment(order.id, order.calculate_total()):
            order.status = 'PAYMENT_FAILED'
            self.order_repo.save(order)
            return False
        
        # 4. Actualizar estado
        order.status = 'CONFIRMED'
        self.order_repo.save(order)
        
        # 5. Notificar
        self.notification_service.notify_order_placed(order)
        
        return True
```

#### 3. Interface Adapters (Adaptadores de Interfaz)

**Qué son**: Convierten datos entre el formato de use cases y el formato de agentes externos (DB, Web, etc).

```python
from flask import Flask, request, jsonify

# ===== ADAPTERS (Implementaciones) =====

class PostgreSQLOrderRepository(OrderRepository):
    """Adaptador: Implementación PostgreSQL."""
    def __init__(self, db_connection):
        self.db = db_connection
    
    def save(self, order: Order) -> bool:
        # Convertir entidad a formato de BD
        query = """
            INSERT INTO orders (id, customer_id, total, status, created_at)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET status = %s
        """
        try:
            self.db.execute(query, (
                order.id,
                order.customer_id,
                order.calculate_total(),
                order.status,
                order.created_at,
                order.status
            ))
            return True
        except Exception:
            return False
    
    def find_by_id(self, order_id: str) -> Optional[Order]:
        query = "SELECT * FROM orders WHERE id = %s"
        row = self.db.fetch_one(query, (order_id,))
        
        if not row:
            return None
        
        # Convertir formato de BD a entidad
        return Order(
            id=row['id'],
            customer_id=row['customer_id'],
            items=[],  # Cargar items en query separado
            created_at=row['created_at'],
            status=row['status']
        )

class StripePaymentGateway(PaymentGateway):
    """Adaptador: Implementación Stripe."""
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    def process_payment(self, order_id: str, amount: float) -> bool:
        # Llamada a API de Stripe
        import stripe
        stripe.api_key = self.api_key
        
        try:
            stripe.Charge.create(
                amount=int(amount * 100),  # Centavos
                currency='usd',
                description=f'Order {order_id}'
            )
            return True
        except stripe.error.CardError:
            return False

# ===== CONTROLLER (Web Adapter) =====

class OrderController:
    """
    Controlador web: Adaptador entre HTTP y use cases.
    """
    def __init__(self, place_order_use_case: PlaceOrderUseCase):
        self.place_order_use_case = place_order_use_case
    
    def place_order_endpoint(self):
        """Endpoint HTTP: POST /orders"""
        # 1. Extraer datos de HTTP request
        data = request.get_json()
        
        # 2. Convertir a entidad de dominio
        order = Order(
            id=data['id'],
            customer_id=data['customer_id'],
            items=[
                OrderItem(
                    product_id=item['product_id'],
                    quantity=item['quantity'],
                    price=item['price']
                )
                for item in data['items']
            ],
            created_at=datetime.now(),
            status='PENDING'
        )
        
        # 3. Ejecutar use case
        try:
            success = self.place_order_use_case.execute(order)
            
            # 4. Convertir resultado a HTTP response
            if success:
                return jsonify({'status': 'success', 'order_id': order.id}), 201
            else:
                return jsonify({'status': 'error', 'message': 'Payment failed'}), 400
        
        except ValueError as e:
            return jsonify({'status': 'error', 'message': str(e)}), 400
```

#### 4. Frameworks & Drivers (Frameworks y Drivers)

**Qué son**: Detalles técnicos. Frameworks web, bases de datos, dispositivos.

```python
# ===== MAIN (Composition Root) =====

def create_app():
    """
    Punto de entrada: Ensambla todas las dependencias.
    """
    app = Flask(__name__)
    
    # Configurar dependencias (Dependency Injection)
    db_connection = create_database_connection()
    order_repo = PostgreSQLOrderRepository(db_connection)
    payment_gateway = StripePaymentGateway(api_key='sk_test_...')
    notification_service = EmailNotificationService()
    
    # Crear use case
    place_order_use_case = PlaceOrderUseCase(
        order_repo,
        payment_gateway,
        notification_service
    )
    
    # Crear controller
    order_controller = OrderController(place_order_use_case)
    
    # Registrar rutas
    @app.route('/orders', methods=['POST'])
    def place_order():
        return order_controller.place_order_endpoint()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run()
```

---

## Arquitectura Hexagonal (Ports & Adapters)

### Concepto central

```
        ┌─────────────────────────┐
        │   Driving Adapters      │
        │  (UI, Tests, CLI)       │
        └───────────┬─────────────┘
                    │
        ┌───────────▼─────────────┐
        │    Driving Ports        │
        │   (Input Interfaces)    │
        ├─────────────────────────┤
        │                         │
        │   APPLICATION CORE      │
        │   (Business Logic)      │
        │                         │
        ├─────────────────────────┤
        │    Driven Ports         │
        │  (Output Interfaces)    │
        └───────────┬─────────────┘
                    │
        ┌───────────▼─────────────┐
        │   Driven Adapters       │
        │  (DB, Email, APIs)      │
        └─────────────────────────┘
```

### Ejemplo completo: Sistema de reservas

```python
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional

# ========== DOMAIN (Core) ==========

@dataclass
class Reservation:
    """Entidad de dominio."""
    id: str
    user_id: str
    resource_id: str
    start_time: datetime
    end_time: datetime
    status: str
    
    def is_active(self) -> bool:
        """Regla de negocio."""
        return self.status == 'CONFIRMED' and self.end_time > datetime.now()
    
    def conflicts_with(self, other: 'Reservation') -> bool:
        """Regla de negocio: detectar conflictos."""
        return (self.resource_id == other.resource_id and
                not (self.end_time <= other.start_time or 
                     self.start_time >= other.end_time))

# ========== PORTS ==========

# Driving Ports (Input - lo que el core expone)
class ReservationService(ABC):
    """Puerto de entrada: Servicios que el core ofrece."""
    @abstractmethod
    def make_reservation(self, user_id: str, resource_id: str,
                        start: datetime, end: datetime) -> Reservation: pass
    
    @abstractmethod
    def cancel_reservation(self, reservation_id: str) -> bool: pass
    
    @abstractmethod
    def get_user_reservations(self, user_id: str) -> List[Reservation]: pass

# Driven Ports (Output - lo que el core necesita)
class ReservationRepository(ABC):
    """Puerto de salida: Persistencia."""
    @abstractmethod
    def save(self, reservation: Reservation): pass
    
    @abstractmethod
    def find_by_id(self, reservation_id: str) -> Optional[Reservation]: pass
    
    @abstractmethod
    def find_by_resource(self, resource_id: str, 
                        start: datetime, end: datetime) -> List[Reservation]: pass

class NotificationPort(ABC):
    """Puerto de salida: Notificaciones."""
    @abstractmethod
    def send_confirmation(self, reservation: Reservation): pass
    
    @abstractmethod
    def send_cancellation(self, reservation: Reservation): pass

# ========== CORE (Application Logic) ==========

class ReservationServiceImpl(ReservationService):
    """
    Implementación del core.
    Depende solo de puertos (abstracciones).
    """
    def __init__(self,
                 repository: ReservationRepository,
                 notification: NotificationPort):
        self.repository = repository
        self.notification = notification
    
    def make_reservation(self, user_id: str, resource_id: str,
                        start: datetime, end: datetime) -> Reservation:
        # 1. Validar fechas
        if start >= end:
            raise ValueError("Start time must be before end time")
        
        if start < datetime.now():
            raise ValueError("Cannot reserve in the past")
        
        # 2. Verificar disponibilidad
        existing = self.repository.find_by_resource(resource_id, start, end)
        
        new_reservation = Reservation(
            id=self._generate_id(),
            user_id=user_id,
            resource_id=resource_id,
            start_time=start,
            end_time=end,
            status='PENDING'
        )
        
        for res in existing:
            if new_reservation.conflicts_with(res):
                raise ValueError(f"Conflicts with reservation {res.id}")
        
        # 3. Crear reserva
        new_reservation.status = 'CONFIRMED'
        self.repository.save(new_reservation)
        
        # 4. Notificar
        self.notification.send_confirmation(new_reservation)
        
        return new_reservation
    
    def cancel_reservation(self, reservation_id: str) -> bool:
        reservation = self.repository.find_by_id(reservation_id)
        
        if not reservation:
            return False
        
        if not reservation.is_active():
            return False
        
        reservation.status = 'CANCELLED'
        self.repository.save(reservation)
        self.notification.send_cancellation(reservation)
        
        return True
    
    def get_user_reservations(self, user_id: str) -> List[Reservation]:
        # Implementación simplificada
        return []
    
    def _generate_id(self) -> str:
        import uuid
        return str(uuid.uuid4())

# ========== ADAPTERS ==========

# Driving Adapter: REST API
class ReservationRESTAdapter:
    """Adaptador de entrada: API REST."""
    def __init__(self, service: ReservationService):
        self.service = service
    
    def post_reservation(self, request_data: dict) -> dict:
        """POST /reservations"""
        try:
            reservation = self.service.make_reservation(
                user_id=request_data['user_id'],
                resource_id=request_data['resource_id'],
                start=datetime.fromisoformat(request_data['start_time']),
                end=datetime.fromisoformat(request_data['end_time'])
            )
            
            return {
                'status': 'success',
                'reservation_id': reservation.id
            }
        except ValueError as e:
            return {
                'status': 'error',
                'message': str(e)
            }

# Driving Adapter: CLI
class ReservationCLIAdapter:
    """Adaptador de entrada: Línea de comandos."""
    def __init__(self, service: ReservationService):
        self.service = service
    
    def run(self):
        print("Reservation System CLI")
        print("1. Make reservation")
        print("2. Cancel reservation")
        choice = input("Choose option: ")
        
        if choice == '1':
            user_id = input("User ID: ")
            resource_id = input("Resource ID: ")
            # ... resto de inputs
            
            try:
                reservation = self.service.make_reservation(...)
                print(f"✓ Reservation created: {reservation.id}")
            except ValueError as e:
                print(f"✗ Error: {e}")

# Driven Adapter: PostgreSQL
class PostgreSQLReservationRepository(ReservationRepository):
    """Adaptador de salida: PostgreSQL."""
    def __init__(self, db_connection):
        self.db = db_connection
    
    def save(self, reservation: Reservation):
        query = """
            INSERT INTO reservations (id, user_id, resource_id, start_time, end_time, status)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (id) DO UPDATE SET status = %s
        """
        self.db.execute(query, (
            reservation.id, reservation.user_id, reservation.resource_id,
            reservation.start_time, reservation.end_time, reservation.status,
            reservation.status
        ))
    
    def find_by_id(self, reservation_id: str) -> Optional[Reservation]:
        # Implementación
        pass
    
    def find_by_resource(self, resource_id: str, 
                        start: datetime, end: datetime) -> List[Reservation]:
        # Implementación
        pass

# Driven Adapter: Email
class EmailNotificationAdapter(NotificationPort):
    """Adaptador de salida: Email."""
    def send_confirmation(self, reservation: Reservation):
        # Enviar email de confirmación
        print(f"📧 Sending confirmation email for reservation {reservation.id}")
    
    def send_cancellation(self, reservation: Reservation):
        # Enviar email de cancelación
        print(f"📧 Sending cancellation email for reservation {reservation.id}")

# ========== COMPOSITION ROOT ==========

def create_reservation_system():
    """Ensambla el sistema."""
    # Driven adapters (salida)
    db = create_db_connection()
    repository = PostgreSQLReservationRepository(db)
    notification = EmailNotificationAdapter()
    
    # Core
    service = ReservationServiceImpl(repository, notification)
    
    # Driving adapters (entrada)
    rest_api = ReservationRESTAdapter(service)
    cli = ReservationCLIAdapter(service)
    
    return {
        'service': service,
        'rest_api': rest_api,
        'cli': cli
    }
```

---

## Beneficios clave

### 1. Testabilidad total

```python
# Test sin base de datos, sin email, sin HTTP
class InMemoryReservationRepository(ReservationRepository):
    def __init__(self):
        self.reservations = {}
    
    def save(self, reservation: Reservation):
        self.reservations[reservation.id] = reservation
    
    # ... resto de métodos

class MockNotification(NotificationPort):
    def __init__(self):
        self.sent_confirmations = []
    
    def send_confirmation(self, reservation: Reservation):
        self.sent_confirmations.append(reservation.id)
    
    def send_cancellation(self, reservation: Reservation):
        pass

def test_make_reservation():
    # Arrange
    repo = InMemoryReservationRepository()
    notif = MockNotification()
    service = ReservationServiceImpl(repo, notif)
    
    # Act
    reservation = service.make_reservation(
        user_id='user1',
        resource_id='room1',
        start=datetime(2024, 1, 1, 10, 0),
        end=datetime(2024, 1, 1, 11, 0)
    )
    
    # Assert
    assert reservation.status == 'CONFIRMED'
    assert len(notif.sent_confirmations) == 1
    assert repo.reservations[reservation.id] is not None
```

### 2. Independencia de frameworks

```python
# Mismo core funciona con Flask, FastAPI, Django, o CLI
# Solo cambias el driving adapter

# Flask
@app.route('/reservations', methods=['POST'])
def flask_endpoint():
    return rest_api.post_reservation(request.get_json())

# FastAPI
@app.post('/reservations')
def fastapi_endpoint(data: ReservationRequest):
    return rest_api.post_reservation(data.dict())

# CLI
if __name__ == '__main__':
    cli.run()
```

### 3. Postponement de decisiones

```python
# Puedes empezar con SQLite y migrar a PostgreSQL después
# Solo cambias el driven adapter, el core no se toca

# Desarrollo
repo = SQLiteReservationRepository()

# Producción
repo = PostgreSQLReservationRepository()

# El core no sabe ni le importa cuál usas
service = ReservationServiceImpl(repo, notification)
```

---

## Resumen

**Arquitectura Limpia**:

- 4 capas concéntricas
- Dependencias apuntan hacia adentro
- Core independiente de detalles

**Arquitectura Hexagonal**:

- Core + Ports + Adapters
- Driving ports (input) y Driven ports (output)
- Simetría: múltiples adaptadores para mismos puertos

**Ambas logran**: Lógica de negocio independiente, testable, y evolvible.

**Siguiente paso**: Tema 2.4 - Deuda Técnica
