# Tema 4.2: Arquitectura de Microservicios

**Tiempo estimado**: 60 minutos  
**Nivel**: Avanzado  
**Prerrequisitos**: Tema 4.1, Módulo 3

## ¿Por qué importa este concepto?

**Microservicios** es un estilo arquitectónico donde una aplicación se construye como conjunto de servicios pequeños, independientes y desplegables.

**Características clave**:

- Servicios pequeños y enfocados
- Deployment independiente
- Ownership de equipo completo
- Comunicación vía APIs
- Descentralización de datos

**Casos reales**:

- **Netflix**: 1000+ microservicios
- **Uber**: 2000+ microservicios
- **Amazon**: Pioneros del patrón

---

## Principios Fundamentales

### 1. Single Responsibility per Service

```python
# ❌ MAL: Servicio monolítico
class UserService:
    def create_user(self): pass
    def authenticate(self): pass
    def send_notification(self): pass
    def process_payment(self): pass
    def generate_report(self): pass

# ✅ BIEN: Servicios separados
class UserManagementService:
    def create_user(self): pass
    def update_user(self): pass

class AuthenticationService:
    def authenticate(self): pass
    def refresh_token(self): pass

class NotificationService:
    def send_email(self): pass
    def send_sms(self): pass

class PaymentService:
    def process_payment(self): pass

class ReportingService:
    def generate_report(self): pass
```

### 2. Database per Service

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   User      │  │   Order     │  │  Payment    │
│  Service    │  │  Service    │  │  Service    │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│   User DB   │  │  Order DB   │  │ Payment DB  │
└─────────────┘  └─────────────┘  └─────────────┘
```

### 3. API Gateway Pattern

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

class APIGateway:
    """
    API Gateway: Punto de entrada único.
    Enruta requests a microservicios apropiados.
    """
    def __init__(self):
        self.services = {
            'user': 'http://user-service:8001',
            'order': 'http://order-service:8002',
            'payment': 'http://payment-service:8003'
        }
    
    def route_request(self, service_name: str, endpoint: str, method: str = 'GET', data=None):
        """Enruta request al servicio apropiado."""
        base_url = self.services.get(service_name)
        
        if not base_url:
            return {'error': 'Service not found'}, 404
        
        url = f"{base_url}{endpoint}"
        
        try:
            if method == 'GET':
                response = requests.get(url, timeout=5)
            elif method == 'POST':
                response = requests.post(url, json=data, timeout=5)
            
            return response.json(), response.status_code
        
        except requests.exceptions.Timeout:
            return {'error': 'Service timeout'}, 504
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}, 500

gateway = APIGateway()

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Gateway endpoint que enruta a User Service."""
    result, status = gateway.route_request('user', f'/users/{user_id}')
    return jsonify(result), status

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Gateway endpoint que enruta a Order Service."""
    result, status = gateway.route_request('order', '/orders', 'POST', request.json)
    return jsonify(result), status
```

---

## Implementación: E-commerce con Microservicios

### Servicio 1: User Service

```python
# user_service/app.py

from flask import Flask, request, jsonify
from dataclasses import dataclass
import uuid

app = Flask(__name__)

@dataclass
class User:
    id: str
    email: str
    name: str

class UserRepository:
    def __init__(self):
        self.users = {}
    
    def save(self, user: User):
        self.users[user.id] = user
    
    def find_by_id(self, user_id: str):
        return self.users.get(user_id)

user_repo = UserRepository()

@app.route('/users', methods=['POST'])
def create_user():
    """Crear usuario."""
    data = request.json
    
    user = User(
        id=str(uuid.uuid4()),
        email=data['email'],
        name=data['name']
    )
    
    user_repo.save(user)
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name
    }), 201

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Obtener usuario."""
    user = user_repo.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'name': user.name
    })

if __name__ == '__main__':
    app.run(port=8001)
```

### Servicio 2: Order Service

```python
# order_service/app.py

from flask import Flask, request, jsonify
import requests
import uuid

app = Flask(__name__)

@dataclass
class Order:
    id: str
    user_id: str
    items: list
    total: float
    status: str

class OrderRepository:
    def __init__(self):
        self.orders = {}
    
    def save(self, order: Order):
        self.orders[order.id] = order
    
    def find_by_id(self, order_id: str):
        return self.orders.get(order_id)

order_repo = OrderRepository()

@app.route('/orders', methods=['POST'])
def create_order():
    """
    Crear orden.
    Llama a User Service para validar usuario.
    """
    data = request.json
    user_id = data['user_id']
    
    # Llamada a User Service (comunicación inter-servicio)
    try:
        user_response = requests.get(
            f'http://user-service:8001/users/{user_id}',
            timeout=5
        )
        
        if user_response.status_code != 200:
            return jsonify({'error': 'User not found'}), 400
    
    except requests.exceptions.RequestException:
        return jsonify({'error': 'User service unavailable'}), 503
    
    # Crear orden
    order = Order(
        id=str(uuid.uuid4()),
        user_id=user_id,
        items=data['items'],
        total=sum(item['price'] * item['quantity'] for item in data['items']),
        status='PENDING'
    )
    
    order_repo.save(order)
    
    return jsonify({
        'id': order.id,
        'user_id': order.user_id,
        'total': order.total,
        'status': order.status
    }), 201

if __name__ == '__main__':
    app.run(port=8002)
```

### Servicio 3: Payment Service

```python
# payment_service/app.py

from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/payments', methods=['POST'])
def process_payment():
    """
    Procesar pago.
    Llama a Order Service para obtener detalles.
    """
    data = request.json
    order_id = data['order_id']
    
    # Obtener orden de Order Service
    try:
        order_response = requests.get(
            f'http://order-service:8002/orders/{order_id}',
            timeout=5
        )
        
        if order_response.status_code != 200:
            return jsonify({'error': 'Order not found'}), 400
        
        order = order_response.json()
    
    except requests.exceptions.RequestException:
        return jsonify({'error': 'Order service unavailable'}), 503
    
    # Procesar pago (simulado)
    payment_success = True  # Simular procesamiento
    
    if payment_success:
        # Actualizar estado de orden
        requests.patch(
            f'http://order-service:8002/orders/{order_id}',
            json={'status': 'PAID'}
        )
        
        return jsonify({
            'status': 'success',
            'order_id': order_id,
            'amount': order['total']
        }), 200
    else:
        return jsonify({'error': 'Payment failed'}), 400

if __name__ == '__main__':
    app.run(port=8003)
```

---

## Patrones de Comunicación

### 1. Síncrona (REST)

```python
# Servicio A llama a Servicio B
response = requests.get('http://service-b/data')
data = response.json()
```

**Ventajas**: Simple, inmediato
**Desventajas**: Acoplamiento temporal, latencia acumulativa

### 2. Asíncrona (Message Queue)

```python
import pika

class MessagePublisher:
    """Publicar mensajes a RabbitMQ."""
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters('localhost')
        )
        self.channel = self.connection.channel()
    
    def publish(self, queue: str, message: dict):
        """Publicar mensaje."""
        self.channel.queue_declare(queue=queue)
        self.channel.basic_publish(
            exchange='',
            routing_key=queue,
            body=json.dumps(message)
        )

class MessageConsumer:
    """Consumir mensajes de RabbitMQ."""
    def __init__(self, queue: str, callback):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters('localhost')
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=queue)
        self.channel.basic_consume(
            queue=queue,
            on_message_callback=callback,
            auto_ack=True
        )
    
    def start(self):
        """Iniciar consumo."""
        self.channel.start_consuming()

# Order Service publica evento
publisher = MessagePublisher()
publisher.publish('order.created', {
    'order_id': '123',
    'user_id': 'user456',
    'total': 100.0
})

# Payment Service consume evento
def process_order_created(ch, method, properties, body):
    data = json.loads(body)
    print(f"Processing payment for order {data['order_id']}")

consumer = MessageConsumer('order.created', process_order_created)
consumer.start()
```

---

## Service Discovery

```python
import consul

class ServiceRegistry:
    """Registro de servicios con Consul."""
    def __init__(self):
        self.consul = consul.Consul()
    
    def register(self, service_name: str, host: str, port: int):
        """Registrar servicio."""
        self.consul.agent.service.register(
            name=service_name,
            service_id=f"{service_name}-{host}-{port}",
            address=host,
            port=port,
            check=consul.Check.http(
                f"http://{host}:{port}/health",
                interval="10s"
            )
        )
    
    def discover(self, service_name: str):
        """Descubrir instancias de servicio."""
        _, services = self.consul.health.service(service_name, passing=True)
        
        return [
            {
                'host': service['Service']['Address'],
                'port': service['Service']['Port']
            }
            for service in services
        ]

# Uso
registry = ServiceRegistry()

# Registrar servicio
registry.register('user-service', 'localhost', 8001)

# Descubrir servicio
instances = registry.discover('user-service')
print(f"Available instances: {instances}")
```

---

## Deployment con Docker Compose

```yaml
# docker-compose.yml

version: '3.8'

services:
  user-service:
    build: ./user_service
    ports:
      - "8001:8001"
    environment:
      - DB_HOST=user-db
    depends_on:
      - user-db
  
  order-service:
    build: ./order_service
    ports:
      - "8002:8002"
    environment:
      - DB_HOST=order-db
      - USER_SERVICE_URL=http://user-service:8001
    depends_on:
      - order-db
  
  payment-service:
    build: ./payment_service
    ports:
      - "8003:8003"
    environment:
      - ORDER_SERVICE_URL=http://order-service:8002
  
  api-gateway:
    build: ./api_gateway
    ports:
      - "8000:8000"
    depends_on:
      - user-service
      - order-service
      - payment-service
  
  user-db:
    image: postgres:14
    environment:
      POSTGRES_DB: users
      POSTGRES_PASSWORD: password
  
  order-db:
    image: postgres:14
    environment:
      POSTGRES_DB: orders
      POSTGRES_PASSWORD: password
```

---

## Ventajas y Desventajas

### ✅ Ventajas

1. **Escalabilidad independiente**: Escala solo lo que necesitas
2. **Deployment independiente**: Deploys sin coordinación
3. **Tecnologías heterogéneas**: Cada servicio puede usar diferente stack
4. **Resiliencia**: Fallas aisladas
5. **Equipos autónomos**: Ownership completo

### ❌ Desventajas

1. **Complejidad operacional**: Monitoreo, logging, tracing distribuido
2. **Latencia de red**: Comunicación inter-servicio
3. **Consistencia de datos**: Transacciones distribuidas
4. **Testing**: E2E tests complejos
5. **Overhead**: Más infraestructura

---

## Cuándo usar Microservicios

### ✅ Usar cuando

- Equipos grandes (> 50 developers)
- Necesitas escalar componentes independientemente
- Diferentes partes tienen diferentes requisitos tecnológicos
- Deployment independiente es crítico

### ❌ Evitar cuando

- Equipo pequeño (< 10 developers)
- Dominio simple
- No tienes expertise en sistemas distribuidos
- Startup/MVP

---

## Resumen

**Microservicios**:

- Servicios pequeños, independientes, desplegables
- Database per service
- Comunicación vía APIs o mensajes
- Requiere madurez operacional

**Regla**: No empieces con microservicios. Empieza con monolito modular, migra si es necesario.

**Siguiente paso**: Tema 4.3 - Service-Based Architecture
