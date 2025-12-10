# Tema 5.1: Comunicación Síncrona vs Asíncrona

**Tiempo estimado**: 40 minutos  
**Nivel**: Intermedio  
**Prerrequisitos**: Módulo 4

## ¿Por qué importa?

La elección entre comunicación **síncrona** y **asíncrona** es una de las decisiones arquitectónicas más importantes en sistemas distribuidos.

**Impacto**:

- Performance y latencia
- Resiliencia y disponibilidad
- Complejidad del sistema
- Experiencia de usuario

---

## Comunicación Síncrona

### Definición

**Síncrona**: El cliente espera respuesta inmediata del servidor.

```python
# Ejemplo: HTTP Request/Response
import requests

def get_user_profile(user_id):
    # Cliente ESPERA respuesta
    response = requests.get(f'http://api.example.com/users/{user_id}')
    
    # Bloquea hasta recibir respuesta
    return response.json()

# Llamada bloquea el thread
user = get_user_profile('123')
print(user)  # Solo se ejecuta después de recibir respuesta
```

### Ventajas ✅

1. **Simplicidad**: Fácil de entender y debuggear
2. **Inmediatez**: Respuesta inmediata
3. **Consistencia**: Sabes el resultado inmediatamente

### Desventajas ❌

1. **Acoplamiento temporal**: Cliente y servidor deben estar disponibles simultáneamente
2. **Latencia acumulativa**: Llamadas en cadena suman latencias
3. **Bloqueo de recursos**: Thread bloqueado esperando respuesta
4. **Cascading failures**: Falla de un servicio afecta a todos

### Ejemplo: Cascading Failure

```python
def process_order(order_id):
    # Llamada 1: 100ms
    user = get_user(order['user_id'])
    
    # Llamada 2: 200ms
    inventory = check_inventory(order['items'])
    
    # Llamada 3: 150ms
    payment = process_payment(order['total'])
    
    # Latencia total: 450ms
    # Si cualquiera falla, TODO falla
```

---

## Comunicación Asíncrona

### Definición

**Asíncrona**: El cliente no espera respuesta inmediata. Continúa procesando.

```python
import asyncio
import aiohttp

async def get_user_profile_async(user_id):
    async with aiohttp.ClientSession() as session:
        async with session.get(f'http://api.example.com/users/{user_id}') as response:
            return await response.json()

# Llamada no bloquea
async def main():
    # Inicia request pero no espera
    task = asyncio.create_task(get_user_profile_async('123'))
    
    # Puede hacer otras cosas mientras espera
    print("Doing other work...")
    
    # Espera cuando necesita el resultado
    user = await task
    print(user)

asyncio.run(main())
```

### Ventajas ✅

1. **Desacoplamiento temporal**: Cliente y servidor no necesitan estar disponibles simultáneamente
2. **Mejor throughput**: No bloquea recursos
3. **Resiliencia**: Fallas aisladas
4. **Escalabilidad**: Maneja más requests concurrentes

### Desventajas ❌

1. **Complejidad**: Más difícil de entender y debuggear
2. **Eventual consistency**: No sabes resultado inmediatamente
3. **Error handling**: Más complejo
4. **Ordenamiento**: Puede requerir lógica adicional

---

## Patrones de Comunicación Asíncrona

### 1. Message Queue

```python
import pika
import json

class MessageQueue:
    """Message Queue con RabbitMQ."""
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters('localhost')
        )
        self.channel = self.connection.channel()
    
    def publish(self, queue: str, message: dict):
        """Publicar mensaje (fire-and-forget)."""
        self.channel.queue_declare(queue=queue, durable=True)
        
        self.channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2  # Mensaje persistente
            )
        )
        
        print(f"✓ Message published to {queue}")
    
    def consume(self, queue: str, callback):
        """Consumir mensajes."""
        self.channel.queue_declare(queue=queue, durable=True)
        
        def wrapper(ch, method, properties, body):
            message = json.loads(body)
            callback(message)
            ch.basic_ack(delivery_tag=method.delivery_tag)
        
        self.channel.basic_consume(
            queue=queue,
            on_message_callback=wrapper
        )
        
        print(f"Waiting for messages in {queue}...")
        self.channel.start_consuming()

# Producer
mq = MessageQueue()
mq.publish('orders', {
    'order_id': '123',
    'user_id': 'user456',
    'total': 100.0
})

# Consumer
def process_order(message):
    print(f"Processing order: {message['order_id']}")

mq.consume('orders', process_order)
```

### 2. Publish/Subscribe

```python
class PubSub:
    """Publish/Subscribe pattern."""
    def __init__(self):
        self.subscribers = {}
    
    def subscribe(self, topic: str, callback):
        """Suscribirse a un topic."""
        if topic not in self.subscribers:
            self.subscribers[topic] = []
        
        self.subscribers[topic].append(callback)
    
    def publish(self, topic: str, message: dict):
        """Publicar mensaje a topic."""
        if topic in self.subscribers:
            for callback in self.subscribers[topic]:
                callback(message)

# Uso
pubsub = PubSub()

# Múltiples suscriptores
def send_email(message):
    print(f"📧 Sending email for order {message['order_id']}")

def update_inventory(message):
    print(f"📦 Updating inventory for order {message['order_id']}")

def send_analytics(message):
    print(f"📊 Sending analytics for order {message['order_id']}")

pubsub.subscribe('order.created', send_email)
pubsub.subscribe('order.created', update_inventory)
pubsub.subscribe('order.created', send_analytics)

# Publicar evento
pubsub.publish('order.created', {
    'order_id': '123',
    'user_id': 'user456'
})

# Output:
# 📧 Sending email for order 123
# 📦 Updating inventory for order 123
# 📊 Sending analytics for order 123
```

### 3. Request/Reply Asíncrono

```python
import uuid

class AsyncRequestReply:
    """Request/Reply asíncrono con correlation ID."""
    def __init__(self, mq: MessageQueue):
        self.mq = mq
        self.pending_requests = {}
    
    def request(self, queue: str, message: dict, callback):
        """Enviar request asíncrono."""
        correlation_id = str(uuid.uuid4())
        
        # Guardar callback
        self.pending_requests[correlation_id] = callback
        
        # Enviar request con correlation ID
        self.mq.publish(queue, {
            'correlation_id': correlation_id,
            'data': message
        })
    
    def reply(self, correlation_id: str, response: dict):
        """Enviar reply."""
        if correlation_id in self.pending_requests:
            callback = self.pending_requests[correlation_id]
            callback(response)
            del self.pending_requests[correlation_id]

# Uso
async_rr = AsyncRequestReply(mq)

def handle_response(response):
    print(f"Received response: {response}")

async_rr.request('user.get', {'user_id': '123'}, handle_response)
```

---

## Cuándo usar cada uno

### Usar Síncrono cuando

- ✅ Necesitas respuesta inmediata
- ✅ Operación es crítica para continuar
- ✅ Sistema es simple
- ✅ Latencia es baja

### Usar Asíncrono cuando

- ✅ Operación puede tomar tiempo
- ✅ No necesitas respuesta inmediata
- ✅ Quieres desacoplar servicios
- ✅ Necesitas alta disponibilidad

---

## Patrón Híbrido

```python
class HybridCommunication:
    """Comunicación híbrida: síncrona + asíncrona."""
    def __init__(self, mq: MessageQueue):
        self.mq = mq
    
    def create_order(self, order_data):
        """
        Crear orden con patrón híbrido.
        """
        # 1. Validación síncrona (rápida, crítica)
        user = self.validate_user_sync(order_data['user_id'])
        if not user:
            raise ValueError("Invalid user")
        
        # 2. Crear orden síncrona
        order_id = self.save_order(order_data)
        
        # 3. Procesos no críticos asíncronos
        self.mq.publish('order.created', {
            'order_id': order_id,
            'user_id': order_data['user_id']
        })
        
        # Retorna inmediatamente
        return {
            'order_id': order_id,
            'status': 'PENDING'
        }
    
    def validate_user_sync(self, user_id):
        """Validación síncrona (crítica)."""
        response = requests.get(f'http://user-service/users/{user_id}')
        return response.json() if response.status_code == 200 else None
```

---

## Resumen

**Síncrono**: Simple, inmediato, pero acoplado y frágil
**Asíncrono**: Complejo, eventual, pero desacoplado y resiliente

**Regla**: Usa síncrono para operaciones críticas e inmediatas. Usa asíncrono para todo lo demás.

**Siguiente paso**: Tema 5.2 - Event-Driven Architecture y Event Sourcing
