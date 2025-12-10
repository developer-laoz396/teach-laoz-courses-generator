# Tema 6.2: Consistencia Eventual vs Fuerte

**Tiempo estimado**: 40 minutos  
**Nivel**: Avanzado

## Consistencia Fuerte (Strong Consistency)

**Definición**: Todas las lecturas ven la escritura más reciente inmediatamente.

```python
class StronglyConsistentDB:
    """Base de datos con consistencia fuerte."""
    def __init__(self):
        self.data = {}
        self.lock = threading.Lock()
    
    def write(self, key, value):
        """Escritura bloqueante."""
        with self.lock:
            self.data[key] = value
            # Replica a TODOS los nodos antes de retornar
            self._replicate_to_all_nodes(key, value)
    
    def read(self, key):
        """Lectura siempre ve último valor."""
        with self.lock:
            return self.data.get(key)

# Uso
db = StronglyConsistentDB()
db.write('user:123', {'name': 'John'})

# Lectura SIEMPRE ve el valor más reciente
value = db.read('user:123')  # {'name': 'John'}
```

**Ventajas**: Simplicidad, predecibilidad
**Desventajas**: Latencia alta, disponibilidad baja

---

## Consistencia Eventual (Eventual Consistency)

**Definición**: Las lecturas eventualmente verán la escritura, pero no inmediatamente.

```python
import time
from threading import Thread

class EventuallyConsistentDB:
    """Base de datos con consistencia eventual."""
    def __init__(self):
        self.primary = {}
        self.replicas = [{}, {}, {}]  # 3 réplicas
    
    def write(self, key, value):
        """Escritura inmediata en primary."""
        self.primary[key] = value
        
        # Replicación asíncrona
        Thread(target=self._async_replicate, args=(key, value)).start()
        
        # Retorna inmediatamente (no espera réplicas)
        return True
    
    def _async_replicate(self, key, value):
        """Replicación asíncrona a réplicas."""
        time.sleep(0.1)  # Simular latencia de red
        
        for replica in self.replicas:
            replica[key] = value
    
    def read(self, key, from_replica=False):
        """Lectura puede ver valor antiguo."""
        if from_replica:
            # Leer de réplica (puede estar desactualizada)
            return self.replicas[0].get(key)
        else:
            # Leer de primary (siempre actualizado)
            return self.primary.get(key)

# Uso
db = EventuallyConsistentDB()
db.write('user:123', {'name': 'John'})

# Lectura inmediata de primary: OK
print(db.read('user:123'))  # {'name': 'John'}

# Lectura inmediata de réplica: Puede ser None
print(db.read('user:123', from_replica=True))  # None (aún no replicado)

# Esperar replicación
time.sleep(0.2)
print(db.read('user:123', from_replica=True))  # {'name': 'John'}
```

**Ventajas**: Alta disponibilidad, baja latencia
**Desventajas**: Complejidad, posibles inconsistencias temporales

---

## Patrones de Consistencia Eventual

### 1. Read-Your-Writes

```python
class ReadYourWritesDB:
    """Garantiza que lees tus propias escrituras."""
    def __init__(self):
        self.db = EventuallyConsistentDB()
        self.user_writes = {}  # Track de escrituras por usuario
    
    def write(self, user_id, key, value):
        """Escribir y trackear."""
        self.db.write(key, value)
        
        if user_id not in self.user_writes:
            self.user_writes[user_id] = {}
        
        self.user_writes[user_id][key] = value
    
    def read(self, user_id, key):
        """Leer garantizando read-your-writes."""
        # Si el usuario escribió este key, retornar su valor
        if user_id in self.user_writes and key in self.user_writes[user_id]:
            return self.user_writes[user_id][key]
        
        # Sino, leer de DB
        return self.db.read(key)
```

### 2. Monotonic Reads

```python
class MonotonicReadsDB:
    """Garantiza que lecturas no retroceden en el tiempo."""
    def __init__(self):
        self.db = EventuallyConsistentDB()
        self.user_versions = {}  # Versión vista por usuario
    
    def read(self, user_id, key):
        """Leer garantizando monotonic reads."""
        value, version = self.db.read_with_version(key)
        
        # Si usuario ya vio versión más reciente, esperar
        if user_id in self.user_versions:
            last_version = self.user_versions[user_id].get(key, 0)
            
            if version < last_version:
                # Esperar a que réplica se actualice
                time.sleep(0.1)
                value, version = self.db.read_with_version(key)
        
        # Actualizar versión vista
        if user_id not in self.user_versions:
            self.user_versions[user_id] = {}
        
        self.user_versions[user_id][key] = version
        
        return value
```

---

## Cuándo usar cada una

### Usar Consistencia Fuerte cuando

- ✅ Datos financieros (balances, transacciones)
- ✅ Inventario crítico
- ✅ Datos de autenticación

### Usar Consistencia Eventual cuando

- ✅ Redes sociales (likes, comments)
- ✅ Carritos de compras
- ✅ Feeds de noticias
- ✅ Métricas y analytics

---

## Resumen

**Fuerte**: Todas las lecturas ven última escritura (lento, consistente)
**Eventual**: Lecturas eventualmente ven última escritura (rápido, eventualmente consistente)

**Trade-off**: Consistencia vs Disponibilidad/Latencia

**Siguiente paso**: Tema 6.3 - Patrones de Datos Distribuidos
