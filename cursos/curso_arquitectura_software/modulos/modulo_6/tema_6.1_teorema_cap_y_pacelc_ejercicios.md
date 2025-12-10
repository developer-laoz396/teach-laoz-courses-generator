# BANCO DE EJERCICIOS: Teorema CAP y PACELC

## METADATA

- **Módulo**: Módulo 6 - Datos Distribuidos
- **Tema**: 6.1 - Teorema CAP y PACELC
- **Tiempo total**: 60 minutos

---

## EJERCICIO 1: Clasificar Sistemas según CAP

### METADATA

- **ID**: `EJ-M6-101`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo**: 20 minutos

### ENUNCIADO

Clasifica los siguientes sistemas según CAP (CP, AP, CA):

1. MongoDB (con replica set)
2. Cassandra
3. PostgreSQL (single-node)
4. DynamoDB
5. Redis (single-node)

### SOLUCIÓN

| Sistema | Clasificación | Justificación |
|---------|---------------|---------------|
| MongoDB | CP | Prioriza consistencia, sacrifica disponibilidad en particiones |
| Cassandra | AP | Prioriza disponibilidad, consistencia eventual |
| PostgreSQL | CA | No tolera particiones (single-node) |
| DynamoDB | AP | Disponibilidad alta, consistencia eventual por defecto |
| Redis | CA | Single-node, no distribuido |

---

## EJERCICIO 2: Implementar Niveles de Consistencia

### METADATA

- **ID**: `EJ-M6-102`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo**: 40 minutos

### ENUNCIADO

Implementa una base de datos distribuida con diferentes niveles de consistencia.

```python
class DistributedDB:
    def write(self, key, value, consistency='QUORUM'):
        """
        consistency: 'ONE', 'QUORUM', 'ALL'
        """
        # TODO: Implementar
        pass
```

### SOLUCIÓN

```python
class DistributedDB:
    def __init__(self, num_replicas=3):
        self.replicas = [{} for _ in range(num_replicas)]
    
    def write(self, key, value, consistency='QUORUM'):
        if consistency == 'ONE':
            # AP: Escribe en 1 réplica
            self.replicas[0][key] = value
            return True
        
        elif consistency == 'QUORUM':
            # Balance: Escribe en mayoría
            quorum = len(self.replicas) // 2 + 1
            for i in range(quorum):
                self.replicas[i][key] = value
            return True
        
        elif consistency == 'ALL':
            # CP: Escribe en todas
            for replica in self.replicas:
                replica[key] = value
            return True
    
    def read(self, key, consistency='QUORUM'):
        if consistency == 'ONE':
            return self.replicas[0].get(key)
        
        elif consistency == 'QUORUM':
            quorum = len(self.replicas) // 2 + 1
            values = [r.get(key) for r in self.replicas[:quorum]]
            # Retornar valor más reciente (simplificado)
            return values[0]
        
        elif consistency == 'ALL':
            # Verificar que todas tengan mismo valor
            values = [r.get(key) for r in self.replicas]
            if len(set(values)) == 1:
                return values[0]
            raise Exception("Inconsistent replicas")
```

---

## AUTOEVALUACIÓN

- [ ] Puedo clasificar sistemas según CAP
- [ ] Entiendo trade-offs de cada nivel
- [ ] Sé implementar niveles de consistencia
