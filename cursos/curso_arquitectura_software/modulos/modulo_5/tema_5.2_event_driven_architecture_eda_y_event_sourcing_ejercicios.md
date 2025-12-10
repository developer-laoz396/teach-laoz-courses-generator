# BANCO DE EJERCICIOS: Event-Driven Architecture y Event Sourcing

## METADATA

- **Módulo**: Módulo 5 - Arquitecturas Basadas en Eventos
- **Tema**: 5.2 - Event-Driven Architecture y Event Sourcing
- **Objetivos evaluados**:
  - Implementar Event Bus
  - Aplicar Event Sourcing
  - Diseñar CQRS
- **Tiempo total estimado**: 120 minutos
- **Tipo**: Formativa

---

## EJERCICIO 1: Implementar Event Bus

### METADATA

- **ID**: `EJ-M5-001`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo estimado**: 30 minutos
- **Nivel Bloom**: Aplicar
- **Tipo**: Implementación

### ENUNCIADO

Implementa un Event Bus que permita publicar y suscribirse a eventos.

### ESQUELETO DE CÓDIGO

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Callable, Any

@dataclass
class Event:
    id: str
    type: str
    data: Dict[str, Any]
    timestamp: datetime
    source: str

class EventBus:
    """Event Bus para comunicación desacoplada."""
    def __init__(self):
        # TODO: Implementar
        pass
    
    def subscribe(self, event_type: str, handler: Callable):
        """Suscribirse a un tipo de evento."""
        # TODO: Implementar
        pass
    
    def publish(self, event: Event):
        """Publicar evento a todos los suscriptores."""
        # TODO: Implementar
        pass
```

### CASOS DE PRUEBA

```python
# Test 1: Suscripción y publicación básica
bus = EventBus()
received_events = []

def handler(event):
    received_events.append(event)

bus.subscribe('order.created', handler)
bus.publish(Event('1', 'order.created', {'order_id': '123'}, datetime.now(), 'order-service'))

assert len(received_events) == 1

# Test 2: Múltiples suscriptores
handler2_called = False

def handler2(event):
    global handler2_called
    handler2_called = True

bus.subscribe('order.created', handler2)
bus.publish(Event('2', 'order.created', {}, datetime.now(), 'test'))

assert handler2_called == True
```

### SOLUCIÓN MODELO

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Callable, Any

@dataclass
class Event:
    id: str
    type: str
    data: Dict[str, Any]
    timestamp: datetime
    source: str

class EventBus:
    def __init__(self):
        self.handlers: Dict[str, List[Callable]] = {}
    
    def subscribe(self, event_type: str, handler: Callable):
        if event_type not in self.handlers:
            self.handlers[event_type] = []
        self.handlers[event_type].append(handler)
    
    def publish(self, event: Event):
        if event.type in self.handlers:
            for handler in self.handlers[event.type]:
                try:
                    handler(event)
                except Exception as e:
                    print(f"Error in handler: {e}")
```

---

## EJERCICIO 2: Implementar Event Store

### METADATA

- **ID**: `EJ-M5-002`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 45 minutos
- **Nivel Bloom**: Crear
- **Tipo**: Implementación

### ENUNCIADO

Implementa un Event Store que permita almacenar eventos y reconstruir estado.

### ESQUELETO DE CÓDIGO

```python
class EventStore:
    """Almacén de eventos para Event Sourcing."""
    def __init__(self):
        # TODO: Implementar
        pass
    
    def append(self, event: Event):
        """Añadir evento al store."""
        # TODO: Implementar
        pass
    
    def get_events(self, aggregate_id: str) -> List[Event]:
        """Obtener eventos de un agregado."""
        # TODO: Implementar
        pass
    
    def replay(self, aggregate_id: str, aggregate_class):
        """Reconstruir estado desde eventos."""
        # TODO: Implementar
        pass

class BankAccount:
    """Agregado con Event Sourcing."""
    def __init__(self):
        self.account_id = None
        self.balance = 0
    
    def apply(self, event: Event):
        """Aplicar evento para reconstruir estado."""
        # TODO: Implementar
        pass
```

### SOLUCIÓN MODELO

```python
class EventStore:
    def __init__(self):
        self.events: List[Event] = []
    
    def append(self, event: Event):
        self.events.append(event)
    
    def get_events(self, aggregate_id: str) -> List[Event]:
        return [e for e in self.events if e.data.get('aggregate_id') == aggregate_id]
    
    def replay(self, aggregate_id: str, aggregate_class):
        events = self.get_events(aggregate_id)
        aggregate = aggregate_class()
        
        for event in events:
            aggregate.apply(event)
        
        return aggregate

class BankAccount:
    def __init__(self):
        self.account_id = None
        self.balance = 0
    
    def apply(self, event: Event):
        if event.type == 'account.created':
            self.account_id = event.data['account_id']
            self.balance = event.data['initial_balance']
        elif event.type == 'account.deposited':
            self.balance += event.data['amount']
        elif event.type == 'account.withdrawn':
            self.balance -= event.data['amount']
```

---

## EJERCICIO 3: Implementar CQRS

### METADATA

- **ID**: `EJ-M5-003`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 45 minutos
- **Nivel Bloom**: Crear
- **Tipo**: Implementación

### ENUNCIADO

Implementa CQRS separando comandos (escrituras) de queries (lecturas).

### ESQUELETO DE CÓDIGO

```python
# Write Model (Commands)
class OrderCommandHandler:
    def __init__(self, event_store: EventStore):
        # TODO: Implementar
        pass
    
    def create_order(self, order_data):
        # TODO: Implementar
        pass

# Read Model (Queries)
class OrderQueryHandler:
    def __init__(self):
        # TODO: Implementar
        pass
    
    def get_order(self, order_id):
        # TODO: Implementar
        pass
    
    def handle_order_created(self, event: Event):
        # TODO: Implementar
        pass
```

### SOLUCIÓN MODELO

```python
class OrderCommandHandler:
    def __init__(self, event_store: EventStore):
        self.event_store = event_store
    
    def create_order(self, order_data):
        event = Event(
            id=str(uuid.uuid4()),
            type='order.created',
            data=order_data,
            timestamp=datetime.now(),
            source='order-service'
        )
        
        self.event_store.append(event)
        return event.data['order_id']

class OrderQueryHandler:
    def __init__(self):
        self.read_db = {}
    
    def get_order(self, order_id):
        return self.read_db.get(order_id)
    
    def handle_order_created(self, event: Event):
        order_id = event.data['order_id']
        self.read_db[order_id] = {
            'id': order_id,
            'user_id': event.data['user_id'],
            'status': 'CREATED',
            'created_at': event.timestamp
        }
```

---

## AUTOEVALUACIÓN

- [ ] Puedo implementar un Event Bus funcional
- [ ] Entiendo cómo funciona Event Sourcing
- [ ] Puedo aplicar CQRS para separar lecturas de escrituras
- [ ] Sé cuándo usar Event-Driven Architecture
