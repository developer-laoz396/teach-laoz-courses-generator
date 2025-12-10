# Tema 5.2: Event-Driven Architecture y Event Sourcing

**Tiempo estimado**: 50 minutos  
**Nivel**: Avanzado  
**Prerrequisitos**: Tema 5.1

## Event-Driven Architecture (EDA)

**Definición**: Arquitectura donde los componentes se comunican mediante eventos.

**Componentes**:

- **Event Producers**: Generan eventos
- **Event Consumers**: Reaccionan a eventos
- **Event Bus**: Distribuye eventos

```python
from dataclasses import dataclass
from datetime import datetime
from typing import List, Callable, Dict, Any

@dataclass
class Event:
    """Evento del sistema."""
    id: str
    type: str
    data: Dict[str, Any]
    timestamp: datetime
    source: str

class EventBus:
    """Bus de eventos central."""
    def __init__(self):
        self.handlers: Dict[str, List[Callable]] = {}
    
    def subscribe(self, event_type: str, handler: Callable):
        """Suscribirse a tipo de evento."""
        if event_type not in self.handlers:
            self.handlers[event_type] = []
        self.handlers[event_type].append(handler)
    
    def publish(self, event: Event):
        """Publicar evento."""
        if event.type in self.handlers:
            for handler in self.handlers[event.type]:
                try:
                    handler(event)
                except Exception as e:
                    print(f"Error in handler: {e}")

# Uso
event_bus = EventBus()

# Producer
def create_order(order_data):
    # Lógica de creación
    order_id = save_order(order_data)
    
    # Publicar evento
    event_bus.publish(Event(
        id=str(uuid.uuid4()),
        type='order.created',
        data={'order_id': order_id, 'user_id': order_data['user_id']},
        timestamp=datetime.now(),
        source='order-service'
    ))

# Consumers
def send_confirmation_email(event: Event):
    print(f"📧 Sending email for order {event.data['order_id']}")

def update_inventory(event: Event):
    print(f"📦 Updating inventory for order {event.data['order_id']}")

event_bus.subscribe('order.created', send_confirmation_email)
event_bus.subscribe('order.created', update_inventory)
```

---

## Event Sourcing

**Definición**: Almacenar el estado como secuencia de eventos en lugar de estado actual.

**Ventajas**:

- Auditoría completa
- Time travel (reconstruir estado en cualquier momento)
- Event replay

```python
from typing import List
import json

class EventStore:
    """Almacén de eventos."""
    def __init__(self):
        self.events: List[Event] = []
    
    def append(self, event: Event):
        """Añadir evento."""
        self.events.append(event)
    
    def get_events(self, aggregate_id: str) -> List[Event]:
        """Obtener eventos de un agregado."""
        return [e for e in self.events if e.data.get('aggregate_id') == aggregate_id]
    
    def replay(self, aggregate_id: str, aggregate_class):
        """Reconstruir estado desde eventos."""
        events = self.get_events(aggregate_id)
        aggregate = aggregate_class()
        
        for event in events:
            aggregate.apply(event)
        
        return aggregate

# Agregado con Event Sourcing
class BankAccount:
    """Cuenta bancaria con Event Sourcing."""
    def __init__(self):
        self.account_id = None
        self.balance = 0
        self.transactions = []
    
    def apply(self, event: Event):
        """Aplicar evento para reconstruir estado."""
        if event.type == 'account.created':
            self.account_id = event.data['account_id']
            self.balance = event.data['initial_balance']
        
        elif event.type == 'account.deposited':
            self.balance += event.data['amount']
            self.transactions.append(('deposit', event.data['amount']))
        
        elif event.type == 'account.withdrawn':
            self.balance -= event.data['amount']
            self.transactions.append(('withdrawal', event.data['amount']))
    
    def deposit(self, amount: float, event_store: EventStore):
        """Depositar (genera evento)."""
        event = Event(
            id=str(uuid.uuid4()),
            type='account.deposited',
            data={'aggregate_id': self.account_id, 'amount': amount},
            timestamp=datetime.now(),
            source='bank-service'
        )
        
        event_store.append(event)
        self.apply(event)
    
    def withdraw(self, amount: float, event_store: EventStore):
        """Retirar (genera evento)."""
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        
        event = Event(
            id=str(uuid.uuid4()),
            type='account.withdrawn',
            data={'aggregate_id': self.account_id, 'amount': amount},
            timestamp=datetime.now(),
            source='bank-service'
        )
        
        event_store.append(event)
        self.apply(event)

# Uso
event_store = EventStore()

# Crear cuenta
account = BankAccount()
account.apply(Event(
    id=str(uuid.uuid4()),
    type='account.created',
    data={'account_id': 'ACC123', 'initial_balance': 1000},
    timestamp=datetime.now(),
    source='bank-service'
))

# Operaciones
account.deposit(500, event_store)
account.withdraw(200, event_store)

print(f"Balance: {account.balance}")  # 1300

# Reconstruir estado desde eventos
reconstructed = event_store.replay('ACC123', BankAccount)
print(f"Reconstructed balance: {reconstructed.balance}")  # 1300
```

---

## CQRS (Command Query Responsibility Segregation)

**Definición**: Separar lecturas (queries) de escrituras (commands).

```python
# Write Model (Commands)
class OrderCommandHandler:
    """Maneja comandos (escrituras)."""
    def __init__(self, event_store: EventStore):
        self.event_store = event_store
    
    def create_order(self, order_data):
        """Comando: Crear orden."""
        event = Event(
            id=str(uuid.uuid4()),
            type='order.created',
            data=order_data,
            timestamp=datetime.now(),
            source='order-service'
        )
        
        self.event_store.append(event)
        return event.data['order_id']

# Read Model (Queries)
class OrderQueryHandler:
    """Maneja queries (lecturas)."""
    def __init__(self):
        self.read_db = {}  # Proyección optimizada para lecturas
    
    def get_order(self, order_id):
        """Query: Obtener orden."""
        return self.read_db.get(order_id)
    
    def handle_order_created(self, event: Event):
        """Actualizar read model cuando se crea orden."""
        order_id = event.data['order_id']
        self.read_db[order_id] = {
            'id': order_id,
            'user_id': event.data['user_id'],
            'status': 'CREATED',
            'created_at': event.timestamp
        }

# Uso
command_handler = OrderCommandHandler(event_store)
query_handler = OrderQueryHandler()

# Suscribir query handler a eventos
event_bus.subscribe('order.created', query_handler.handle_order_created)

# Comando (escritura)
order_id = command_handler.create_order({
    'order_id': 'ORD123',
    'user_id': 'user456'
})

# Query (lectura)
order = query_handler.get_order('ORD123')
```

---

## Resumen

**EDA**: Comunicación mediante eventos, desacoplamiento total
**Event Sourcing**: Estado como secuencia de eventos
**CQRS**: Separar lecturas de escrituras

**Siguiente paso**: Tema 5.3 - Brokers de Mensajería
