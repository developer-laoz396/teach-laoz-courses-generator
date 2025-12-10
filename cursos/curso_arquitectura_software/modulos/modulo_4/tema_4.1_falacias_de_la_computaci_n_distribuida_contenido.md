# Tema 4.1: Falacias de la Computación Distribuida

**Tiempo estimado**: 45 minutos  
**Nivel**: Avanzado  
**Prerrequisitos**: Módulo 3 completo

## ¿Por qué importa este concepto?

Las **8 Falacias de la Computación Distribuida** fueron identificadas por Peter Deutsch y James Gosling (Sun Microsystems, 1990s). Son suposiciones erróneas que los desarrolladores hacen al diseñar sistemas distribuidos, y que inevitablemente causan problemas en producción.

**Por qué son críticas**:

- Ignorarlas lleva a sistemas frágiles que fallan en producción
- Cada falacia representa un riesgo real que debes mitigar
- Entenderlas es prerequisito para diseñar sistemas distribuidos robustos

**Casos reales de fallas**:

- **Amazon 2013**: Falacia #1 (red no confiable) → 49 minutos de downtime
- **GitHub 2018**: Falacia #2 (latencia) → Degradación de servicio
- **Google 2019**: Falacia #4 (red no segura) → Vulnerabilidad de seguridad

---

## Las 8 Falacias

### Falacia 1: "La red es confiable"

**Realidad**: La red SIEMPRE falla.

**Problemas**:

- Paquetes se pierden
- Conexiones se caen
- Timeouts ocurren
- Switches/routers fallan

**Mitigación**:

```python
import requests
from tenacity import retry, stop_after_attempt, wait_exponential

class ServiceClient:
    """Cliente HTTP con retry automático."""
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=10)
    )
    def call_service(self, url: str):
        """
        Llamada con retry exponential backoff.
        Asume que la red puede fallar.
        """
        try:
            response = requests.get(url, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Network error: {e}")
            raise  # Retry automático por @retry

# Uso
client = ServiceClient()
try:
    data = client.call_service("http://api.example.com/data")
except Exception:
    # Después de 3 intentos, manejar falla
    print("Service unavailable after retries")
```

**Patrón: Circuit Breaker**

```python
from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"      # Normal
    OPEN = "open"          # Fallando, no intentar
    HALF_OPEN = "half_open"  # Probando si se recuperó

class CircuitBreaker:
    """
    Circuit Breaker para prevenir cascading failures.
    """
    def __init__(self, failure_threshold=5, timeout_seconds=60):
        self.failure_threshold = failure_threshold
        self.timeout = timedelta(seconds=timeout_seconds)
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func, *args, **kwargs):
        """Ejecuta función con circuit breaker."""
        if self.state == CircuitState.OPEN:
            if datetime.now() - self.last_failure_time > self.timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _on_success(self):
        """Reset en éxito."""
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def _on_failure(self):
        """Incrementar failures."""
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

# Uso
cb = CircuitBreaker()

def call_external_service():
    response = requests.get("http://unreliable-service.com")
    return response.json()

try:
    data = cb.call(call_external_service)
except Exception:
    print("Service call failed or circuit is open")
```

---

### Falacia 2: "La latencia es cero"

**Realidad**: La latencia SIEMPRE existe y varía.

**Problemas**:

- Llamadas síncronas bloquean threads
- Latencia acumulativa en cadenas de llamadas
- Timeouts inadecuados

**Números que debes conocer**:

```
L1 cache:                0.5 ns
L2 cache:                7 ns
RAM:                     100 ns
SSD:                     150,000 ns (0.15 ms)
Network (same datacenter): 500,000 ns (0.5 ms)
Network (cross-region):  150,000,000 ns (150 ms)
```

**Mitigación: Async/Await**

```python
import asyncio
import aiohttp

async def fetch_user(session, user_id):
    """Fetch asíncrono de usuario."""
    async with session.get(f"http://api.example.com/users/{user_id}") as response:
        return await response.json()

async def fetch_orders(session, user_id):
    """Fetch asíncrono de órdenes."""
    async with session.get(f"http://api.example.com/orders?user={user_id}") as response:
        return await response.json()

async def get_user_dashboard(user_id):
    """
    Dashboard que requiere múltiples llamadas.
    Ejecuta en paralelo para minimizar latencia total.
    """
    async with aiohttp.ClientSession() as session:
        # Ejecutar en paralelo
        user_task = fetch_user(session, user_id)
        orders_task = fetch_orders(session, user_id)
        
        # Esperar ambos
        user, orders = await asyncio.gather(user_task, orders_task)
        
        return {
            'user': user,
            'orders': orders
        }

# Latencia total: max(latencia_user, latencia_orders)
# En lugar de: latencia_user + latencia_orders
```

**Patrón: Caching**

```python
from functools import lru_cache
import time

class CachedServiceClient:
    """Cliente con cache para reducir latencia."""
    
    @lru_cache(maxsize=1000)
    def get_product(self, product_id: str):
        """
        Obtener producto con cache.
        Primera llamada: latencia de red
        Llamadas subsecuentes: latencia de memoria
        """
        response = requests.get(f"http://api.example.com/products/{product_id}")
        return response.json()
```

---

### Falacia 3: "El ancho de banda es infinito"

**Realidad**: El ancho de banda es limitado y costoso.

**Problemas**:

- Transferir datos grandes es lento
- Costos de transferencia de datos (especialmente cross-region)
- Congestión de red

**Mitigación: Compresión**

```python
import gzip
import json

def send_large_payload(data):
    """Enviar payload grande con compresión."""
    # Serializar a JSON
    json_data = json.dumps(data)
    
    # Comprimir
    compressed = gzip.compress(json_data.encode('utf-8'))
    
    # Enviar
    response = requests.post(
        "http://api.example.com/data",
        data=compressed,
        headers={'Content-Encoding': 'gzip'}
    )
    
    print(f"Original size: {len(json_data)} bytes")
    print(f"Compressed size: {len(compressed)} bytes")
    print(f"Compression ratio: {len(compressed)/len(json_data):.2%}")
```

**Patrón: Pagination**

```python
def fetch_all_users():
    """
    ❌ MAL: Traer todos los usuarios de una vez
    Puede ser GB de datos.
    """
    response = requests.get("http://api.example.com/users")
    return response.json()  # Potencialmente millones de registros

def fetch_users_paginated(page_size=100):
    """
    ✅ BIEN: Traer usuarios paginados
    """
    page = 1
    while True:
        response = requests.get(
            f"http://api.example.com/users?page={page}&size={page_size}"
        )
        data = response.json()
        
        if not data['users']:
            break
        
        yield data['users']
        page += 1
```

---

### Falacia 4: "La red es segura"

**Realidad**: La red es inherentemente insegura.

**Problemas**:

- Man-in-the-middle attacks
- Packet sniffing
- Data tampering

**Mitigación: TLS/SSL + Authentication**

```python
import jwt
from datetime import datetime, timedelta

class SecureServiceClient:
    """Cliente con autenticación y encriptación."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
    
    def call_service(self, url: str):
        """
        Llamada segura:
        1. HTTPS (TLS) para encriptación
        2. JWT para autenticación
        """
        # Generar JWT token
        token = jwt.encode(
            {
                'api_key': self.api_key,
                'exp': datetime.utcnow() + timedelta(minutes=5)
            },
            'secret_key',
            algorithm='HS256'
        )
        
        # Llamada HTTPS con token
        response = requests.get(
            url,
            headers={'Authorization': f'Bearer {token}'},
            verify=True  # Verificar certificado SSL
        )
        
        return response.json()
```

---

### Falacia 5: "La topología no cambia"

**Realidad**: Servidores se añaden/remueven constantemente.

**Problemas**:

- IPs cambian
- Servicios se mueven
- Autoscaling añade/remueve instancias

**Mitigación: Service Discovery**

```python
class ServiceRegistry:
    """
    Registro de servicios dinámico.
    """
    def __init__(self):
        self.services = {}
    
    def register(self, service_name: str, host: str, port: int):
        """Registrar servicio."""
        if service_name not in self.services:
            self.services[service_name] = []
        
        self.services[service_name].append({
            'host': host,
            'port': port,
            'registered_at': datetime.now()
        })
    
    def deregister(self, service_name: str, host: str, port: int):
        """Desregistrar servicio."""
        if service_name in self.services:
            self.services[service_name] = [
                s for s in self.services[service_name]
                if not (s['host'] == host and s['port'] == port)
            ]
    
    def discover(self, service_name: str):
        """Descubrir instancias de servicio."""
        return self.services.get(service_name, [])

# Uso con load balancing
import random

class LoadBalancedClient:
    def __init__(self, registry: ServiceRegistry):
        self.registry = registry
    
    def call_service(self, service_name: str, endpoint: str):
        """Llamada con load balancing."""
        instances = self.registry.discover(service_name)
        
        if not instances:
            raise Exception(f"No instances available for {service_name}")
        
        # Round-robin o random
        instance = random.choice(instances)
        
        url = f"http://{instance['host']}:{instance['port']}{endpoint}"
        return requests.get(url).json()
```

---

### Falacia 6: "Hay un solo administrador"

**Realidad**: Múltiples equipos/organizaciones gestionan diferentes partes.

**Problemas**:

- Diferentes políticas de seguridad
- Diferentes ventanas de mantenimiento
- Coordinación difícil

**Mitigación: Contratos y SLAs**

```python
from dataclasses import dataclass

@dataclass
class ServiceLevelAgreement:
    """SLA entre servicios."""
    service_name: str
    availability: float  # 99.9%
    max_latency_ms: int  # p99
    max_error_rate: float  # 1%
    support_contact: str
    
class SLAMonitor:
    """Monitor de cumplimiento de SLA."""
    def __init__(self, sla: ServiceLevelAgreement):
        self.sla = sla
        self.metrics = {
            'total_requests': 0,
            'failed_requests': 0,
            'latencies': []
        }
    
    def record_request(self, success: bool, latency_ms: int):
        """Registrar métrica de request."""
        self.metrics['total_requests'] += 1
        
        if not success:
            self.metrics['failed_requests'] += 1
        
        self.metrics['latencies'].append(latency_ms)
    
    def check_sla_compliance(self) -> bool:
        """Verificar cumplimiento de SLA."""
        if self.metrics['total_requests'] == 0:
            return True
        
        # Error rate
        error_rate = self.metrics['failed_requests'] / self.metrics['total_requests']
        if error_rate > self.sla.max_error_rate:
            return False
        
        # Latency p99
        sorted_latencies = sorted(self.metrics['latencies'])
        p99_index = int(len(sorted_latencies) * 0.99)
        p99_latency = sorted_latencies[p99_index] if sorted_latencies else 0
        
        if p99_latency > self.sla.max_latency_ms:
            return False
        
        return True
```

---

### Falacia 7: "El costo de transporte es cero"

**Realidad**: Serialización, deserialización, y transferencia tienen costo.

**Problemas**:

- CPU para serializar/deserializar
- Tiempo de transferencia
- Costos monetarios (AWS data transfer)

**Mitigación: Minimizar transferencias**

```python
# ❌ MAL: Transferir objetos grandes
def get_user_report(user_id):
    user = fetch_user(user_id)  # 10KB
    orders = fetch_orders(user_id)  # 1MB
    products = fetch_products()  # 100MB (todos los productos!)
    
    # Filtrar localmente
    relevant_products = [p for p in products if p['id'] in order_product_ids]
    
    return generate_report(user, orders, relevant_products)

# ✅ BIEN: Transferir solo lo necesario
def get_user_report(user_id):
    user = fetch_user(user_id)
    orders = fetch_orders(user_id)
    
    # Obtener solo productos relevantes
    product_ids = [item['product_id'] for order in orders for item in order['items']]
    products = fetch_products_by_ids(product_ids)  # Solo 100KB
    
    return generate_report(user, orders, products)
```

---

### Falacia 8: "La red es homogénea"

**Realidad**: Diferentes tecnologías, protocolos, y vendors.

**Problemas**:

- Diferentes formatos de datos
- Diferentes protocolos
- Incompatibilidades

**Mitigación: Abstracción y Adaptadores**

```python
from abc import ABC, abstractmethod

class MessageBroker(ABC):
    """Abstracción de message broker."""
    @abstractmethod
    def publish(self, topic: str, message: dict): pass
    
    @abstractmethod
    def subscribe(self, topic: str, handler): pass

class RabbitMQAdapter(MessageBroker):
    """Adaptador para RabbitMQ."""
    def publish(self, topic: str, message: dict):
        # Lógica específica de RabbitMQ
        pass
    
    def subscribe(self, topic: str, handler):
        # Lógica específica de RabbitMQ
        pass

class KafkaAdapter(MessageBroker):
    """Adaptador para Kafka."""
    def publish(self, topic: str, message: dict):
        # Lógica específica de Kafka
        pass
    
    def subscribe(self, topic: str, handler):
        # Lógica específica de Kafka
        pass

# Código de aplicación usa abstracción
class OrderService:
    def __init__(self, broker: MessageBroker):
        self.broker = broker  # No sabe si es Rabbit o Kafka
    
    def place_order(self, order):
        self.broker.publish('orders.placed', order)
```

---

## Resumen de Mitigaciones

| Falacia | Mitigación Principal |
|---------|---------------------|
| 1. Red confiable | Circuit Breaker, Retry, Timeouts |
| 2. Latencia cero | Async, Caching, Parallelización |
| 3. Ancho de banda infinito | Compresión, Pagination, Minimizar payloads |
| 4. Red segura | TLS, Authentication, Encryption |
| 5. Topología estática | Service Discovery, Load Balancing |
| 6. Un administrador | SLAs, Contratos, Monitoring |
| 7. Costo cero | Minimizar transferencias, Serialización eficiente |
| 8. Red homogénea | Abstracciones, Adaptadores, Estándares |

---

## Resumen

**Las 8 Falacias** son suposiciones erróneas que DEBES evitar al diseñar sistemas distribuidos. Cada una representa un riesgo real que debe ser mitigado con patrones y prácticas específicas.

**Regla de oro**: Asume que TODO puede fallar, y diseña para resiliencia.

**Siguiente paso**: Tema 4.2 - Microservicios
