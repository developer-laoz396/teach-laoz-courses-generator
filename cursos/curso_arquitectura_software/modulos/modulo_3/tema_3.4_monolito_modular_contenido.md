# Tema 3.4: Monolito Modular

**Tiempo estimado**: 50 minutos  
**Nivel**: Avanzado  
**Prerrequisitos**: Módulo 3 completo

## ¿Por qué importa este concepto?

El **Monolito Modular** es la respuesta moderna al falso dilema "Monolito vs Microservicios". Combina:

- **Simplicidad operacional del monolito**: Un deployment, una base de datos, debugging simple
- **Modularidad de microservicios**: Módulos independientes, bajo acoplamiento, alta cohesión

**Por qué es relevante ahora**:

- Microservicios se volvieron el "default" sin justificación
- Muchas empresas sufren con complejidad de microservicios
- Monolito modular es el "sweet spot" para mayoría de aplicaciones

**Casos reales**:

- **Shopify**: Monolito modular de 3M+ líneas de código
- **GitHub**: Monolito modular que maneja millones de usuarios
- **Basecamp**: Monolito modular, equipo pequeño, alta productividad

---

## Definición formal

### Concepto

**Monolito Modular** = Monolito (deployment único) + Modularidad (arquitectura interna limpia)

```
┌─────────────────────────────────────────────┐
│         MONOLITHIC DEPLOYMENT               │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ Module A │  │ Module B │  │ Module C │ │
│  │          │  │          │  │          │ │
│  │ - Domain │  │ - Domain │  │ - Domain │ │
│  │ - Logic  │  │ - Logic  │  │ - Logic  │ │
│  │ - Data   │  │ - Data   │  │ - Data   │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │             │        │
│       └─────────────┴─────────────┘        │
│              Shared Infrastructure          │
│         (DB, Cache, Message Bus)           │
└─────────────────────────────────────────────┘
```

### Características clave

1. **Módulos independientes**: Bajo acoplamiento, alta cohesión
2. **Interfaces bien definidas**: Comunicación solo vía APIs públicas
3. **Deployment único**: Todo se despliega junto
4. **Base de datos compartida** (pero con schemas separados)
5. **Posibilidad de extracción**: Módulos pueden convertirse en microservicios

---

## Implementación: Sistema de E-commerce Modular

### Estructura de Módulos

```
ecommerce/
├── modules/
│   ├── catalog/          # Módulo de catálogo
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── api/
│   ├── cart/             # Módulo de carrito
│   ├── checkout/         # Módulo de checkout
│   ├── user/             # Módulo de usuarios
│   └── payment/          # Módulo de pagos
├── shared/               # Código compartido
│   ├── events/
│   ├── database/
│   └── utils/
└── main.py              # Punto de entrada
```

### Módulo 1: Catalog (Catálogo de Productos)

```python
# modules/catalog/domain/product.py

from dataclasses import dataclass
from typing import Optional
from decimal import Decimal

@dataclass
class Product:
    """Entidad de dominio: Producto."""
    id: str
    name: str
    description: str
    price: Decimal
    stock: int
    category_id: str
    
    def is_available(self) -> bool:
        """Regla de negocio."""
        return self.stock > 0
    
    def reduce_stock(self, quantity: int):
        """Regla de negocio."""
        if quantity > self.stock:
            raise ValueError(f"Insufficient stock. Available: {self.stock}")
        self.stock -= quantity

# modules/catalog/application/catalog_service.py

from typing import List, Optional
from ..domain.product import Product

class CatalogService:
    """
    Servicio de aplicación del módulo Catalog.
    Esta es la API pública del módulo.
    """
    def __init__(self, product_repository):
        self._product_repository = product_repository
    
    def get_product(self, product_id: str) -> Optional[Product]:
        """API pública: Obtener producto."""
        return self._product_repository.find_by_id(product_id)
    
    def search_products(self, query: str, category_id: Optional[str] = None) -> List[Product]:
        """API pública: Buscar productos."""
        return self._product_repository.search(query, category_id)
    
    def check_availability(self, product_id: str, quantity: int) -> bool:
        """API pública: Verificar disponibilidad."""
        product = self._product_repository.find_by_id(product_id)
        return product and product.stock >= quantity
    
    # Métodos internos (privados, no parte de API pública)
    def _update_stock(self, product_id: str, quantity: int):
        """Método interno: Solo para uso dentro del módulo."""
        product = self._product_repository.find_by_id(product_id)
        product.reduce_stock(quantity)
        self._product_repository.save(product)
```

### Módulo 2: Cart (Carrito de Compras)

```python
# modules/cart/domain/cart.py

from dataclasses import dataclass, field
from typing import List
from decimal import Decimal

@dataclass
class CartItem:
    product_id: str
    quantity: int
    price: Decimal
    
    def subtotal(self) -> Decimal:
        return self.price * self.quantity

@dataclass
class Cart:
    """Entidad de dominio: Carrito."""
    user_id: str
    items: List[CartItem] = field(default_factory=list)
    
    def add_item(self, product_id: str, quantity: int, price: Decimal):
        """Regla de negocio: Añadir item."""
        # Buscar si ya existe
        for item in self.items:
            if item.product_id == product_id:
                item.quantity += quantity
                return
        
        # Añadir nuevo
        self.items.append(CartItem(product_id, quantity, price))
    
    def remove_item(self, product_id: str):
        """Regla de negocio: Remover item."""
        self.items = [item for item in self.items if item.product_id != product_id]
    
    def calculate_total(self) -> Decimal:
        """Regla de negocio: Calcular total."""
        return sum(item.subtotal() for item in self.items)
    
    def clear(self):
        """Regla de negocio: Vaciar carrito."""
        self.items = []

# modules/cart/application/cart_service.py

from typing import Optional
from ..domain.cart import Cart
# IMPORTANTE: Cart NO importa directamente de Catalog
# Solo usa la API pública de Catalog

class CartService:
    """
    Servicio de aplicación del módulo Cart.
    API pública del módulo.
    """
    def __init__(self, cart_repository, catalog_service):
        self._cart_repository = cart_repository
        self._catalog_service = catalog_service  # Dependencia de otro módulo
    
    def add_to_cart(self, user_id: str, product_id: str, quantity: int) -> Cart:
        """API pública: Añadir producto al carrito."""
        # 1. Verificar disponibilidad (usando API pública de Catalog)
        if not self._catalog_service.check_availability(product_id, quantity):
            raise ValueError("Product not available")
        
        # 2. Obtener precio (usando API pública de Catalog)
        product = self._catalog_service.get_product(product_id)
        if not product:
            raise ValueError("Product not found")
        
        # 3. Añadir al carrito
        cart = self._cart_repository.find_by_user(user_id)
        if not cart:
            cart = Cart(user_id=user_id)
        
        cart.add_item(product_id, quantity, product.price)
        self._cart_repository.save(cart)
        
        return cart
    
    def get_cart(self, user_id: str) -> Optional[Cart]:
        """API pública: Obtener carrito."""
        return self._cart_repository.find_by_user(user_id)
    
    def clear_cart(self, user_id: str):
        """API pública: Vaciar carrito."""
        cart = self._cart_repository.find_by_user(user_id)
        if cart:
            cart.clear()
            self._cart_repository.save(cart)
```

### Módulo 3: Checkout (Proceso de Compra)

```python
# modules/checkout/application/checkout_service.py

from typing import Dict, Any
from decimal import Decimal

class CheckoutService:
    """
    Servicio de aplicación del módulo Checkout.
    Orquesta múltiples módulos.
    """
    def __init__(self, 
                 cart_service,
                 catalog_service,
                 payment_service,
                 user_service,
                 event_bus):
        self._cart_service = cart_service
        self._catalog_service = catalog_service
        self._payment_service = payment_service
        self._user_service = user_service
        self._event_bus = event_bus
    
    def process_checkout(self, user_id: str, payment_method: str) -> Dict[str, Any]:
        """
        API pública: Procesar checkout.
        Orquesta múltiples módulos usando solo sus APIs públicas.
        """
        # 1. Obtener carrito (API de Cart)
        cart = self._cart_service.get_cart(user_id)
        if not cart or not cart.items:
            raise ValueError("Cart is empty")
        
        # 2. Verificar disponibilidad de todos los productos (API de Catalog)
        for item in cart.items:
            if not self._catalog_service.check_availability(item.product_id, item.quantity):
                raise ValueError(f"Product {item.product_id} not available")
        
        # 3. Calcular total
        total = cart.calculate_total()
        
        # 4. Procesar pago (API de Payment)
        payment_result = self._payment_service.process_payment(
            user_id=user_id,
            amount=total,
            method=payment_method
        )
        
        if not payment_result['success']:
            raise ValueError("Payment failed")
        
        # 5. Reducir stock (API de Catalog - método interno expuesto para checkout)
        for item in cart.items:
            self._catalog_service.reserve_stock(item.product_id, item.quantity)
        
        # 6. Crear orden
        order_id = self._create_order(user_id, cart, payment_result['transaction_id'])
        
        # 7. Vaciar carrito (API de Cart)
        self._cart_service.clear_cart(user_id)
        
        # 8. Publicar evento (para otros módulos interesados)
        self._event_bus.publish('order.placed', {
            'order_id': order_id,
            'user_id': user_id,
            'total': float(total)
        })
        
        return {
            'success': True,
            'order_id': order_id,
            'total': total
        }
    
    def _create_order(self, user_id: str, cart, transaction_id: str) -> str:
        """Método interno: Crear orden."""
        # Lógica de creación de orden
        return "ORDER-123"  # Simulado
```

### Event Bus (Comunicación entre Módulos)

```python
# shared/events/event_bus.py

from typing import Dict, List, Callable, Any
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Event:
    """Evento del sistema."""
    name: str
    data: Dict[str, Any]
    timestamp: datetime
    source_module: str

class EventBus:
    """
    Bus de eventos para comunicación entre módulos.
    Permite acoplamiento débil.
    """
    def __init__(self):
        self._subscribers: Dict[str, List[Callable]] = {}
    
    def subscribe(self, event_name: str, handler: Callable):
        """Suscribirse a un evento."""
        if event_name not in self._subscribers:
            self._subscribers[event_name] = []
        
        self._subscribers[event_name].append(handler)
    
    def publish(self, event_name: str, data: Dict[str, Any], source_module: str = "unknown"):
        """Publicar un evento."""
        event = Event(
            name=event_name,
            data=data,
            timestamp=datetime.now(),
            source_module=source_module
        )
        
        # Notificar a todos los suscriptores
        if event_name in self._subscribers:
            for handler in self._subscribers[event_name]:
                try:
                    handler(event)
                except Exception as e:
                    print(f"Error in event handler: {e}")

# Ejemplo de uso: Módulo de notificaciones escucha eventos

class NotificationService:
    """Módulo de notificaciones."""
    def __init__(self, event_bus: EventBus):
        # Suscribirse a eventos de interés
        event_bus.subscribe('order.placed', self._on_order_placed)
        event_bus.subscribe('payment.failed', self._on_payment_failed)
    
    def _on_order_placed(self, event: Event):
        """Handler: Orden creada."""
        user_id = event.data['user_id']
        order_id = event.data['order_id']
        
        print(f"📧 Sending confirmation email to user {user_id} for order {order_id}")
        # Lógica de envío de email
    
    def _on_payment_failed(self, event: Event):
        """Handler: Pago fallido."""
        user_id = event.data['user_id']
        
        print(f"📧 Sending payment failure notification to user {user_id}")
        # Lógica de notificación
```

### Ensamblaje (Dependency Injection Container)

```python
# main.py

from modules.catalog.application.catalog_service import CatalogService
from modules.cart.application.cart_service import CartService
from modules.checkout.application.checkout_service import CheckoutService
from shared.events.event_bus import EventBus

class DIContainer:
    """
    Contenedor de inyección de dependencias.
    Ensambla todos los módulos.
    """
    def __init__(self):
        # Infraestructura compartida
        self.event_bus = EventBus()
        self.db = self._create_database()
        
        # Repositorios
        self.product_repo = ProductRepository(self.db)
        self.cart_repo = CartRepository(self.db)
        self.user_repo = UserRepository(self.db)
        
        # Servicios de módulos (APIs públicas)
        self.catalog_service = CatalogService(self.product_repo)
        self.cart_service = CartService(self.cart_repo, self.catalog_service)
        self.payment_service = PaymentService()
        self.user_service = UserService(self.user_repo)
        
        # Servicio de checkout (orquestador)
        self.checkout_service = CheckoutService(
            self.cart_service,
            self.catalog_service,
            self.payment_service,
            self.user_service,
            self.event_bus
        )
        
        # Servicios auxiliares
        self.notification_service = NotificationService(self.event_bus)
    
    def _create_database(self):
        # Crear conexión a BD
        return Database()

# Uso
container = DIContainer()

# Procesar checkout
result = container.checkout_service.process_checkout(
    user_id="user123",
    payment_method="credit_card"
)
```

---

## Reglas de Modularidad

### 1. Comunicación solo vía APIs públicas

```python
# ❌ MAL: Acceso directo a internals de otro módulo
from modules.catalog.infrastructure.repositories import ProductRepository

class CartService:
    def __init__(self):
        self.product_repo = ProductRepository()  # Acoplamiento fuerte

# ✅ BIEN: Usar API pública
class CartService:
    def __init__(self, catalog_service: CatalogService):
        self.catalog_service = catalog_service  # Acoplamiento débil
```

### 2. Eventos para comunicación asíncrona

```python
# En lugar de llamadas directas, publicar eventos
event_bus.publish('order.placed', {'order_id': '123'})

# Otros módulos se suscriben
event_bus.subscribe('order.placed', inventory_service.update_stock)
event_bus.subscribe('order.placed', notification_service.send_email)
```

### 3. Schemas de BD separados

```sql
-- Cada módulo tiene su propio schema
CREATE SCHEMA catalog;
CREATE SCHEMA cart;
CREATE SCHEMA checkout;

-- Módulos NO acceden directamente a tablas de otros módulos
-- Solo vía APIs de servicio
```

---

## Migración a Microservicios

**Ventaja del monolito modular**: Fácil extracción de módulos.

```python
# Paso 1: Módulo como monolito
catalog_service = CatalogService(product_repo)

# Paso 2: Extraer a microservicio
# Reemplazar implementación local con cliente HTTP
class CatalogServiceClient(CatalogService):
    def __init__(self, base_url: str):
        self.base_url = base_url
    
    def get_product(self, product_id: str):
        response = requests.get(f"{self.base_url}/products/{product_id}")
        return response.json()

# Paso 3: Usar cliente en lugar de implementación local
catalog_service = CatalogServiceClient("http://catalog-service:8080")

# El resto del código NO cambia (misma interfaz)
```

---

## Ventajas y Desventajas

### ✅ Ventajas

1. **Simplicidad operacional**: Un deployment, un proceso
2. **Performance**: Sin latencia de red entre módulos
3. **Transacciones**: ACID completo
4. **Debugging**: Stack traces completos
5. **Modularidad**: Código bien organizado
6. **Migración gradual**: Puedes extraer módulos a microservicios después

### ❌ Desventajas

1. **Escalabilidad**: No puedes escalar módulos independientemente
2. **Deployment**: Todo se despliega junto
3. **Tecnologías**: Mismo stack para todos los módulos
4. **Equipos**: Requiere coordinación para deployments

---

## Cuándo usar Monolito Modular

### ✅ Usar cuando

- Equipo pequeño/mediano (< 50 developers)
- Dominio no es extremadamente complejo
- No necesitas escalar módulos independientemente
- Quieres simplicidad operacional
- Startup o producto nuevo

### ❌ Migrar a microservicios cuando

- Equipos grandes (> 50 developers)
- Necesitas escalar módulos independientemente
- Diferentes módulos tienen diferentes requisitos tecnológicos
- Deployment independiente es crítico

---

## Resumen

**Monolito Modular**:

- Mejor de ambos mundos: simplicidad + modularidad
- Módulos independientes, deployment único
- Ideal para mayoría de aplicaciones
- Fácil migración a microservicios si es necesario

**Regla de oro**: Empieza con monolito modular, migra a microservicios solo si es necesario.

---

## ✅ MÓDULO 3 COMPLETADO

Has completado el **Módulo 3: Estilos Arquitectónicos Fundamentales**:

- Layered Architecture
- Microkernel Architecture
- Pipeline Architecture
- Monolito Modular

**Próximo módulo**: Arquitecturas Distribuidas
