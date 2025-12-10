# BANCO DE EJERCICIOS: Falacias de la Computación Distribuida

## METADATA

- **Módulo**: Módulo 4 - Arquitecturas Distribuidas
- **Tema**: 4.1 - Falacias de la Computación Distribuida
- **Objetivos evaluados**:
  - Identificar falacias en código
  - Implementar mitigaciones
  - Aplicar patrones de resiliencia
- **Tiempo total estimado**: 90 minutos

---

## EJERCICIO 1: Identificar Falacias

### METADATA

- **ID**: `EJ-M4-101`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo estimado**: 20 minutos
- **Nivel Bloom**: Analizar
- **Tipo**: Análisis

### ENUNCIADO

Identifica qué falacias se violan en el siguiente código:

```python
def process_order(order_id):
    # Llamada 1
    user = requests.get(f"http://user-service/users/{order_id}")
    
    # Llamada 2
    payment = requests.post("http://payment-service/charge", 
                           json={'amount': 100})
    
    # Llamada 3
    inventory = requests.get("http://inventory-service/check")
    
    return {'status': 'success'}
```

**Preguntas**:

1. ¿Qué falacias se violan?
2. ¿Qué problemas pueden ocurrir?
3. ¿Cómo mitigarías cada uno?

### SOLUCIÓN

**Falacias violadas**:

1. **Falacia #1: "La red es confiable"**
   - No hay manejo de errores
   - Mitigación: Try/except, retry, circuit breaker

2. **Falacia #2: "La latencia es cero"**
   - No hay timeout
   - Llamadas secuenciales (latencia acumulativa)
   - Mitigación: Timeouts, async/await

3. **Falacia #4: "La red es segura"**
   - HTTP en lugar de HTTPS
   - Mitigación: TLS, autenticación

**Código mejorado**:

```python
import asyncio
import aiohttp

async def process_order(order_id):
    async with aiohttp.ClientSession() as session:
        try:
            # Llamadas en paralelo con timeout
            tasks = [
                session.get(f"https://user-service/users/{order_id}", timeout=5),
                session.post("https://payment-service/charge", json={'amount': 100}, timeout=5),
                session.get("https://inventory-service/check", timeout=5)
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Manejar errores
            for result in results:
                if isinstance(result, Exception):
                    return {'status': 'error', 'error': str(result)}
            
            return {'status': 'success'}
        
        except asyncio.TimeoutError:
            return {'status': 'timeout'}
```

---

## EJERCICIO 2: Implementar Service Discovery

### METADATA

- **ID**: `EJ-M4-102`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 40 minutos
- **Nivel Bloom**: Aplicar
- **Tipo**: Implementación

### ENUNCIADO

Implementa un Service Registry simple para mitigar Falacia #5 ("La topología no cambia").

### ESQUELETO DE CÓDIGO

```python
class ServiceRegistry:
    def __init__(self):
        # TODO: Implementar
        pass
    
    def register(self, service_name: str, host: str, port: int):
        # TODO: Implementar
        pass
    
    def deregister(self, service_name: str, host: str, port: int):
        # TODO: Implementar
        pass
    
    def discover(self, service_name: str):
        # TODO: Implementar
        pass
```

### SOLUCIÓN MODELO

```python
from datetime import datetime
import random

class ServiceRegistry:
    def __init__(self):
        self.services = {}
    
    def register(self, service_name: str, host: str, port: int):
        if service_name not in self.services:
            self.services[service_name] = []
        
        self.services[service_name].append({
            'host': host,
            'port': port,
            'registered_at': datetime.now()
        })
    
    def deregister(self, service_name: str, host: str, port: int):
        if service_name in self.services:
            self.services[service_name] = [
                s for s in self.services[service_name]
                if not (s['host'] == host and s['port'] == port)
            ]
    
    def discover(self, service_name: str):
        instances = self.services.get(service_name, [])
        if not instances:
            return None
        
        # Load balancing: random
        return random.choice(instances)
```

---

## EJERCICIO 3: Diseñar Sistema Resiliente

### METADATA

- **ID**: `EJ-M4-103`
- **Dificultad**: ⭐⭐⭐⭐ Experto
- **Tiempo estimado**: 30 minutos
- **Nivel Bloom**: Crear
- **Tipo**: Diseño

### ENUNCIADO

Diseña un sistema que mitigue TODAS las 8 falacias.

**Requisitos**:

- Identificar qué patrón mitiga cada falacia
- Justificar decisiones de diseño

### SOLUCIÓN MODELO

| Falacia | Mitigación | Patrón/Técnica |
|---------|-----------|----------------|
| #1: Red confiable | Retry, Circuit Breaker | Tenacity, pybreaker |
| #2: Latencia cero | Async, Caching | asyncio, Redis |
| #3: Ancho de banda infinito | Compresión, Pagination | gzip, cursor-based |
| #4: Red segura | TLS, JWT | HTTPS, Auth tokens |
| #5: Topología estática | Service Discovery | Consul, etcd |
| #6: Un administrador | SLAs, Contratos | OpenAPI, Pact |
| #7: Costo cero | Minimizar payloads | Protocol Buffers |
| #8: Red homogénea | Abstracciones | Adapter pattern |

---

## AUTOEVALUACIÓN

- [ ] Puedo identificar las 8 falacias en código
- [ ] Sé qué patrón mitiga cada falacia
- [ ] Puedo diseñar sistemas resilientes
- [ ] Entiendo trade-offs de cada mitigación
