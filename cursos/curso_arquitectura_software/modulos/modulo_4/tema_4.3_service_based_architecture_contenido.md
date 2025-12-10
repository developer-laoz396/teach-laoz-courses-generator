# Tema 4.3: Service-Based Architecture

**Tiempo estimado**: 35 minutos  
**Nivel**: Intermedio-Avanzado  
**Prerrequisitos**: Tema 4.2

## ¿Por qué importa?

**Service-Based Architecture** (SBA) es el punto medio entre monolito y microservicios:

- Servicios más grandes que microservicios (coarse-grained)
- Menos servicios (5-12 típicamente)
- Puede compartir base de datos
- Más simple que microservicios, más modular que monolito

**Ideal para**: Empresas medianas que necesitan modularidad sin complejidad de microservicios.

---

## Estructura

```
┌──────────────────────────────────────────┐
│         UI Layer                         │
└────────────┬─────────────────────────────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
┌───▼───┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│Service│ │Service│ │Service│ │Service│
│   A   │ │  B   │ │  C   │ │  D   │
└───┬───┘ └──┬──┘ └──┬──┘ └──┬──┘
    │        │        │        │
    └────────┴────────┴────────┘
             │
    ┌────────▼────────┐
    │  Shared Database │
    └─────────────────┘
```

### Características

1. **Servicios de dominio**: Agrupados por dominio de negocio
2. **Shared database** (opcional): Puede compartir BD
3. **Deployment separado**: Cada servicio se despliega independientemente
4. **API bien definida**: Comunicación vía APIs

---

## Implementación

```python
# Servicio 1: Customer Service (Dominio de clientes)
from flask import Flask, jsonify, request

app = Flask(__name__)

class CustomerService:
    """
    Servicio de dominio: Todo lo relacionado con clientes.
    Más grande que un microservicio.
    """
    def __init__(self, db):
        self.db = db
    
    def create_customer(self, data):
        """Crear cliente."""
        customer_id = self.db.insert('customers', data)
        return customer_id
    
    def get_customer(self, customer_id):
        """Obtener cliente."""
        return self.db.query('customers', {'id': customer_id})
    
    def get_customer_orders(self, customer_id):
        """Obtener órdenes de cliente (cross-domain)."""
        # Puede acceder a tabla de orders (shared DB)
        return self.db.query('orders', {'customer_id': customer_id})
    
    def update_customer_preferences(self, customer_id, preferences):
        """Actualizar preferencias."""
        self.db.update('customers', customer_id, {'preferences': preferences})

# Servicio 2: Order Service (Dominio de órdenes)
class OrderService:
    """Servicio de dominio: Todo lo relacionado con órdenes."""
    def __init__(self, db):
        self.db = db
    
    def create_order(self, customer_id, items):
        """Crear orden."""
        order_id = self.db.insert('orders', {
            'customer_id': customer_id,
            'items': items,
            'status': 'PENDING'
        })
        return order_id
    
    def get_order(self, order_id):
        """Obtener orden."""
        return self.db.query('orders', {'id': order_id})
    
    def update_order_status(self, order_id, status):
        """Actualizar estado."""
        self.db.update('orders', order_id, {'status': status})
```

---

## Ventajas vs Microservicios

| Aspecto | Service-Based | Microservicios |
|---------|---------------|----------------|
| Número de servicios | 5-12 | 50-1000+ |
| Tamaño de servicio | Grande (coarse-grained) | Pequeño (fine-grained) |
| Base de datos | Puede compartir | Database per service |
| Complejidad | Media | Alta |
| Performance | Mejor (menos red) | Peor (más red) |
| Escalabilidad | Buena | Excelente |

---

## Resumen

**Service-Based Architecture**: Punto medio entre monolito y microservicios. Ideal para empresas medianas.

**Siguiente paso**: Tema 4.4 - Monolito Distribuido (Anti-patrón)
