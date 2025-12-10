# BANCO DE EJERCICIOS: Monolito Modular

## METADATA

- **Módulo**: Módulo 3 - Estilos Arquitectónicos
- **Tema**: 3.4 - Monolito Modular
- **Objetivos evaluados**:
  - Diseñar módulos independientes
  - Implementar Event Bus
  - Aplicar DI Container
- **Tiempo total estimado**: 120 minutos

---

## EJERCICIO 1: Diseñar Módulos

### METADATA

- **ID**: `EJ-M3-401`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 45 minutos
- **Nivel Bloom**: Crear
- **Tipo**: Diseño

### ENUNCIADO

Diseña una arquitectura de monolito modular para un sistema de gestión de biblioteca.

**Requisitos funcionales**:

- Gestión de libros (catálogo)
- Gestión de usuarios (miembros)
- Préstamos y devoluciones
- Multas y pagos
- Notificaciones

**Restricciones**:

- Módulos independientes
- Comunicación solo vía APIs públicas
- Event Bus para comunicación asíncrona

**Entregables**:

1. Definición de módulos y sus responsabilidades
2. APIs públicas de cada módulo
3. Eventos del sistema
4. Diagrama de dependencias

### SOLUCIÓN MODELO

**Módulos**:

1. **Catalog Module**
   - Responsabilidad: Gestión de libros, categorías, búsqueda
   - API Pública:

     ```python
     class CatalogService:
         def get_book(self, book_id: str) -> Book
         def search_books(self, query: str) -> List[Book]
         def check_availability(self, book_id: str) -> bool
     ```

2. **Member Module**
   - Responsabilidad: Gestión de miembros, perfiles
   - API Pública:

     ```python
     class MemberService:
         def get_member(self, member_id: str) -> Member
         def create_member(self, data: dict) -> str
     ```

3. **Loan Module**
   - Responsabilidad: Préstamos, devoluciones
   - API Pública:

     ```python
     class LoanService:
         def borrow_book(self, member_id: str, book_id: str) -> Loan
         def return_book(self, loan_id: str) -> bool
     ```

4. **Fine Module**
   - Responsabilidad: Multas, pagos
   - API Pública:

     ```python
     class FineService:
         def calculate_fine(self, loan_id: str) -> float
         def process_payment(self, fine_id: str, amount: float) -> bool
     ```

5. **Notification Module**
   - Responsabilidad: Emails, SMS
   - API Pública:

     ```python
     class NotificationService:
         # Solo consume eventos, no expone API
     ```

**Eventos**:

- `book.borrowed`
- `book.returned`
- `book.overdue`
- `fine.created`
- `payment.processed`

---

## EJERCICIO 2: Implementar Event Bus

### METADATA

- **ID**: `EJ-M3-402`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo estimado**: 30 minutos
- **Nivel Bloom**: Aplicar
- **Tipo**: Implementación

### ENUNCIADO

Implementa un Event Bus para comunicación entre módulos.

### ESQUELETO DE CÓDIGO

```python
from typing import Callable, Dict, List

class EventBus:
    def __init__(self):
        # TODO: Implementar
        pass
    
    def subscribe(self, event_name: str, handler: Callable):
        # TODO: Implementar
        pass
    
    def publish(self, event_name: str, data: dict):
        # TODO: Implementar
        pass
```

### SOLUCIÓN MODELO

```python
from typing import Callable, Dict, List

class EventBus:
    def __init__(self):
        self.subscribers: Dict[str, List[Callable]] = {}
    
    def subscribe(self, event_name: str, handler: Callable):
        if event_name not in self.subscribers:
            self.subscribers[event_name] = []
        self.subscribers[event_name].append(handler)
    
    def publish(self, event_name: str, data: dict):
        if event_name in self.subscribers:
            for handler in self.subscribers[event_name]:
                try:
                    handler(data)
                except Exception as e:
                    print(f"Error in handler: {e}")

# Uso
event_bus = EventBus()

# Loan Module publica evento
def borrow_book(member_id, book_id):
    # Lógica de préstamo
    event_bus.publish('book.borrowed', {
        'member_id': member_id,
        'book_id': book_id
    })

# Notification Module escucha evento
def send_borrow_confirmation(data):
    print(f"📧 Sending confirmation to {data['member_id']}")

event_bus.subscribe('book.borrowed', send_borrow_confirmation)
```

---

## EJERCICIO 3: Implementar DI Container

### METADATA

- **ID**: `EJ-M3-403`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo estimado**: 45 minutos
- **Nivel Bloom**: Crear
- **Tipo**: Implementación

### ENUNCIADO

Implementa un Dependency Injection Container para ensamblar módulos.

### ESQUELETO DE CÓDIGO

```python
class DIContainer:
    def __init__(self):
        # TODO: Implementar
        pass
    
    def register(self, name: str, factory: Callable):
        # TODO: Implementar
        pass
    
    def resolve(self, name: str):
        # TODO: Implementar
        pass
```

### SOLUCIÓN MODELO

```python
from typing import Callable, Dict, Any

class DIContainer:
    def __init__(self):
        self.factories: Dict[str, Callable] = {}
        self.instances: Dict[str, Any] = {}
    
    def register(self, name: str, factory: Callable):
        self.factories[name] = factory
    
    def resolve(self, name: str):
        if name in self.instances:
            return self.instances[name]
        
        if name not in self.factories:
            raise ValueError(f"Service {name} not registered")
        
        instance = self.factories[name](self)
        self.instances[name] = instance
        
        return instance

# Uso
container = DIContainer()

# Registrar servicios
container.register('event_bus', lambda c: EventBus())
container.register('catalog_service', lambda c: CatalogService())
container.register('loan_service', lambda c: LoanService(
    c.resolve('catalog_service'),
    c.resolve('event_bus')
))

# Resolver dependencias
loan_service = container.resolve('loan_service')
```

---

## AUTOEVALUACIÓN

- [ ] Puedo diseñar módulos independientes
- [ ] Entiendo comunicación vía Event Bus
- [ ] Puedo implementar DI Container
- [ ] Sé cuándo usar monolito modular vs microservicios
