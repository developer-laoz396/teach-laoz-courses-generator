# Tema 3.1: Layered Architecture (Arquitectura en Capas)

**Tiempo estimado**: 50 minutos  
**Nivel**: Intermedio  
**Prerrequisitos**: Módulo 2 completo

## ¿Por qué importa este concepto?

La **Arquitectura en Capas** es uno de los patrones arquitectónicos más antiguos y utilizados. Su popularidad se debe a:

- **Simplicidad**: Fácil de entender y comunicar
- **Separación de concerns**: Cada capa tiene responsabilidad clara
- **Organización natural**: Refleja cómo pensamos sobre sistemas (UI → Lógica → Datos)
- **Facilita testing**: Puedes testear capas independientemente

**Usado en**: Aplicaciones empresariales, sistemas web tradicionales, aplicaciones de escritorio.

**Ejemplos reales**:

- Spring Framework (Java)
- ASP.NET MVC (.NET)
- Django (Python)
- Ruby on Rails

---

## Definición formal

### Estructura de capas

```
┌─────────────────────────────────┐
│   Presentation Layer (UI)       │  ← Interacción con usuario
├─────────────────────────────────┤
│   Business Logic Layer          │  ← Reglas de negocio
├─────────────────────────────────┤
│   Persistence Layer (Data)      │  ← Acceso a datos
├─────────────────────────────────┤
│   Database                       │  ← Almacenamiento
└─────────────────────────────────┘

Flujo: UI → Business → Persistence → DB
```

### Reglas fundamentales

1. **Dependencias unidireccionales**: Capa N solo depende de capa N-1
2. **Closed layers**: Cada capa solo puede acceder a la inmediatamente inferior
3. **Open layers** (variante): Algunas capas pueden ser "saltadas"

---

## Implementación: Sistema de E-commerce

### Capa 1: Presentation (UI)

```python
from flask import Flask, request, jsonify, render_template
from typing import Dict, Any

app = Flask(__name__)

class ProductController:
    """
    Capa de presentación: Maneja HTTP requests/responses.
    Depende de Business Layer.
    """
    def __init__(self, product_service):
        self.product_service = product_service
    
    def get_product(self, product_id: str) -> Dict[str, Any]:
        """GET /products/:id"""
        try:
            product = self.product_service.get_product_by_id(product_id)
            
            if not product:
                return {'error': 'Product not found'}, 404
            
            # Convertir entidad de negocio a DTO para API
            return {
                'id': product.id,
                'name': product.name,
                'price': product.price,
                'stock': product.stock,
                'available': product.is_available()
            }, 200
        
        except Exception as e:
            return {'error': str(e)}, 500
    
    def create_product(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """POST /products"""
        try:
            # Validar input (responsabilidad de presentation layer)
            if not data.get('name') or not data.get('price'):
                return {'error': 'Name and price are required'}, 400
            
            # Delegar a business layer
            product = self.product_service.create_product(
                name=data['name'],
                price=data['price'],
                stock=data.get('stock', 0)
            )
            
            return {
                'id': product.id,
                'message': 'Product created successfully'
            }, 201
        
        except ValueError as e:
            return {'error': str(e)}, 400

class OrderController:
    """Controlador de órdenes."""
    def __init__(self, order_service):
        self.order_service = order_service
    
    def place_order(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """POST /orders"""
        try:
            order = self.order_service.place_order(
                customer_id=data['customer_id'],
                items=data['items']
            )
            
            return {
                'order_id': order.id,
                'total': order.total,
                'status': order.status
            }, 201
        
        except Exception as e:
            return {'error': str(e)}, 500
```

### Capa 2: Business Logic

```python
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
import uuid

# ===== DOMAIN MODELS =====

@dataclass
class Product:
    """Entidad de dominio: Producto."""
    id: str
    name: str
    price: float
    stock: int
    
    def is_available(self) -> bool:
        """Regla de negocio."""
        return self.stock > 0
    
    def reduce_stock(self, quantity: int):
        """Regla de negocio."""
        if quantity > self.stock:
            raise ValueError(f"Insufficient stock. Available: {self.stock}")
        self.stock -= quantity

@dataclass
class Order:
    """Entidad de dominio: Orden."""
    id: str
    customer_id: str
    items: List['OrderItem']
    total: float
    status: str
    created_at: datetime
    
    def calculate_total(self) -> float:
        """Regla de negocio."""
        return sum(item.subtotal() for item in self.items)

@dataclass
class OrderItem:
    product_id: str
    quantity: int
    price: float
    
    def subtotal(self) -> float:
        return self.quantity * self.price

# ===== BUSINESS SERVICES =====

class ProductService:
    """
    Capa de negocio: Lógica de productos.
    Depende de Persistence Layer.
    """
    def __init__(self, product_repository):
        self.product_repository = product_repository
    
    def get_product_by_id(self, product_id: str) -> Optional[Product]:
        """Obtener producto por ID."""
        return self.product_repository.find_by_id(product_id)
    
    def create_product(self, name: str, price: float, stock: int) -> Product:
        """
        Crear nuevo producto.
        Incluye validaciones de negocio.
        """
        # Validaciones de negocio
        if price <= 0:
            raise ValueError("Price must be positive")
        
        if stock < 0:
            raise ValueError("Stock cannot be negative")
        
        # Crear entidad
        product = Product(
            id=str(uuid.uuid4()),
            name=name,
            price=price,
            stock=stock
        )
        
        # Persistir
        self.product_repository.save(product)
        
        return product
    
    def update_stock(self, product_id: str, quantity: int) -> bool:
        """Actualizar stock de producto."""
        product = self.product_repository.find_by_id(product_id)
        
        if not product:
            raise ValueError(f"Product {product_id} not found")
        
        product.stock += quantity
        self.product_repository.save(product)
        
        return True

class OrderService:
    """
    Capa de negocio: Lógica de órdenes.
    Orquesta múltiples entidades y servicios.
    """
    def __init__(self, order_repository, product_repository, payment_service):
        self.order_repository = order_repository
        self.product_repository = product_repository
        self.payment_service = payment_service
    
    def place_order(self, customer_id: str, items: List[Dict]) -> Order:
        """
        Procesar una orden.
        Lógica de negocio compleja que orquesta múltiples operaciones.
        """
        # 1. Validar y preparar items
        order_items = []
        total = 0.0
        
        for item_data in items:
            product = self.product_repository.find_by_id(item_data['product_id'])
            
            if not product:
                raise ValueError(f"Product {item_data['product_id']} not found")
            
            if not product.is_available():
                raise ValueError(f"Product {product.name} is out of stock")
            
            quantity = item_data['quantity']
            
            # Validar stock
            if quantity > product.stock:
                raise ValueError(f"Insufficient stock for {product.name}")
            
            # Crear order item
            order_item = OrderItem(
                product_id=product.id,
                quantity=quantity,
                price=product.price
            )
            order_items.append(order_item)
            total += order_item.subtotal()
        
        # 2. Crear orden
        order = Order(
            id=str(uuid.uuid4()),
            customer_id=customer_id,
            items=order_items,
            total=total,
            status='PENDING',
            created_at=datetime.now()
        )
        
        # 3. Procesar pago
        payment_success = self.payment_service.process_payment(
            order.id,
            order.total
        )
        
        if not payment_success:
            order.status = 'PAYMENT_FAILED'
            self.order_repository.save(order)
            raise ValueError("Payment processing failed")
        
        # 4. Reducir stock
        for item in order.items:
            product = self.product_repository.find_by_id(item.product_id)
            product.reduce_stock(item.quantity)
            self.product_repository.save(product)
        
        # 5. Confirmar orden
        order.status = 'CONFIRMED'
        self.order_repository.save(order)
        
        return order

class PaymentService:
    """Servicio de pagos (simplificado)."""
    def process_payment(self, order_id: str, amount: float) -> bool:
        # Lógica de pago (integración con gateway)
        return True
```

### Capa 3: Persistence (Data Access)

```python
from abc import ABC, abstractmethod
from typing import List, Optional
import sqlite3

# ===== REPOSITORY INTERFACES =====

class ProductRepository(ABC):
    """Interfaz de repositorio de productos."""
    @abstractmethod
    def save(self, product: Product) -> bool: pass
    
    @abstractmethod
    def find_by_id(self, product_id: str) -> Optional[Product]: pass
    
    @abstractmethod
    def find_all(self) -> List[Product]: pass
    
    @abstractmethod
    def delete(self, product_id: str) -> bool: pass

class OrderRepository(ABC):
    """Interfaz de repositorio de órdenes."""
    @abstractmethod
    def save(self, order: Order) -> bool: pass
    
    @abstractmethod
    def find_by_id(self, order_id: str) -> Optional[Order]: pass
    
    @abstractmethod
    def find_by_customer(self, customer_id: str) -> List[Order]: pass

# ===== REPOSITORY IMPLEMENTATIONS =====

class SQLiteProductRepository(ProductRepository):
    """
    Implementación con SQLite.
    Capa de persistencia: Traduce entre objetos de dominio y BD.
    """
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        """Crear tablas si no existen."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price REAL NOT NULL,
                stock INTEGER NOT NULL
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save(self, product: Product) -> bool:
        """Guardar producto."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT OR REPLACE INTO products (id, name, price, stock)
            VALUES (?, ?, ?, ?)
        ''', (product.id, product.name, product.price, product.stock))
        
        conn.commit()
        conn.close()
        
        return True
    
    def find_by_id(self, product_id: str) -> Optional[Product]:
        """Buscar producto por ID."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        row = cursor.fetchone()
        
        conn.close()
        
        if not row:
            return None
        
        # Mapear fila de BD a objeto de dominio
        return Product(
            id=row[0],
            name=row[1],
            price=row[2],
            stock=row[3]
        )
    
    def find_all(self) -> List[Product]:
        """Obtener todos los productos."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM products')
        rows = cursor.fetchall()
        
        conn.close()
        
        return [
            Product(id=row[0], name=row[1], price=row[2], stock=row[3])
            for row in rows
        ]
    
    def delete(self, product_id: str) -> bool:
        """Eliminar producto."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM products WHERE id = ?', (product_id,))
        
        conn.commit()
        conn.close()
        
        return True

class SQLiteOrderRepository(OrderRepository):
    """Implementación de repositorio de órdenes."""
    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                customer_id TEXT NOT NULL,
                total REAL NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS order_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT NOT NULL,
                product_id TEXT NOT NULL,
                quantity INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save(self, order: Order) -> bool:
        """Guardar orden con sus items."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Guardar orden
        cursor.execute('''
            INSERT OR REPLACE INTO orders (id, customer_id, total, status, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (order.id, order.customer_id, order.total, order.status, 
              order.created_at.isoformat()))
        
        # Eliminar items existentes
        cursor.execute('DELETE FROM order_items WHERE order_id = ?', (order.id,))
        
        # Guardar items
        for item in order.items:
            cursor.execute('''
                INSERT INTO order_items (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
            ''', (order.id, item.product_id, item.quantity, item.price))
        
        conn.commit()
        conn.close()
        
        return True
    
    def find_by_id(self, order_id: str) -> Optional[Order]:
        """Buscar orden por ID."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Buscar orden
        cursor.execute('SELECT * FROM orders WHERE id = ?', (order_id,))
        order_row = cursor.fetchone()
        
        if not order_row:
            conn.close()
            return None
        
        # Buscar items
        cursor.execute('SELECT * FROM order_items WHERE order_id = ?', (order_id,))
        item_rows = cursor.fetchall()
        
        conn.close()
        
        # Mapear a objetos de dominio
        items = [
            OrderItem(
                product_id=row[2],
                quantity=row[3],
                price=row[4]
            )
            for row in item_rows
        ]
        
        return Order(
            id=order_row[0],
            customer_id=order_row[1],
            total=order_row[2],
            status=order_row[3],
            created_at=datetime.fromisoformat(order_row[4]),
            items=items
        )
    
    def find_by_customer(self, customer_id: str) -> List[Order]:
        """Buscar órdenes de un cliente."""
        # Implementación similar a find_by_id
        return []
```

### Ensamblaje (Dependency Injection)

```python
def create_application():
    """
    Composition root: Ensambla todas las capas.
    """
    # Capa de persistencia
    db_path = 'ecommerce.db'
    product_repo = SQLiteProductRepository(db_path)
    order_repo = SQLiteOrderRepository(db_path)
    
    # Capa de negocio
    payment_service = PaymentService()
    product_service = ProductService(product_repo)
    order_service = OrderService(order_repo, product_repo, payment_service)
    
    # Capa de presentación
    product_controller = ProductController(product_service)
    order_controller = OrderController(order_service)
    
    # Configurar rutas Flask
    @app.route('/products/<product_id>', methods=['GET'])
    def get_product(product_id):
        response, status = product_controller.get_product(product_id)
        return jsonify(response), status
    
    @app.route('/products', methods=['POST'])
    def create_product():
        response, status = product_controller.create_product(request.get_json())
        return jsonify(response), status
    
    @app.route('/orders', methods=['POST'])
    def place_order():
        response, status = order_controller.place_order(request.get_json())
        return jsonify(response), status
    
    return app

if __name__ == '__main__':
    app = create_application()
    app.run(debug=True)
```

---

## Ventajas y Desventajas

### ✅ Ventajas

1. **Simplicidad conceptual**: Fácil de entender
2. **Separación de concerns**: Cada capa tiene responsabilidad clara
3. **Testabilidad**: Puedes mockear capas inferiores
4. **Organización**: Estructura predecible del código
5. **Reusabilidad**: Business layer puede ser usado por múltiples UIs

### ❌ Desventajas

1. **Acoplamiento vertical**: Cambios en BD pueden propagarse hacia arriba
2. **Performance**: Múltiples capas añaden overhead
3. **Rigidez**: Difícil añadir flujos que no sigan el patrón
4. **Monolítico**: Todas las capas suelen estar en mismo deployment
5. **Sinkhole anti-pattern**: Capas que solo pasan datos sin lógica

---

## Variantes

### 1. Open Layers

Permite saltar capas para optimización.

```python
# Presentation puede acceder directamente a Persistence
# para queries de solo lectura (optimización)

class ReportController:
    def __init__(self, product_repo):
        self.product_repo = product_repo  # Salta Business Layer
    
    def get_all_products_report(self):
        # Query directo a BD (más rápido)
        products = self.product_repo.find_all()
        return {'products': [p.__dict__ for p in products]}
```

### 2. Relaxed Layered Architecture

Capas pueden depender de cualquier capa inferior, no solo la inmediata.

---

## Cuándo usar Layered Architecture

### ✅ Usar cuando

- Aplicación empresarial tradicional
- Equipo familiarizado con el patrón
- Requisitos estables
- Deployment monolítico es aceptable

### ❌ Evitar cuando

- Necesitas escalabilidad independiente de componentes
- Requisitos cambian frecuentemente
- Performance es crítico (muchas capas = overhead)
- Necesitas microservicios

---

## Resumen

**Layered Architecture**:

- Patrón más común y simple
- 3-4 capas: Presentation, Business, Persistence, Database
- Dependencias unidireccionales (top → bottom)
- Bueno para aplicaciones tradicionales, no para sistemas distribuidos

**Siguiente paso**: Tema 3.2 - Microkernel Architecture
