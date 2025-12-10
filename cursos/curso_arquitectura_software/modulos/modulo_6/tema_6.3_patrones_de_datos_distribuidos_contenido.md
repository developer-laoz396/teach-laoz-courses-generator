# Tema 6.3: Patrones de Datos Distribuidos

**Tiempo estimado**: 40 minutos  
**Nivel**: Avanzado

## 1. Database per Service

**Patrón**: Cada microservicio tiene su propia base de datos.

```python
# User Service - PostgreSQL
class UserService:
    def __init__(self):
        self.db = PostgreSQLConnection('users_db')
    
    def create_user(self, data):
        return self.db.insert('users', data)

# Order Service - MongoDB
class OrderService:
    def __init__(self):
        self.db = MongoDBConnection('orders_db')
    
    def create_order(self, data):
        return self.db.insert('orders', data)
```

**Ventajas**: Autonomía, escalabilidad independiente
**Desventajas**: Joins distribuidos, consistencia

---

## 2. Saga Pattern

**Patrón**: Transacciones distribuidas mediante secuencia de transacciones locales.

```python
class OrderSaga:
    """Saga para crear orden (transacción distribuida)."""
    def __init__(self):
        self.steps = []
        self.compensations = []
    
    def execute(self, order_data):
        """Ejecutar saga."""
        try:
            # Paso 1: Reservar inventario
            inventory_id = self.reserve_inventory(order_data['items'])
            self.steps.append(('inventory', inventory_id))
            self.compensations.append(lambda: self.release_inventory(inventory_id))
            
            # Paso 2: Procesar pago
            payment_id = self.process_payment(order_data['amount'])
            self.steps.append(('payment', payment_id))
            self.compensations.append(lambda: self.refund_payment(payment_id))
            
            # Paso 3: Crear orden
            order_id = self.create_order(order_data)
            self.steps.append(('order', order_id))
            
            return {'status': 'success', 'order_id': order_id}
        
        except Exception as e:
            # Compensar pasos exitosos
            self._compensate()
            return {'status': 'failed', 'error': str(e)}
    
    def _compensate(self):
        """Ejecutar compensaciones en orden inverso."""
        for compensation in reversed(self.compensations):
            try:
                compensation()
            except Exception as e:
                print(f"Compensation failed: {e}")
```

---

## 3. CQRS (Command Query Responsibility Segregation)

```python
# Write Model
class OrderWriteModel:
    def __init__(self, event_store):
        self.event_store = event_store
    
    def create_order(self, data):
        """Comando: Crear orden."""
        event = {'type': 'OrderCreated', 'data': data}
        self.event_store.append(event)

# Read Model (Proyección)
class OrderReadModel:
    def __init__(self):
        self.orders = {}  # Optimizado para queries
    
    def handle_order_created(self, event):
        """Actualizar read model."""
        order_id = event['data']['id']
        self.orders[order_id] = event['data']
    
    def get_order(self, order_id):
        """Query: Obtener orden."""
        return self.orders.get(order_id)
```

---

## 4. Event Sourcing

```python
class EventSourcedAggregate:
    """Agregado con Event Sourcing."""
    def __init__(self):
        self.events = []
        self.version = 0
    
    def apply_event(self, event):
        """Aplicar evento para reconstruir estado."""
        self.events.append(event)
        self.version += 1
        self._handle_event(event)
    
    def _handle_event(self, event):
        """Manejar evento específico."""
        pass  # Implementar en subclase
```

---

## Resumen

**Database per Service**: Autonomía de datos
**Saga**: Transacciones distribuidas
**CQRS**: Separar lecturas de escrituras
**Event Sourcing**: Estado como eventos

**Siguiente paso**: Tema 6.4 - Transacciones Distribuidas
