# Tema 7.1: Patrones de Resiliencia (Circuit Breaker, Retry, Bulkhead)

**Tiempo estimado**: 45 minutos  
**Nivel**: Avanzado

## Circuit Breaker

**Patrón**: Prevenir cascading failures detectando fallas y "abriendo el circuito".

```python
from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"      # Normal
    OPEN = "open"          # Fallando
    HALF_OPEN = "half_open"  # Probando

class CircuitBreaker:
    """Circuit Breaker para prevenir cascading failures."""
    def __init__(self, failure_threshold=5, timeout_seconds=60):
        self.failure_threshold = failure_threshold
        self.timeout = timedelta(seconds=timeout_seconds)
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func, *args, **kwargs):
        """Ejecutar función con circuit breaker."""
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

## Retry Pattern

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10)
)
def call_external_service():
    """Llamada con retry automático."""
    response = requests.get("http://api.example.com/data")
    response.raise_for_status()
    return response.json()
```

---

## Bulkhead Pattern

```python
from concurrent.futures import ThreadPoolExecutor

class BulkheadExecutor:
    """Bulkhead: Aislar recursos para prevenir agotamiento."""
    def __init__(self):
        # Pool separado para cada servicio
        self.user_service_pool = ThreadPoolExecutor(max_workers=10)
        self.order_service_pool = ThreadPoolExecutor(max_workers=20)
        self.payment_service_pool = ThreadPoolExecutor(max_workers=5)
    
    def call_user_service(self, func):
        """Llamar User Service con pool dedicado."""
        return self.user_service_pool.submit(func)
    
    def call_order_service(self, func):
        """Llamar Order Service con pool dedicado."""
        return self.order_service_pool.submit(func)
```

---

## Timeout Pattern

```python
import requests

def call_with_timeout():
    """Llamada con timeout."""
    try:
        response = requests.get("http://api.example.com/data", timeout=5)
        return response.json()
    except requests.exceptions.Timeout:
        return {'error': 'Service timeout'}
```

---

## Resumen

**Circuit Breaker**: Prevenir cascading failures
**Retry**: Reintentar operaciones fallidas
**Bulkhead**: Aislar recursos
**Timeout**: Limitar tiempo de espera

**Siguiente paso**: Tema 7.2 - Observabilidad (Logging, Metrics, Tracing)
