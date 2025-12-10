# Tema 2.2: Principios SOLID en Arquitectura

**Tiempo estimado**: 55 minutos  
**Nivel**: Intermedio-Avanzado  
**Prerrequisitos**: Tema 2.1 (Modularidad)

## ¿Por qué importa este concepto?

SOLID es el acrónimo de cinco principios de diseño orientado a objetos que, cuando se aplican correctamente, producen sistemas:

- **Mantenibles**: Fáciles de modificar sin romper funcionalidad existente
- **Extensibles**: Nuevas features se añaden sin modificar código existente
- **Testables**: Componentes se pueden probar aisladamente
- **Comprensibles**: El código comunica su intención claramente

Aunque SOLID se originó para diseño de clases (Robert C. Martin, principios 2000s), **sus principios escalan a nivel arquitectónico**. Microservicios, módulos, y componentes arquitectónicos se benefician de los mismos principios.

---

## Los 5 Principios SOLID

### 1. Single Responsibility Principle (SRP)

**Definición**: Una clase/módulo/servicio debe tener una sola razón para cambiar.

**A nivel arquitectónico**: Cada servicio debe tener una responsabilidad de negocio clara.

```python
# ❌ MALO: Servicio con múltiples responsabilidades
class UserService:
    def create_user(self, data): pass
    def authenticate_user(self, credentials): pass
    def send_notification(self, user_id, message): pass
    def generate_report(self, user_id): pass
    def process_payment(self, user_id, amount): pass

# ✅ BUENO: Servicios con responsabilidades únicas
class UserManagementService:
    def create_user(self, data): pass
    def update_user(self, user_id, data): pass

class AuthenticationService:
    def authenticate(self, credentials): pass
    def refresh_token(self, token): pass

class NotificationService:
    def send_email(self, to, subject, body): pass
    def send_sms(self, to, message): pass

class ReportingService:
    def generate_user_report(self, user_id): pass

class PaymentService:
    def process_payment(self, user_id, amount): pass
```

**Caso real - Amazon**: Tienen servicios separados para User, Auth, Notification, Payment, etc. Cada uno puede evolucionar independientemente.

---

### 2. Open/Closed Principle (OCP)

**Definición**: Entidades de software deben estar abiertas para extensión, cerradas para modificación.

**A nivel arquitectónico**: Nuevas features se añaden mediante nuevos componentes, no modificando existentes.

```python
from abc import ABC, abstractmethod
from typing import List

# ❌ MALO: Modificar código existente para cada nuevo tipo de pago
class PaymentProcessor:
    def process(self, payment_type, amount):
        if payment_type == 'credit_card':
            # Lógica de tarjeta de crédito
            pass
        elif payment_type == 'paypal':
            # Lógica de PayPal
            pass
        elif payment_type == 'crypto':  # Nueva feature: modificamos código existente
            # Lógica de crypto
            pass

# ✅ BUENO: Extensible sin modificación
class PaymentMethod(ABC):
    @abstractmethod
    def process(self, amount: float) -> bool:
        pass

class CreditCardPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        # Lógica de tarjeta
        return True

class PayPalPayment(PaymentMethod):
    def process(self, amount: float) -> bool:
        # Lógica de PayPal
        return True

class CryptoPayment(PaymentMethod):  # Nueva feature: solo añadimos clase nueva
    def process(self, amount: float) -> bool:
        # Lógica de crypto
        return True

class PaymentProcessor:
    def __init__(self):
        self.payment_methods: List[PaymentMethod] = []
    
    def register_payment_method(self, method: PaymentMethod):
        self.payment_methods.append(method)
    
    def process(self, method_type: str, amount: float) -> bool:
        method = self._get_method(method_type)
        return method.process(amount)
```

**Patrón arquitectónico - Plugin Architecture**: Sistemas como VS Code, WordPress permiten extensiones sin modificar el core.

---

### 3. Liskov Substitution Principle (LSP)

**Definición**: Los subtipos deben ser sustituibles por sus tipos base sin alterar la correctitud del programa.

**A nivel arquitectónico**: Las implementaciones de una interfaz deben ser intercambiables.

```python
from abc import ABC, abstractmethod

# ❌ MALO: Violación de LSP
class Bird(ABC):
    @abstractmethod
    def fly(self):
        pass

class Sparrow(Bird):
    def fly(self):
        return "Flying high!"

class Penguin(Bird):
    def fly(self):
        raise Exception("Penguins can't fly!")  # Rompe el contrato

# ✅ BUENO: Jerarquía correcta
class Bird(ABC):
    @abstractmethod
    def move(self):
        pass

class FlyingBird(Bird):
    def move(self):
        return self.fly()
    
    def fly(self):
        return "Flying!"

class FlightlessBird(Bird):
    def move(self):
        return self.walk()
    
    def walk(self):
        return "Walking!"

class Sparrow(FlyingBird):
    pass

class Penguin(FlightlessBird):
    pass
```

**Caso arquitectónico - Storage Abstraction**:

```python
class StorageProvider(ABC):
    @abstractmethod
    def save(self, key: str, data: bytes) -> bool:
        pass
    
    @abstractmethod
    def retrieve(self, key: str) -> bytes:
        pass

class S3Storage(StorageProvider):
    def save(self, key: str, data: bytes) -> bool:
        # Implementación S3
        return True
    
    def retrieve(self, key: str) -> bytes:
        # Implementación S3
        return b"data"

class LocalFileStorage(StorageProvider):
    def save(self, key: str, data: bytes) -> bool:
        # Implementación local
        return True
    
    def retrieve(self, key: str) -> bytes:
        # Implementación local
        return b"data"

# Ambas implementaciones son intercambiables
def upload_file(storage: StorageProvider, filename: str, data: bytes):
    storage.save(filename, data)  # Funciona con cualquier implementación
```

---

### 4. Interface Segregation Principle (ISP)

**Definición**: Los clientes no deben depender de interfaces que no usan.

**A nivel arquitectónico**: Servicios deben exponer APIs específicas, no monolíticas.

```python
# ❌ MALO: Interfaz monolítica
class Worker(ABC):
    @abstractmethod
    def work(self): pass
    
    @abstractmethod
    def eat(self): pass
    
    @abstractmethod
    def sleep(self): pass

class HumanWorker(Worker):
    def work(self): return "Working"
    def eat(self): return "Eating"
    def sleep(self): return "Sleeping"

class RobotWorker(Worker):
    def work(self): return "Working"
    def eat(self): raise NotImplementedError("Robots don't eat")
    def sleep(self): raise NotImplementedError("Robots don't sleep")

# ✅ BUENO: Interfaces segregadas
class Workable(ABC):
    @abstractmethod
    def work(self): pass

class Eatable(ABC):
    @abstractmethod
    def eat(self): pass

class Sleepable(ABC):
    @abstractmethod
    def sleep(self): pass

class HumanWorker(Workable, Eatable, Sleepable):
    def work(self): return "Working"
    def eat(self): return "Eating"
    def sleep(self): return "Sleeping"

class RobotWorker(Workable):
    def work(self): return "Working"
```

**Caso arquitectónico - Microservices APIs**:

```python
# ❌ MALO: API monolítica
class UserServiceAPI:
    def get_user_profile(self, user_id): pass
    def update_user_profile(self, user_id, data): pass
    def get_user_orders(self, user_id): pass
    def get_user_payments(self, user_id): pass
    def get_user_recommendations(self, user_id): pass
    # ... 50 métodos más

# ✅ BUENO: APIs segregadas
class UserProfileAPI:
    def get_profile(self, user_id): pass
    def update_profile(self, user_id, data): pass

class UserOrdersAPI:
    def get_orders(self, user_id): pass

class UserPaymentsAPI:
    def get_payments(self, user_id): pass

class UserRecommendationsAPI:
    def get_recommendations(self, user_id): pass
```

---

### 5. Dependency Inversion Principle (DIP)

**Definición**:

- Módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de abstracciones.
- Las abstracciones no deben depender de detalles. Los detalles deben depender de abstracciones.

**A nivel arquitectónico**: La lógica de negocio no debe depender de frameworks, bases de datos, o detalles de infraestructura.

```python
# ❌ MALO: Alto nivel depende de bajo nivel
class MySQLDatabase:
    def save_user(self, user): pass

class UserService:  # Alto nivel
    def __init__(self):
        self.db = MySQLDatabase()  # Depende de implementación concreta
    
    def create_user(self, user):
        self.db.save_user(user)

# ✅ BUENO: Ambos dependen de abstracción
class UserRepository(ABC):  # Abstracción
    @abstractmethod
    def save(self, user): pass

class MySQLUserRepository(UserRepository):  # Bajo nivel
    def save(self, user):
        # Implementación MySQL
        pass

class MongoUserRepository(UserRepository):  # Bajo nivel
    def save(self, user):
        # Implementación MongoDB
        pass

class UserService:  # Alto nivel
    def __init__(self, repository: UserRepository):
        self.repository = repository  # Depende de abstracción
    
    def create_user(self, user):
        self.repository.save(user)

# Inyección de dependencias
mysql_repo = MySQLUserRepository()
user_service = UserService(mysql_repo)
```

**Arquitectura Hexagonal (Ports & Adapters)**: Implementación arquitectónica de DIP.

```
Core Domain (Business Logic)
    ↓ depende de
Ports (Interfaces/Abstracciones)
    ↑ implementadas por
Adapters (Detalles: DB, HTTP, etc.)
```

---

## SOLID a nivel arquitectónico: Caso completo

### Sistema de E-commerce aplicando SOLID

```python
from abc import ABC, abstractmethod
from typing import List, Optional
from dataclasses import dataclass
from enum import Enum

# ============= DOMAIN MODELS =============
@dataclass
class Order:
    id: str
    user_id: str
    items: List['OrderItem']
    total: float
    status: 'OrderStatus'

@dataclass
class OrderItem:
    product_id: str
    quantity: int
    price: float

class OrderStatus(Enum):
    PENDING = "pending"
    PAID = "paid"
    SHIPPED = "shipped"
    DELIVERED = "delivered"

# ============= PORTS (Abstracciones) =============

# SRP: Cada interfaz tiene una responsabilidad
class OrderRepository(ABC):
    """Puerto para persistencia de órdenes."""
    @abstractmethod
    def save(self, order: Order) -> bool: pass
    
    @abstractmethod
    def find_by_id(self, order_id: str) -> Optional[Order]: pass

class PaymentGateway(ABC):
    """Puerto para procesamiento de pagos."""
    @abstractmethod
    def charge(self, amount: float, payment_method: str) -> bool: pass

class NotificationService(ABC):
    """Puerto para notificaciones."""
    @abstractmethod
    def send(self, user_id: str, message: str) -> bool: pass

class InventoryService(ABC):
    """Puerto para gestión de inventario."""
    @abstractmethod
    def reserve_items(self, items: List[OrderItem]) -> bool: pass

# ============= ADAPTERS (Implementaciones) =============

# LSP: Todas las implementaciones son sustituibles
class PostgreSQLOrderRepository(OrderRepository):
    def save(self, order: Order) -> bool:
        # Implementación PostgreSQL
        return True
    
    def find_by_id(self, order_id: str) -> Optional[Order]:
        # Implementación PostgreSQL
        return None

class MongoDBOrderRepository(OrderRepository):
    def save(self, order: Order) -> bool:
        # Implementación MongoDB
        return True
    
    def find_by_id(self, order_id: str) -> Optional[Order]:
        # Implementación MongoDB
        return None

class StripePaymentGateway(PaymentGateway):
    def charge(self, amount: float, payment_method: str) -> bool:
        # Implementación Stripe
        return True

class PayPalPaymentGateway(PaymentGateway):
    def charge(self, amount: float, payment_method: str) -> bool:
        # Implementación PayPal
        return True

class EmailNotificationService(NotificationService):
    def send(self, user_id: str, message: str) -> bool:
        # Enviar email
        return True

class SMSNotificationService(NotificationService):
    def send(self, user_id: str, message: str) -> bool:
        # Enviar SMS
        return True

# ============= DOMAIN SERVICES (Business Logic) =============

# DIP: Lógica de negocio depende de abstracciones, no de implementaciones
class OrderService:
    """
    SRP: Solo maneja lógica de órdenes
    DIP: Depende de abstracciones (puertos)
    """
    def __init__(self,
                 order_repo: OrderRepository,
                 payment_gateway: PaymentGateway,
                 notification_service: NotificationService,
                 inventory_service: InventoryService):
        self.order_repo = order_repo
        self.payment_gateway = payment_gateway
        self.notification_service = notification_service
        self.inventory_service = inventory_service
    
    def place_order(self, order: Order) -> bool:
        """Procesa una nueva orden."""
        # 1. Reservar inventario
        if not self.inventory_service.reserve_items(order.items):
            return False
        
        # 2. Procesar pago
        if not self.payment_gateway.charge(order.total, "credit_card"):
            return False
        
        # 3. Actualizar estado
        order.status = OrderStatus.PAID
        
        # 4. Guardar orden
        if not self.order_repo.save(order):
            return False
        
        # 5. Notificar usuario
        self.notification_service.send(
            order.user_id,
            f"Order {order.id} confirmed!"
        )
        
        return True

# ============= DEPENDENCY INJECTION CONTAINER =============

class ServiceContainer:
    """
    Contenedor de inyección de dependencias.
    Configura las dependencias concretas.
    """
    @staticmethod
    def create_order_service() -> OrderService:
        # Configuración de producción
        order_repo = PostgreSQLOrderRepository()
        payment_gateway = StripePaymentGateway()
        notification_service = EmailNotificationService()
        inventory_service = None  # Implementación real aquí
        
        return OrderService(
            order_repo,
            payment_gateway,
            notification_service,
            inventory_service
        )
    
    @staticmethod
    def create_test_order_service() -> OrderService:
        # Configuración de testing (mocks)
        order_repo = InMemoryOrderRepository()  # Mock
        payment_gateway = MockPaymentGateway()  # Mock
        notification_service = MockNotificationService()  # Mock
        inventory_service = MockInventoryService()  # Mock
        
        return OrderService(
            order_repo,
            payment_gateway,
            notification_service,
            inventory_service
        )

# ============= USO =============

# Producción
order_service = ServiceContainer.create_order_service()
order = Order(id="123", user_id="user1", items=[], total=100.0, status=OrderStatus.PENDING)
order_service.place_order(order)

# Testing (fácil de testear gracias a DIP)
test_order_service = ServiceContainer.create_test_order_service()
# Tests con mocks...
```

---

## Beneficios de SOLID en Arquitectura

### 1. Testabilidad

```python
# Gracias a DIP, podemos testear fácilmente
class MockPaymentGateway(PaymentGateway):
    def charge(self, amount: float, payment_method: str) -> bool:
        return True  # Siempre exitoso en tests

def test_place_order():
    mock_payment = MockPaymentGateway()
    order_service = OrderService(
        order_repo=MockOrderRepository(),
        payment_gateway=mock_payment,
        notification_service=MockNotificationService(),
        inventory_service=MockInventoryService()
    )
    
    order = Order(...)
    assert order_service.place_order(order) == True
```

### 2. Extensibilidad

```python
# OCP: Añadir nuevo método de pago sin modificar OrderService
class CryptoPaymentGateway(PaymentGateway):
    def charge(self, amount: float, payment_method: str) -> bool:
        # Implementación crypto
        return True

# Simplemente inyectamos la nueva implementación
crypto_payment = CryptoPaymentGateway()
order_service = OrderService(..., payment_gateway=crypto_payment, ...)
```

### 3. Mantenibilidad

```python
# SRP: Si cambia la lógica de pagos, solo modificamos PaymentGateway
# Si cambia la lógica de notificaciones, solo modificamos NotificationService
# OrderService permanece intacto
```

---

## Resumen

**SOLID a nivel arquitectónico**:

- **SRP**: Un servicio, una responsabilidad de negocio
- **OCP**: Extensión mediante nuevos componentes, no modificación
- **LSP**: Implementaciones intercambiables
- **ISP**: APIs específicas, no monolíticas
- **DIP**: Lógica de negocio independiente de infraestructura

**Siguiente paso**: Tema 2.3 - Arquitectura Limpia y Hexagonal
