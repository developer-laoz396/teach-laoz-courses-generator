# BANCO DE EJERCICIOS: Patrones de Resiliencia

## METADATA

- **Módulo**: Módulo 7 - Arquitecturas Modernas
- **Tema**: 7.1 - Patrones de Resiliencia
- **Objetivos evaluados**:
  - Implementar Circuit Breaker
  - Aplicar Retry Pattern
  - Implementar Bulkhead
- **Tiempo total estimado**: 90 minutos
- **Tipo**: Formativa

---

## EJERCICIO 1: Implementar Circuit Breaker Completo

### METADATA

- **ID**: `EJ-M7-001`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 45 minutos
- **Nivel Bloom**: Crear
- **Tipo**: Implementación

### ENUNCIADO

Implementa un Circuit Breaker con los 3 estados: CLOSED, OPEN, HALF_OPEN.

**Requisitos**:

- Threshold de fallas: 5
- Timeout: 60 segundos
- Trackear métricas (total calls, failures, successes)

### ESQUELETO DE CÓDIGO

```python
from enum import Enum
from datetime import datetime, timedelta

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout_seconds=60):
        # TODO: Implementar
        pass
    
    def call(self, func, *args, **kwargs):
        # TODO: Implementar
        pass
    
    def get_metrics(self):
        """Retorna métricas del circuit breaker."""
        # TODO: Implementar
        pass
```

### CASOS DE PRUEBA

```python
# Test 1: Estado inicial
cb = CircuitBreaker()
assert cb.state == CircuitState.CLOSED

# Test 2: Transición a OPEN
def failing_func():
    raise Exception("Error")

for _ in range(5):
    try:
        cb.call(failing_func)
    except:
        pass

assert cb.state == CircuitState.OPEN

# Test 3: Métricas
metrics = cb.get_metrics()
assert metrics['total_calls'] == 5
assert metrics['failures'] == 5
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
        self.success_count = 0
        self.total_calls = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func, *args, **kwargs):
        self.total_calls += 1
        
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
        self.success_count += 1
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = datetime.now()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
    
    def get_metrics(self):
        return {
            'total_calls': self.total_calls,
            'failures': self.failure_count,
            'successes': self.success_count,
            'state': self.state.value
        }
```

---

## EJERCICIO 2: Implementar Retry con Exponential Backoff

### METADATA

- **ID**: `EJ-M7-002`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo estimado**: 30 minutos
- **Nivel Bloom**: Aplicar
- **Tipo**: Implementación

### ENUNCIADO

Implementa un decorador de retry con exponential backoff.

### ESQUELETO DE CÓDIGO

```python
import time
from functools import wraps

def retry(max_attempts=3, initial_delay=1, backoff_factor=2):
    """
    Decorador de retry con exponential backoff.
    
    Args:
        max_attempts: Número máximo de intentos
        initial_delay: Delay inicial en segundos
        backoff_factor: Factor de multiplicación del delay
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # TODO: Implementar
            pass
        return wrapper
    return decorator

# Uso
@retry(max_attempts=3, initial_delay=1, backoff_factor=2)
def unreliable_api_call():
    # Simular falla
    import random
    if random.random() < 0.7:
        raise Exception("API Error")
    return "Success"
```

### SOLUCIÓN MODELO

```python
import time
from functools import wraps

def retry(max_attempts=3, initial_delay=1, backoff_factor=2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            delay = initial_delay
            
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise e
                    
                    print(f"Attempt {attempt + 1} failed. Retrying in {delay}s...")
                    time.sleep(delay)
                    delay *= backoff_factor
        
        return wrapper
    return decorator
```

---

## EJERCICIO 3: Combinar Circuit Breaker + Retry

### METADATA

- **ID**: `EJ-M7-003`
- **Dificultad**: ⭐⭐⭐⭐ Experto
- **Tiempo estimado**: 15 minutos
- **Nivel Bloom**: Evaluar
- **Tipo**: Diseño

### ENUNCIADO

Diseña una estrategia que combine Circuit Breaker y Retry Pattern.

**Pregunta**: ¿En qué orden deberían aplicarse? ¿Por qué?

A) Retry → Circuit Breaker
B) Circuit Breaker → Retry

### SOLUCIÓN

**Respuesta correcta: A) Retry → Circuit Breaker**

**Razón**:

1. Retry debe estar DENTRO del Circuit Breaker
2. Circuit Breaker cuenta fallas DESPUÉS de todos los retries
3. Evita abrir el circuito por fallas transitorias

```python
# Correcto
cb = CircuitBreaker()

@retry(max_attempts=3)
def api_call():
    return requests.get("http://api.example.com")

result = cb.call(api_call)  # CB → Retry → API
```

---

## AUTOEVALUACIÓN

- [ ] Puedo implementar Circuit Breaker con 3 estados
- [ ] Entiendo exponential backoff
- [ ] Sé combinar patrones de resiliencia
- [ ] Puedo diseñar sistemas resilientes
