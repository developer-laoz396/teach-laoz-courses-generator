# BANCO DE EJERCICIOS: Arquitectura de Microservicios

## METADATA

- **Módulo**: Módulo 4 - Arquitecturas Distribuidas
- **Tema**: 4.2 - Arquitectura de Microservicios
- **Objetivos evaluados**:
  - Diseñar arquitectura de microservicios
  - Implementar comunicación entre servicios
  - Aplicar patrones de resiliencia
- **Tiempo total estimado**: 120 minutos
- **Tipo**: Formativa
- **Nivel de ruta**: Avanzada

---

## EJERCICIO 1: Implementar API Gateway

### METADATA

- **ID**: `EJ-M4-001`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo estimado**: 30 minutos
- **Nivel Bloom**: Aplicar
- **Conceptos evaluados**: API Gateway, Routing, Service Discovery
- **Tipo**: Implementación

### ENUNCIADO

Implementa un API Gateway que enrute requests a microservicios apropiados.

**Restricciones**:

- Debe soportar múltiples servicios
- Timeout de 5 segundos por request
- Manejo de errores con status codes apropiados

**Servicios disponibles**:

- User Service: `http://localhost:8001`
- Order Service: `http://localhost:8002`
- Payment Service: `http://localhost:8003`

### ESQUELETO DE CÓDIGO

```python
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

class APIGateway:
    """
    API Gateway que enruta requests a microservicios.
    
    Debe implementar:
    - Routing basado en path
    - Timeout handling
    - Error handling
    """
    def __init__(self):
        self.services = {
            'user': 'http://localhost:8001',
            'order': 'http://localhost:8002',
            'payment': 'http://localhost:8003'
        }
    
    def route_request(self, service_name: str, endpoint: str, method: str = 'GET', data=None):
        """
        Enruta request al servicio apropiado.
        
        Args:
            service_name: Nombre del servicio ('user', 'order', 'payment')
            endpoint: Endpoint del servicio (ej: '/users/123')
            method: Método HTTP ('GET', 'POST', 'PUT', 'DELETE')
            data: Datos para POST/PUT
        
        Returns:
            tuple: (response_data, status_code)
        
        Debe manejar:
        - Servicio no encontrado → 404
        - Timeout → 504
        - Error de servicio → 500
        """
        # TODO: Implementar
        pass

# TODO: Implementar endpoints Flask
@app.route('/api/<service>/<path:endpoint>', methods=['GET', 'POST'])
def gateway_route(service, endpoint):
    # TODO: Implementar
    pass
```

### CASOS DE PRUEBA

#### Casos básicos

```python
# Test 1: Routing exitoso
gateway = APIGateway()
response, status = gateway.route_request('user', '/users/123')
assert status == 200
assert 'id' in response

# Test 2: Servicio no encontrado
response, status = gateway.route_request('invalid', '/test')
assert status == 404
assert 'error' in response
```

#### Casos avanzados

```python
# Test 3: Timeout handling
response, status = gateway.route_request('slow_service', '/slow')
assert status == 504

# Test 4: POST request
data = {'name': 'John', 'email': 'john@example.com'}
response, status = gateway.route_request('user', '/users', 'POST', data)
assert status == 201
```

### RÚBRICA DE EVALUACIÓN

| Criterio | Puntos | Descripción |
|----------|--------|-------------|
| **Routing correcto** | 30% | Enruta a servicios correctamente |
| **Timeout handling** | 25% | Maneja timeouts apropiadamente |
| **Error handling** | 25% | Status codes correctos |
| **Calidad del código** | 20% | Código limpio y documentado |

**Puntaje mínimo para aprobar**: 70%

### SOLUCIÓN MODELO

```python
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

class APIGateway:
    def __init__(self):
        self.services = {
            'user': 'http://localhost:8001',
            'order': 'http://localhost:8002',
            'payment': 'http://localhost:8003'
        }
    
    def route_request(self, service_name: str, endpoint: str, method: str = 'GET', data=None):
        """Enruta request al servicio apropiado."""
        # Validar servicio
        base_url = self.services.get(service_name)
        if not base_url:
            return {'error': f'Service {service_name} not found'}, 404
        
        url = f"{base_url}{endpoint}"
        
        try:
            # Ejecutar request con timeout
            if method == 'GET':
                response = requests.get(url, timeout=5)
            elif method == 'POST':
                response = requests.post(url, json=data, timeout=5)
            elif method == 'PUT':
                response = requests.put(url, json=data, timeout=5)
            elif method == 'DELETE':
                response = requests.delete(url, timeout=5)
            else:
                return {'error': 'Method not allowed'}, 405
            
            return response.json(), response.status_code
        
        except requests.exceptions.Timeout:
            return {'error': 'Service timeout'}, 504
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}, 500

gateway = APIGateway()

@app.route('/api/<service>/<path:endpoint>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def gateway_route(service, endpoint):
    """Endpoint del gateway."""
    result, status = gateway.route_request(
        service,
        f'/{endpoint}',
        request.method,
        request.get_json() if request.method in ['POST', 'PUT'] else None
    )
    return jsonify(result), status

if __name__ == '__main__':
    app.run(port=8000)
```

### ERRORES COMUNES Y DIAGNÓSTICO

#### ❌ Error 1: No manejar timeout

```python
# Código incorrecto
response = requests.get(url)  # Sin timeout
```

**Síntoma**: Request cuelga indefinidamente
**Causa raíz**: No especificar timeout
**Corrección**: `requests.get(url, timeout=5)`
**Concepto no dominado**: Timeout handling

#### ❌ Error 2: No validar servicio

```python
# Código incorrecto
url = f"{self.services[service_name]}{endpoint}"  # KeyError si no existe
```

**Síntoma**: KeyError en runtime
**Causa raíz**: No validar existencia de servicio
**Corrección**: Usar `.get()` y validar
**Concepto no dominado**: Validación de entrada

---

## EJERCICIO 2: Implementar Circuit Breaker

### METADATA

- **ID**: `EJ-M4-002`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 45 minutos
- **Nivel Bloom**: Crear
- **Conceptos evaluados**: Circuit Breaker, State Management, Resiliencia
- **Tipo**: Implementación

### ENUNCIADO

Implementa un Circuit Breaker para prevenir cascading failures.

**Requisitos**:

- Estados: CLOSED, OPEN, HALF_OPEN
- Threshold de fallas: 5 fallas consecutivas
- Timeout: 60 segundos antes de intentar HALF_OPEN
- Debe trackear fallas y éxitos

### ESQUELETO DE CÓDIGO

```python
from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    """
    Circuit Breaker para prevenir cascading failures.
    
    Complejidad esperada:
        Tiempo: O(1) por llamada
        Espacio: O(1)
    """
    def __init__(self, failure_threshold=5, timeout_seconds=60):
        # TODO: Implementar
        pass
    
    def call(self, func, *args, **kwargs):
        """
        Ejecuta función con circuit breaker.
        
        Returns:
            Resultado de la función si el circuito permite la llamada
        
        Raises:
            Exception si el circuito está OPEN
        """
        # TODO: Implementar
        pass
    
    def _on_success(self):
        # TODO: Implementar
        pass
    
    def _on_failure(self):
        # TODO: Implementar
        pass
```

### CASOS DE PRUEBA

```python
# Test 1: Estado inicial CLOSED
cb = CircuitBreaker()
assert cb.state == CircuitState.CLOSED

# Test 2: Transición a OPEN después de threshold
def failing_function():
    raise Exception("Service unavailable")

for _ in range(5):
    try:
        cb.call(failing_function)
    except:
        pass

assert cb.state == CircuitState.OPEN

# Test 3: Rechazar llamadas cuando OPEN
try:
    cb.call(lambda: "test")
    assert False, "Should have raised exception"
except Exception as e:
    assert "Circuit breaker is OPEN" in str(e)
```

### SOLUCIÓN MODELO

```python
from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout_seconds=60):
        self.failure_threshold = failure_threshold
        self.timeout = timedelta(seconds=timeout_seconds)
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func, *args, **kwargs):
        # Verificar si debemos intentar HALF_OPEN
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
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
```

---

## EJERCICIO 3: Diseñar Arquitectura de Microservicios

### METADATA

- **ID**: `EJ-M4-003`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 45 minutos
- **Nivel Bloom**: Evaluar/Crear
- **Conceptos evaluados**: Diseño arquitectónico, Bounded Contexts, Service Boundaries
- **Tipo**: Diseño

### ENUNCIADO

Diseña una arquitectura de microservicios para un sistema de e-commerce.

**Requisitos funcionales**:

- Gestión de usuarios y autenticación
- Catálogo de productos
- Carrito de compras
- Procesamiento de órdenes
- Procesamiento de pagos
- Notificaciones (email, SMS)

**Requisitos no funcionales**:

- Escalabilidad independiente de componentes
- Resiliencia ante fallas
- Deployment independiente

**Entregables**:

1. Diagrama de servicios y sus responsabilidades
2. Definición de APIs entre servicios
3. Identificación de patrones aplicados
4. Estrategia de datos (database per service o compartida)

### CRITERIOS DE EVALUACIÓN

| Criterio | Excelente (100%) | Satisfactorio (75%) | Básico (50%) |
|----------|------------------|---------------------|--------------|
| **Bounded Contexts** | Servicios bien delimitados por dominio | Servicios funcionales pero con overlap | Servicios monolíticos |
| **Comunicación** | Async donde apropiado, sync solo cuando necesario | Mayormente síncrona | Sin considerar patrones |
| **Resiliencia** | Circuit breakers, retries, timeouts | Algunos patrones | Sin patrones |
| **Datos** | Database per service con justificación | Shared database con razón válida | Sin estrategia clara |

### SOLUCIÓN MODELO

**Servicios propuestos**:

1. **User Service**
   - Responsabilidad: Gestión de usuarios, perfiles
   - Base de datos: PostgreSQL (users table)
   - API: REST

2. **Auth Service**
   - Responsabilidad: Autenticación, JWT tokens
   - Base de datos: Redis (sessions)
   - API: REST

3. **Catalog Service**
   - Responsabilidad: Productos, categorías, búsqueda
   - Base de datos: Elasticsearch
   - API: REST + GraphQL

4. **Cart Service**
   - Responsabilidad: Carritos de compra
   - Base de datos: Redis (temporal)
   - API: REST

5. **Order Service**
   - Responsabilidad: Órdenes, workflow de compra
   - Base de datos: PostgreSQL (orders table)
   - API: REST + Events

6. **Payment Service**
   - Responsabilidad: Procesamiento de pagos
   - Base de datos: PostgreSQL (transactions table)
   - API: REST

7. **Notification Service**
   - Responsabilidad: Email, SMS
   - Base de datos: MongoDB (logs)
   - API: Events (consumer)

**Patrones aplicados**:

- API Gateway
- Database per Service
- Event-Driven (Order → Payment → Notification)
- Circuit Breaker en llamadas críticas
- Saga Pattern para transacciones distribuidas

---

## AUTOEVALUACIÓN DEL ESTUDIANTE

### Checklist de dominio

Marca los conceptos que dominas después de estos ejercicios:

- [ ] Puedo implementar un API Gateway funcional
- [ ] Entiendo cuándo usar Circuit Breaker
- [ ] Puedo diseñar bounded contexts apropiados
- [ ] Identifico cuándo usar comunicación síncrona vs asíncrona
- [ ] Puedo aplicar database per service pattern
- [ ] Entiendo trade-offs de microservicios vs monolito
