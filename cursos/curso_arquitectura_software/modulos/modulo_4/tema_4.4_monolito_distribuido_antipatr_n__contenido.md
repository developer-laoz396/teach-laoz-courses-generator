# Tema 4.4: Monolito Distribuido (Anti-patrón)

**Tiempo estimado**: 30 minutos  
**Nivel**: Avanzado  
**Prerrequisitos**: Módulo 4 completo

## ¿Por qué importa?

**Monolito Distribuido** es el PEOR de ambos mundos:

- Complejidad de microservicios
- Acoplamiento de monolito
- Resultado: Sistema imposible de mantener

**Señales de alarma**:

- Servicios que no pueden desplegarse independientemente
- Cambios requieren modificar múltiples servicios
- Shared database con acoplamiento fuerte
- Transacciones distribuidas en todas partes

---

## Cómo se crea (accidentalmente)

```python
# Paso 1: Empiezas con microservicios
class UserService:
    def create_user(self, data):
        # Crear usuario
        user_id = self.db.insert('users', data)
        
        # ❌ Llamada síncrona a otro servicio
        response = requests.post('http://order-service/init', {
            'user_id': user_id
        })
        
        # ❌ Si falla, rollback manual
        if response.status_code != 200:
            self.db.delete('users', user_id)
            raise Exception("Failed to initialize order service")
        
        return user_id

# Paso 2: Order Service también llama a User Service
class OrderService:
    def create_order(self, user_id):
        # ❌ Validar usuario llamando a User Service
        user = requests.get(f'http://user-service/users/{user_id}').json()
        
        # ❌ Llamar a Payment Service
        payment = requests.post('http://payment-service/reserve', {
            'user_id': user_id
        }).json()
        
        # ❌ Llamar a Inventory Service
        inventory = requests.post('http://inventory-service/reserve', {
            'items': items
        }).json()
        
        # Resultado: Dependencias circulares, acoplamiento fuerte
```

**Resultado**: No puedes desplegar ningún servicio independientemente.

---

## Señales de Monolito Distribuido

### 1. Dependencias Circulares

```
User Service → Order Service → Payment Service → User Service
```

### 2. Shared Database con Acoplamiento

```python
# ❌ Múltiples servicios accediendo mismas tablas
class UserService:
    def get_user_with_orders(self, user_id):
        # Accede directamente a tabla de orders
        return self.db.query('''
            SELECT u.*, o.*
            FROM users u
            JOIN orders o ON u.id = o.user_id
            WHERE u.id = ?
        ''', user_id)
```

### 3. Transacciones Distribuidas

```python
# ❌ Transacción que span múltiples servicios
def transfer_money(from_user, to_user, amount):
    # Servicio 1: Debit
    requests.post('http://account-service/debit', {
        'user_id': from_user,
        'amount': amount
    })
    
    # Servicio 2: Credit
    requests.post('http://account-service/credit', {
        'user_id': to_user,
        'amount': amount
    })
    
    # ¿Qué pasa si el segundo falla?
```

---

## Cómo Evitarlo

### 1. Bounded Contexts (DDD)

Cada servicio debe ser autónomo en su dominio.

### 2. Async Communication

```python
# ✅ BIEN: Eventos asíncronos
event_bus.publish('user.created', {'user_id': user_id})

# Otros servicios reaccionan independientemente
```

### 3. Saga Pattern para Transacciones

```python
class OrderSaga:
    """Saga para crear orden (transacción distribuida)."""
    def execute(self, order_data):
        # Paso 1: Reservar inventario
        inventory_reserved = self.reserve_inventory(order_data['items'])
        
        if not inventory_reserved:
            return {'status': 'failed', 'reason': 'inventory'}
        
        # Paso 2: Procesar pago
        payment_processed = self.process_payment(order_data['amount'])
        
        if not payment_processed:
            # Compensación: Liberar inventario
            self.release_inventory(order_data['items'])
            return {'status': 'failed', 'reason': 'payment'}
        
        # Paso 3: Crear orden
        order_created = self.create_order(order_data)
        
        return {'status': 'success', 'order_id': order_created}
```

---

## Resumen

**Monolito Distribuido**: Anti-patrón que combina lo peor de monolitos y microservicios.

**Cómo evitarlo**:

- Bounded contexts claros
- Comunicación asíncrona
- Evitar shared database
- Sagas para transacciones distribuidas

**Regla de oro**: Si no puedes desplegar servicios independientemente, tienes un monolito distribuido.

---

## ✅ MÓDULO 4 COMPLETADO

**Próximo módulo**: Arquitecturas Basadas en Eventos
