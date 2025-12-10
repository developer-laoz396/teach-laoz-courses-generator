# Tema 6.4: Transacciones Distribuidas (2PC, Saga)

**Tiempo estimado**: 40 minutos  
**Nivel**: Avanzado

## Two-Phase Commit (2PC)

**Fase 1: Prepare**

- Coordinador pregunta a participantes si pueden commitear
- Participantes responden Yes/No

**Fase 2: Commit/Abort**

- Si todos Yes: Coordinador envía Commit
- Si algún No: Coordinador envía Abort

```python
class TwoPhaseCommitCoordinator:
    """Coordinador de 2PC."""
    def __init__(self, participants):
        self.participants = participants
    
    def execute_transaction(self, transaction_data):
        """Ejecutar transacción distribuida con 2PC."""
        # Fase 1: Prepare
        prepared = []
        
        for participant in self.participants:
            if participant.prepare(transaction_data):
                prepared.append(participant)
            else:
                # Algún participante no puede commitear
                self._abort(prepared)
                return False
        
        # Fase 2: Commit
        for participant in prepared:
            participant.commit()
        
        return True
    
    def _abort(self, prepared):
        """Abortar transacción."""
        for participant in prepared:
            participant.abort()

class Participant:
    """Participante en 2PC."""
    def prepare(self, data):
        """Fase 1: Preparar."""
        # Validar y lockear recursos
        return True  # o False si no puede commitear
    
    def commit(self):
        """Fase 2: Commitear."""
        # Aplicar cambios permanentemente
        pass
    
    def abort(self):
        """Fase 2: Abortar."""
        # Rollback cambios
        pass
```

**Problemas de 2PC**:

- Bloqueo de recursos
- Single point of failure (coordinador)
- No funciona bien en sistemas distribuidos modernos

---

## Saga Pattern (Alternativa a 2PC)

### Choreography-Based Saga

```python
class ChoreographySaga:
    """Saga con coreografía (sin coordinador central)."""
    def __init__(self, event_bus):
        self.event_bus = event_bus
        
        # Cada servicio escucha eventos y reacciona
        self.event_bus.subscribe('OrderCreated', self.on_order_created)
        self.event_bus.subscribe('PaymentFailed', self.on_payment_failed)
    
    def on_order_created(self, event):
        """Reaccionar a orden creada."""
        # Procesar pago
        payment_success = self.process_payment(event['order_id'])
        
        if payment_success:
            self.event_bus.publish('PaymentSucceeded', event)
        else:
            self.event_bus.publish('PaymentFailed', event)
    
    def on_payment_failed(self, event):
        """Compensar: Cancelar orden."""
        self.cancel_order(event['order_id'])
```

### Orchestration-Based Saga

```python
class OrchestrationSaga:
    """Saga con orquestación (coordinador central)."""
    def __init__(self):
        self.state = 'INITIAL'
    
    def execute(self, order_data):
        """Ejecutar saga orquestada."""
        try:
            # Paso 1
            self.state = 'RESERVING_INVENTORY'
            inventory_id = self.reserve_inventory(order_data['items'])
            
            # Paso 2
            self.state = 'PROCESSING_PAYMENT'
            payment_id = self.process_payment(order_data['amount'])
            
            # Paso 3
            self.state = 'CREATING_ORDER'
            order_id = self.create_order(order_data)
            
            self.state = 'COMPLETED'
            return {'status': 'success', 'order_id': order_id}
        
        except Exception as e:
            # Compensar según estado
            self._compensate()
            return {'status': 'failed', 'error': str(e)}
    
    def _compensate(self):
        """Compensar según estado actual."""
        if self.state == 'PROCESSING_PAYMENT':
            self.release_inventory()
        elif self.state == 'CREATING_ORDER':
            self.release_inventory()
            self.refund_payment()
```

---

## Resumen

**2PC**: Transacciones ACID distribuidas (bloqueante, no escalable)
**Saga**: Transacciones eventuales con compensaciones (no bloqueante, escalable)

**Regla**: Usa Saga en microservicios, evita 2PC

---

## ✅ MÓDULO 6 COMPLETADO

**Próximo módulo**: Arquitecturas Modernas y Operacionales
