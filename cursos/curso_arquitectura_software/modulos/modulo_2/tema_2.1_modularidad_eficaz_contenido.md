# Tema 2.1: Modularidad Eficaz

**Tiempo estimado**: 50 minutos  
**Nivel**: Intermedio  
**Prerrequisitos**: Módulo 1 completo

## ¿Por qué importa este concepto?

La modularidad es **el principio más fundamental del diseño de software**. Sin modularidad efectiva, los sistemas se convierten en "big balls of mud" - masas inmanejables de código donde todo depende de todo.

**Modularidad eficaz** significa:

- **Bajo acoplamiento**: Los módulos son independientes
- **Alta cohesión**: Cada módulo tiene una responsabilidad clara
- **Interfaces bien definidas**: Contratos claros entre módulos
- **Ocultamiento de información**: Los detalles internos están encapsulados

En la industria, la diferencia entre un sistema mantenible y uno legacy está en la calidad de su modularización. Sistemas bien modularizados permiten:

- **Desarrollo paralelo**: Equipos trabajan en módulos diferentes sin conflictos
- **Testing aislado**: Cada módulo se prueba independientemente
- **Evolución controlada**: Cambios en un módulo no rompen otros
- **Reusabilidad**: Módulos se pueden usar en diferentes contextos

## Conexión con conocimientos previos

En el Módulo 0 aprendiste sobre acoplamiento y cohesión. En el Módulo 1 viste cómo la arquitectura define la estructura del sistema. Ahora profundizaremos en **cómo diseñar módulos efectivos** que sean la base de una arquitectura sólida.

---

## Comprensión intuitiva

### La metáfora de los componentes electrónicos

Piensa en un smartphone moderno:

- **Batería**: Módulo independiente, interfaz estándar (conectores), puedes reemplazarla
- **Cámara**: Módulo con interfaz definida, puedes mejorarla sin cambiar el resto
- **Procesador**: Módulo complejo pero encapsulado, el resto del sistema no necesita saber cómo funciona internamente

**Mala modularidad** sería soldar todos los componentes juntos. Si la batería falla, tienes que reemplazar todo el teléfono.

**Buena modularidad** permite:

- Reemplazar componentes individuales
- Probar componentes aisladamente
- Mejorar componentes sin afectar otros
- Entender el sistema parte por parte

---

## Definición formal

### Módulo

**Módulo** es una unidad de software que:

1. Encapsula un conjunto de funcionalidades relacionadas
2. Expone una interfaz pública bien definida
3. Oculta sus detalles de implementación
4. Puede ser desarrollado, probado y desplegado independientemente

### Métricas de modularidad

#### 1. Acoplamiento (Coupling)

**Tipos de acoplamiento** (de peor a mejor):

1. **Content Coupling** (Acoplamiento de contenido): Un módulo modifica datos internos de otro

   ```python
   # ❌ MUY MALO
   class OrderProcessor:
       def process(self, order):
           # Modificando directamente atributos internos de otro módulo
           order.payment._internal_status = "processed"
   ```

2. **Common Coupling** (Acoplamiento común): Módulos comparten datos globales

   ```python
   # ❌ MALO
   GLOBAL_CONFIG = {}  # Estado global compartido
   
   class ModuleA:
       def do_something(self):
           return GLOBAL_CONFIG['setting']
   
   class ModuleB:
       def do_other(self):
           GLOBAL_CONFIG['setting'] = 'new_value'
   ```

3. **Control Coupling** (Acoplamiento de control): Un módulo controla el flujo de otro

   ```python
   # ❌ MALO
   def process_order(order, use_new_algorithm=False):
       if use_new_algorithm:
           # Lógica nueva
       else:
           # Lógica vieja
   ```

4. **Stamp Coupling** (Acoplamiento de sello): Módulos comparten estructuras de datos complejas

   ```python
   # ⚠️ ACEPTABLE pero no ideal
   def calculate_total(order: Order) -> float:
       # Recibe objeto completo pero solo usa order.items
       return sum(item.price for item in order.items)
   ```

5. **Data Coupling** (Acoplamiento de datos): Módulos comparten solo datos primitivos

   ```python
   # ✅ BUENO
   def calculate_total(items: List[float]) -> float:
       return sum(items)
   ```

6. **Message Coupling** (Acoplamiento de mensajes): Módulos se comunican solo vía mensajes

   ```python
   # ✅ EXCELENTE
   class OrderService:
       def __init__(self, event_bus: EventBus):
           self.event_bus = event_bus
       
       def place_order(self, order_id: str):
           self.event_bus.publish(OrderPlacedEvent(order_id))
   ```

#### 2. Cohesión (Cohesion)

**Tipos de cohesión** (de peor a mejor):

1. **Coincidental Cohesion** (Cohesión coincidental): Funciones agrupadas sin razón

   ```python
   # ❌ MUY MALO
   class Utilities:
       def format_date(self, date): pass
       def calculate_tax(self, amount): pass
       def send_email(self, to, subject): pass
       def validate_credit_card(self, number): pass
   ```

2. **Logical Cohesion** (Cohesión lógica): Funciones relacionadas lógicamente pero diferentes

   ```python
   # ❌ MALO
   class InputHandler:
       def handle_input(self, input_type):
           if input_type == 'keyboard':
               # Manejar teclado
           elif input_type == 'mouse':
               # Manejar mouse
           elif input_type == 'touch':
               # Manejar touch
   ```

3. **Temporal Cohesion** (Cohesión temporal): Funciones ejecutadas al mismo tiempo

   ```python
   # ⚠️ ACEPTABLE en algunos casos
   class Initializer:
       def initialize_system(self):
           self.load_config()
           self.connect_database()
           self.start_services()
   ```

4. **Procedural Cohesion** (Cohesión procedimental): Funciones que siguen una secuencia

   ```python
   # ⚠️ ACEPTABLE
   class OrderWorkflow:
       def validate_order(self): pass
       def calculate_total(self): pass
       def charge_payment(self): pass
       def send_confirmation(self): pass
   ```

5. **Communicational Cohesion** (Cohesión comunicacional): Funciones operan sobre los mismos datos

   ```python
   # ✅ BUENO
   class CustomerRepository:
       def find_by_id(self, customer_id): pass
       def save(self, customer): pass
       def delete(self, customer_id): pass
   ```

6. **Functional Cohesion** (Cohesión funcional): Todas las funciones contribuyen a una sola tarea

   ```python
   # ✅ EXCELENTE
   class TaxCalculator:
       def calculate_sales_tax(self, amount: float, region: str) -> float:
           rate = self._get_tax_rate(region)
           return amount * rate
       
       def _get_tax_rate(self, region: str) -> float:
           # Lógica interna
           pass
   ```

---

## Implementación práctica

### Herramienta: Analizador de modularidad

```python
import ast
import os
from typing import Dict, List, Set, Tuple
from dataclasses import dataclass
from collections import defaultdict

@dataclass
class ModuleMetrics:
    """Métricas de un módulo."""
    name: str
    lines_of_code: int
    num_classes: int
    num_functions: int
    dependencies: Set[str]  # Módulos de los que depende
    dependents: Set[str]    # Módulos que dependen de este
    
    @property
    def afferent_coupling(self) -> int:
        """Número de módulos que dependen de este (Ca)."""
        return len(self.dependents)
    
    @property
    def efferent_coupling(self) -> int:
        """Número de módulos de los que este depende (Ce)."""
        return len(self.dependencies)
    
    @property
    def instability(self) -> float:
        """
        Inestabilidad: I = Ce / (Ce + Ca)
        0 = Máximamente estable (muchos dependientes, pocas dependencias)
        1 = Máximamente inestable (pocas dependientes, muchas dependencias)
        """
        total = self.efferent_coupling + self.afferent_coupling
        if total == 0:
            return 0.0
        return self.efferent_coupling / total
    
    @property
    def abstractness(self) -> float:
        """
        Nivel de abstracción: A = Clases abstractas / Total clases
        (Simplificado: asumimos que módulos con muchas clases son más abstractos)
        """
        if self.num_classes == 0:
            return 0.0
        # Simplificación: en análisis real, contarías clases abstractas/interfaces
        return min(self.num_classes / 10, 1.0)
    
    @property
    def distance_from_main_sequence(self) -> float:
        """
        Distancia de la secuencia principal: D = |A + I - 1|
        0 = En la secuencia principal (ideal)
        1 = Máxima distancia (problemático)
        """
        return abs(self.abstractness + self.instability - 1)

class ModularityAnalyzer:
    """
    Analiza la modularidad de un proyecto Python.
    """
    
    def __init__(self, project_root: str):
        self.project_root = project_root
        self.modules: Dict[str, ModuleMetrics] = {}
        
    def analyze(self):
        """Analiza todos los módulos del proyecto."""
        for root, dirs, files in os.walk(self.project_root):
            # Ignorar directorios comunes
            dirs[:] = [d for d in dirs if d not in ['__pycache__', '.git', 'venv', 'node_modules']]
            
            for file in files:
                if file.endswith('.py'):
                    filepath = os.path.join(root, file)
                    self._analyze_file(filepath)
        
        # Calcular dependents (inverso de dependencies)
        for module_name, metrics in self.modules.items():
            for dep in metrics.dependencies:
                if dep in self.modules:
                    self.modules[dep].dependents.add(module_name)
    
    def _analyze_file(self, filepath: str):
        """Analiza un archivo Python."""
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            tree = ast.parse(content)
            
            # Nombre del módulo (relativo al project root)
            module_name = os.path.relpath(filepath, self.project_root).replace(os.sep, '.').replace('.py', '')
            
            # Contar clases y funciones
            num_classes = sum(1 for node in ast.walk(tree) if isinstance(node, ast.ClassDef))
            num_functions = sum(1 for node in ast.walk(tree) if isinstance(node, ast.FunctionDef))
            
            # Contar líneas de código (sin comentarios ni líneas vacías)
            lines_of_code = len([line for line in content.split('\n') 
                               if line.strip() and not line.strip().startswith('#')])
            
            # Detectar imports (dependencias)
            dependencies = set()
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        dependencies.add(alias.name.split('.')[0])
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        dependencies.add(node.module.split('.')[0])
            
            # Filtrar solo dependencias internas del proyecto
            dependencies = {dep for dep in dependencies 
                          if not dep.startswith('_') and dep not in ['os', 'sys', 'typing', 'dataclasses']}
            
            self.modules[module_name] = ModuleMetrics(
                name=module_name,
                lines_of_code=lines_of_code,
                num_classes=num_classes,
                num_functions=num_functions,
                dependencies=dependencies,
                dependents=set()
            )
        
        except Exception as e:
            print(f"Error analizando {filepath}: {e}")
    
    def identify_problems(self) -> List[str]:
        """Identifica problemas de modularidad."""
        problems = []
        
        for module_name, metrics in self.modules.items():
            # Problema 1: Módulos muy grandes
            if metrics.lines_of_code > 500:
                problems.append(
                    f"⚠️  {module_name}: Módulo muy grande ({metrics.lines_of_code} LOC). "
                    f"Considera dividirlo."
                )
            
            # Problema 2: Alta inestabilidad con muchos dependientes
            if metrics.instability > 0.7 and metrics.afferent_coupling > 3:
                problems.append(
                    f"⚠️  {module_name}: Alta inestabilidad ({metrics.instability:.2f}) "
                    f"con {metrics.afferent_coupling} dependientes. Riesgo de cambios en cascada."
                )
            
            # Problema 3: Lejos de la secuencia principal
            if metrics.distance_from_main_sequence > 0.5:
                problems.append(
                    f"⚠️  {module_name}: Distancia de secuencia principal = {metrics.distance_from_main_sequence:.2f}. "
                    f"Módulo problemático (ni estable ni abstracto, o demasiado de ambos)."
                )
            
            # Problema 4: Demasiadas dependencias (alto acoplamiento eferente)
            if metrics.efferent_coupling > 10:
                problems.append(
                    f"⚠️  {module_name}: Demasiadas dependencias ({metrics.efferent_coupling}). "
                    f"Dificulta testing y mantenimiento."
                )
        
        return problems
    
    def generate_report(self) -> str:
        """Genera reporte de modularidad."""
        report = "# Análisis de Modularidad\n\n"
        report += f"Total de módulos: {len(self.modules)}\n\n"
        
        # Ordenar por distancia de secuencia principal (peores primero)
        sorted_modules = sorted(self.modules.values(), 
                              key=lambda m: m.distance_from_main_sequence, 
                              reverse=True)
        
        report += "## Módulos (ordenados por problemáticos)\n\n"
        report += "| Módulo | LOC | Ca | Ce | I | D |\n"
        report += "|--------|-----|----|----|---|---|\n"
        
        for metrics in sorted_modules[:10]:  # Top 10 más problemáticos
            report += f"| {metrics.name} | {metrics.lines_of_code} | "
            report += f"{metrics.afferent_coupling} | {metrics.efferent_coupling} | "
            report += f"{metrics.instability:.2f} | {metrics.distance_from_main_sequence:.2f} |\n"
        
        report += "\n**Leyenda**:\n"
        report += "- **LOC**: Lines of Code\n"
        report += "- **Ca**: Afferent Coupling (módulos que dependen de este)\n"
        report += "- **Ce**: Efferent Coupling (módulos de los que este depende)\n"
        report += "- **I**: Instability (0=estable, 1=inestable)\n"
        report += "- **D**: Distance from Main Sequence (0=ideal, 1=problemático)\n\n"
        
        # Problemas identificados
        problems = self.identify_problems()
        if problems:
            report += "## Problemas Identificados\n\n"
            for problem in problems[:15]:  # Top 15 problemas
                report += f"{problem}\n\n"
        
        return report


# Ejemplo de uso
if __name__ == "__main__":
    # Analizar proyecto actual
    analyzer = ModularityAnalyzer("./src")
    analyzer.analyze()
    
    print(analyzer.generate_report())
```

### Principios de diseño modular

#### 1. Principio de Responsabilidad Única (SRP)

```python
# ❌ MALO: Múltiples responsabilidades
class User:
    def __init__(self, username, email):
        self.username = username
        self.email = email
    
    def save_to_database(self):
        # Responsabilidad de persistencia
        pass
    
    def send_welcome_email(self):
        # Responsabilidad de notificación
        pass
    
    def validate_email(self):
        # Responsabilidad de validación
        pass

# ✅ BUENO: Responsabilidades separadas
class User:
    def __init__(self, username, email):
        self.username = username
        self.email = email

class UserRepository:
    def save(self, user: User):
        # Solo persistencia
        pass

class EmailService:
    def send_welcome_email(self, user: User):
        # Solo notificaciones
        pass

class EmailValidator:
    def validate(self, email: str) -> bool:
        # Solo validación
        pass
```

#### 2. Principio de Ocultamiento de Información

```python
# ❌ MALO: Detalles internos expuestos
class OrderProcessor:
    def __init__(self):
        self.internal_cache = {}  # Público, puede ser modificado externamente
        self.processing_queue = []  # Público
    
    def process(self, order):
        # Lógica que depende de internal_cache y processing_queue
        pass

# ✅ BUENO: Detalles internos ocultos
class OrderProcessor:
    def __init__(self):
        self.__internal_cache = {}  # Privado
        self.__processing_queue = []  # Privado
    
    def process(self, order):
        # Interfaz pública clara
        self.__add_to_queue(order)
        self.__process_queue()
    
    def __add_to_queue(self, order):
        # Método privado
        pass
    
    def __process_queue(self):
        # Método privado
        pass
```

#### 3. Principio de Inversión de Dependencias

```python
from abc import ABC, abstractmethod

# ❌ MALO: Dependencia de implementación concreta
class OrderService:
    def __init__(self):
        self.mysql_repository = MySQLOrderRepository()  # Acoplamiento fuerte
    
    def place_order(self, order):
        self.mysql_repository.save(order)

# ✅ BUENO: Dependencia de abstracción
class OrderRepository(ABC):
    @abstractmethod
    def save(self, order):
        pass

class MySQLOrderRepository(OrderRepository):
    def save(self, order):
        # Implementación MySQL
        pass

class MongoOrderRepository(OrderRepository):
    def save(self, order):
        # Implementación MongoDB
        pass

class OrderService:
    def __init__(self, repository: OrderRepository):
        self.repository = repository  # Depende de abstracción
    
    def place_order(self, order):
        self.repository.save(order)

# Uso con inyección de dependencias
mysql_repo = MySQLOrderRepository()
order_service = OrderService(mysql_repo)

# Fácil cambiar a MongoDB
mongo_repo = MongoOrderRepository()
order_service = OrderService(mongo_repo)
```

---

## Patrones de modularización

### 1. Modularización por capas (Layered)

```
Presentation Layer
    ↓
Business Logic Layer
    ↓
Data Access Layer
    ↓
Database
```

**Ventajas**: Clara separación de concerns
**Desventajas**: Puede llevar a acoplamiento vertical

### 2. Modularización por features (Vertical Slices)

```
Feature: User Management
    - UserController
    - UserService
    - UserRepository
    - User model

Feature: Order Processing
    - OrderController
    - OrderService
    - OrderRepository
    - Order model
```

**Ventajas**: Alta cohesión, equipos autónomos
**Desventajas**: Posible duplicación de código

### 3. Modularización hexagonal (Ports & Adapters)

```
Core Domain (center)
    ↔ Ports (interfaces)
        ↔ Adapters (implementations)
```

**Ventajas**: Máxima testabilidad, independencia de frameworks
**Desventajas**: Mayor complejidad inicial

---

## Resumen del concepto

**En una frase**: La modularidad eficaz se logra mediante bajo acoplamiento, alta cohesión, interfaces bien definidas y ocultamiento de información.

**Métricas clave**:

- **Acoplamiento**: Minimizar dependencias entre módulos
- **Cohesión**: Maximizar relación entre elementos de un módulo
- **Instabilidad**: I = Ce / (Ce + Ca)
- **Distancia de secuencia principal**: D = |A + I - 1|

**Principios**:

1. Responsabilidad Única
2. Ocultamiento de Información
3. Inversión de Dependencias

**Siguiente paso**: Tema 2.2 - Principios SOLID en Arquitectura
