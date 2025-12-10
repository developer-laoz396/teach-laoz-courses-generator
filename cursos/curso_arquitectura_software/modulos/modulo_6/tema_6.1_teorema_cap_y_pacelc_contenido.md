# Tema 6.1: Teorema CAP y PACELC

**Tiempo estimado**: 45 minutos  
**Nivel**: Avanzado

## Teorema CAP

**Definición**: En un sistema distribuido, solo puedes garantizar 2 de 3:

- **C**onsistency (Consistencia)
- **A**vailability (Disponibilidad)
- **P**artition Tolerance (Tolerancia a particiones)

```
        Consistency
            /\
           /  \
          /    \
         /  CA  \
        /________\
       /\        /\
      /  \  CP  /  \
     / AP \    / CA \
    /______\  /______\
Availability    Partition
                Tolerance
```

### Escenarios

**CP (Consistency + Partition Tolerance)**:

- MongoDB, HBase, Redis
- Sacrifica disponibilidad por consistencia
- Ejemplo: Sistema bancario

**AP (Availability + Partition Tolerance)**:

- Cassandra, DynamoDB, Riak
- Sacrifica consistencia por disponibilidad
- Ejemplo: Carrito de compras

**CA (Consistency + Availability)**:

- PostgreSQL, MySQL (single-node)
- No tolera particiones de red
- Ejemplo: Base de datos tradicional

---

## PACELC

**Extensión de CAP**: Si hay **P**artición, elige entre **A** y **C**. **E**lse (sin partición), elige entre **L**atencia y **C**onsistencia.

```python
class DistributedDatabase:
    """Ejemplo de trade-offs CAP/PACELC."""
    
    def write(self, key, value, consistency_level='QUORUM'):
        """
        Escribir con diferentes niveles de consistencia.
        
        consistency_level:
        - ONE: Escribe en 1 nodo (AP - alta disponibilidad, baja consistencia)
        - QUORUM: Escribe en mayoría (balance)
        - ALL: Escribe en todos (CP - alta consistencia, baja disponibilidad)
        """
        if consistency_level == 'ONE':
            # AP: Disponible pero puede ser inconsistente
            self._write_to_one_node(key, value)
        
        elif consistency_level == 'QUORUM':
            # Balance: Escribe en mayoría
            self._write_to_quorum(key, value)
        
        elif consistency_level == 'ALL':
            # CP: Consistente pero puede no estar disponible
            self._write_to_all_nodes(key, value)
```

---

## Resumen

**CAP**: Solo 2 de 3 (C, A, P)
**PACELC**: Considera latencia además de CAP
**Trade-off**: No hay solución perfecta, elige según requisitos

**Siguiente paso**: Tema 6.2 - Consistencia Eventual vs Fuerte
