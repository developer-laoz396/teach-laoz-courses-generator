# Tema 7.2: Observabilidad (Logging, Metrics, Tracing)

**Tiempo estimado**: 45 minutos  
**Nivel**: Avanzado

## Los 3 Pilares de Observabilidad

### 1. Logging

```python
import logging
import json

class StructuredLogger:
    """Logger estructurado (JSON)."""
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter('%(message)s'))
        self.logger.addHandler(handler)
        self.logger.setLevel(logging.INFO)
    
    def log(self, level, message, **kwargs):
        """Log estructurado."""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'level': level,
            'message': message,
            **kwargs
        }
        
        self.logger.info(json.dumps(log_entry))

# Uso
logger = StructuredLogger()
logger.log('INFO', 'Order created', order_id='123', user_id='user456')
```

### 2. Metrics

```python
from prometheus_client import Counter, Histogram, Gauge

# Contadores
orders_created = Counter('orders_created_total', 'Total orders created')
orders_created.inc()

# Histogramas (latencia)
request_latency = Histogram('request_latency_seconds', 'Request latency')
with request_latency.time():
    process_request()

# Gauges (valores actuales)
active_users = Gauge('active_users', 'Active users')
active_users.set(150)
```

### 3. Distributed Tracing

```python
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider

# Setup
trace.set_tracer_provider(TracerProvider())
tracer = trace.get_tracer(__name__)

# Uso
with tracer.start_as_current_span("process_order"):
    # Span automático
    user = get_user(user_id)
    
    with tracer.start_as_current_span("validate_payment"):
        payment = validate_payment(order_id)
```

---

## Resumen

**Logging**: Eventos discretos
**Metrics**: Agregaciones numéricas
**Tracing**: Flujo de requests distribuidos

**Siguiente paso**: Tema 7.3 - Serverless y Cloud-Native
