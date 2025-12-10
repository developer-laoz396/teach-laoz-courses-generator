# BANCO DE EJERCICIOS: Arquitectura Limpia y Hexagonal

## METADATA

- **Módulo**: Módulo 2 - Principios de Diseño
- **Tema**: 2.3 - Arquitectura Limpia y Hexagonal
- **Objetivos evaluados**:
  - Implementar Ports & Adapters
  - Aplicar Dependency Inversion
  - Diseñar arquitectura testeable
- **Tiempo total estimado**: 90 minutos
- **Tipo**: Formativa
- **Nivel de ruta**: Avanzada

---

## EJERCICIO 1: Implementar Port y Adapter

### METADATA

- **ID**: `EJ-M2-001`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo estimado**: 30 minutos
- **Nivel Bloom**: Aplicar
- **Conceptos evaluados**: Ports, Adapters, Dependency Inversion
- **Tipo**: Implementación

### ENUNCIADO

Implementa un sistema de notificaciones usando arquitectura hexagonal.

**Requisitos**:

- Port (interfaz): `NotificationPort`
- Adapters: `EmailAdapter`, `SMSAdapter`
- Core: `NotificationService` que usa el port

### ESQUELETO DE CÓDIGO

```python
from abc import ABC, abstractmethod

# PORT (Interfaz)
class NotificationPort(ABC):
    """Puerto de salida para notificaciones."""
    @abstractmethod
    def send(self, recipient: str, message: str) -> bool:
        pass

# ADAPTERS (Implementaciones)
class EmailAdapter(NotificationPort):
    """Adaptador para envío de emails."""
    def send(self, recipient: str, message: str) -> bool:
        # TODO: Implementar
        pass

class SMSAdapter(NotificationPort):
    """Adaptador para envío de SMS."""
    def send(self, recipient: str, message: str) -> bool:
        # TODO: Implementar
        pass

# CORE (Lógica de negocio)
class NotificationService:
    """Servicio de notificaciones (core domain)."""
    def __init__(self, notification_port: NotificationPort):
        # TODO: Implementar
        pass
    
    def notify_user(self, user_id: str, message: str) -> bool:
        """
        Notifica a un usuario.
        
        Args:
            user_id: ID del usuario
            message: Mensaje a enviar
        
        Returns:
            True si se envió correctamente
        """
        # TODO: Implementar
        pass
```

### CASOS DE PRUEBA

```python
# Test 1: Email adapter
email_adapter = EmailAdapter()
service = NotificationService(email_adapter)
assert service.notify_user('user@example.com', 'Hello') == True

# Test 2: SMS adapter (intercambiable)
sms_adapter = SMSAdapter()
service = NotificationService(sms_adapter)
assert service.notify_user('+1234567890', 'Hello') == True

# Test 3: Mock adapter para testing
class MockAdapter(NotificationPort):
    def __init__(self):
        self.sent_messages = []
    
    def send(self, recipient: str, message: str) -> bool:
        self.sent_messages.append((recipient, message))
        return True

mock = MockAdapter()
service = NotificationService(mock)
service.notify_user('test', 'message')
assert len(mock.sent_messages) == 1
```

### SOLUCIÓN MODELO

```python
from abc import ABC, abstractmethod

class NotificationPort(ABC):
    @abstractmethod
    def send(self, recipient: str, message: str) -> bool:
        pass

class EmailAdapter(NotificationPort):
    def send(self, recipient: str, message: str) -> bool:
        # Simular envío de email
        print(f"📧 Sending email to {recipient}: {message}")
        return True

class SMSAdapter(NotificationPort):
    def send(self, recipient: str, message: str) -> bool:
        # Simular envío de SMS
        print(f"📱 Sending SMS to {recipient}: {message}")
        return True

class NotificationService:
    def __init__(self, notification_port: NotificationPort):
        self.notification_port = notification_port
    
    def notify_user(self, user_id: str, message: str) -> bool:
        return self.notification_port.send(user_id, message)
```

---

## EJERCICIO 2: Refactorizar a Arquitectura Hexagonal

### METADATA

- **ID**: `EJ-M2-002`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 45 minutos
- **Nivel Bloom**: Analizar/Crear
- **Conceptos evaluados**: Refactoring, Ports & Adapters, Testabilidad
- **Tipo**: Refactoring

### ENUNCIADO

Refactoriza el siguiente código monolítico a arquitectura hexagonal:

```python
# Código monolítico (MAL)
class OrderService:
    def create_order(self, user_id, items):
        # Validar usuario (acoplado a MySQL)
        import mysql.connector
        conn = mysql.connector.connect(host='localhost', database='users')
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM users WHERE id = {user_id}")
        user = cursor.fetchone()
        
        if not user:
            return None
        
        # Calcular total
        total = sum(item['price'] * item['quantity'] for item in items)
        
        # Guardar orden (acoplado a MySQL)
        cursor.execute(f"INSERT INTO orders (user_id, total) VALUES ({user_id}, {total})")
        conn.commit()
        order_id = cursor.lastrowid
        
        # Enviar email (acoplado a SMTP)
        import smtplib
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.send_message(f"Order {order_id} created")
        
        return order_id
```

**Tarea**: Refactorizar a arquitectura hexagonal con:

- Ports para: UserRepository, OrderRepository, NotificationService
- Core domain independiente de infraestructura
- Adapters intercambiables

### SOLUCIÓN MODELO

```python
from abc import ABC, abstractmethod
from typing import Optional, List, Dict

# ===== DOMAIN MODELS =====
class Order:
    def __init__(self, user_id: str, items: List[Dict]):
        self.user_id = user_id
        self.items = items
        self.total = sum(item['price'] * item['quantity'] for item in items)

# ===== PORTS =====
class UserRepository(ABC):
    @abstractmethod
    def find_by_id(self, user_id: str) -> Optional[Dict]:
        pass

class OrderRepository(ABC):
    @abstractmethod
    def save(self, order: Order) -> str:
        pass

class NotificationService(ABC):
    @abstractmethod
    def send_order_confirmation(self, order_id: str, user_email: str):
        pass

# ===== CORE (Business Logic) =====
class OrderService:
    def __init__(self, 
                 user_repo: UserRepository,
                 order_repo: OrderRepository,
                 notification_service: NotificationService):
        self.user_repo = user_repo
        self.order_repo = order_repo
        self.notification_service = notification_service
    
    def create_order(self, user_id: str, items: List[Dict]) -> Optional[str]:
        # Validar usuario
        user = self.user_repo.find_by_id(user_id)
        if not user:
            return None
        
        # Crear orden
        order = Order(user_id, items)
        
        # Guardar
        order_id = self.order_repo.save(order)
        
        # Notificar
        self.notification_service.send_order_confirmation(order_id, user['email'])
        
        return order_id

# ===== ADAPTERS =====
class MySQLUserRepository(UserRepository):
    def find_by_id(self, user_id: str) -> Optional[Dict]:
        # Implementación MySQL
        pass

class MySQLOrderRepository(OrderRepository):
    def save(self, order: Order) -> str:
        # Implementación MySQL
        pass

class EmailNotificationService(NotificationService):
    def send_order_confirmation(self, order_id: str, user_email: str):
        # Implementación SMTP
        pass
```

---

## EJERCICIO 3: Testing con Arquitectura Hexagonal

### METADATA

- **ID**: `EJ-M2-003`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo estimado**: 15 minutos
- **Nivel Bloom**: Aplicar
- **Conceptos evaluados**: Testing, Mocks, Dependency Injection
- **Tipo**: Testing

### ENUNCIADO

Escribe tests unitarios para `OrderService` sin usar base de datos real.

```python
import pytest

# TODO: Implementar mocks
class MockUserRepository(UserRepository):
    pass

class MockOrderRepository(OrderRepository):
    pass

class MockNotificationService(NotificationService):
    pass

# TODO: Implementar tests
def test_create_order_success():
    # Arrange
    # Act
    # Assert
    pass

def test_create_order_user_not_found():
    pass

def test_create_order_sends_notification():
    pass
```

### SOLUCIÓN MODELO

```python
import pytest

class MockUserRepository(UserRepository):
    def __init__(self, users=None):
        self.users = users or {}
    
    def find_by_id(self, user_id: str):
        return self.users.get(user_id)

class MockOrderRepository(OrderRepository):
    def __init__(self):
        self.orders = []
    
    def save(self, order: Order) -> str:
        order_id = f"ORDER-{len(self.orders) + 1}"
        self.orders.append((order_id, order))
        return order_id

class MockNotificationService(NotificationService):
    def __init__(self):
        self.sent_notifications = []
    
    def send_order_confirmation(self, order_id: str, user_email: str):
        self.sent_notifications.append((order_id, user_email))

def test_create_order_success():
    # Arrange
    user_repo = MockUserRepository({'user1': {'email': 'test@example.com'}})
    order_repo = MockOrderRepository()
    notification = MockNotificationService()
    
    service = OrderService(user_repo, order_repo, notification)
    
    # Act
    order_id = service.create_order('user1', [{'price': 10, 'quantity': 2}])
    
    # Assert
    assert order_id is not None
    assert len(order_repo.orders) == 1
    assert len(notification.sent_notifications) == 1

def test_create_order_user_not_found():
    user_repo = MockUserRepository({})
    order_repo = MockOrderRepository()
    notification = MockNotificationService()
    
    service = OrderService(user_repo, order_repo, notification)
    
    order_id = service.create_order('invalid', [])
    
    assert order_id is None
    assert len(order_repo.orders) == 0
```

---

## AUTOEVALUACIÓN

- [ ] Puedo identificar Ports y Adapters en un sistema
- [ ] Entiendo cómo aplicar Dependency Inversion
- [ ] Puedo testear lógica de negocio sin infraestructura
- [ ] Sé cuándo usar arquitectura hexagonal vs layered
