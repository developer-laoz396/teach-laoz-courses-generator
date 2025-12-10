# Tema 2.4: Gestión de Deuda Técnica

**Tiempo estimado**: 45 minutos  
**Nivel**: Intermedio  
**Prerrequisitos**: Módulo 2 completo

## ¿Por qué importa este concepto?

La **deuda técnica** es una metáfora acuñada por Ward Cunningham que compara decisiones técnicas subóptimas con deuda financiera:

- **Tomas un "préstamo"**: Implementas una solución rápida pero imperfecta
- **Pagas "intereses"**: Cada cambio futuro es más lento y costoso
- **Eventualmente pagas el "principal"**: Refactorizas o reescribes

**El problema**: La deuda técnica es inevitable y no siempre es mala. La clave es **gestionarla conscientemente**.

**Deuda técnica intencional** (aceptable):

- MVP para validar mercado rápidamente
- Prototipos para demostrar concepto
- Workarounds temporales con plan de pago

**Deuda técnica accidental** (peligrosa):

- Falta de conocimiento del equipo
- No seguir estándares
- Código sin tests
- Arquitectura que emergió sin diseño

En la industria, la deuda técnica mal gestionada es la razón #1 por la que sistemas se vuelven "legacy" y eventualmente se reescriben desde cero (con costo enorme).

---

## Tipos de Deuda Técnica

### Cuadrante de Deuda Técnica (Martin Fowler)

```
                Deliberada
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    │  "Sabemos que│  "Tenemos que │
    │   es deuda y │   entregar ya"│
    │   la         │               │
Imprudente  aceptamos"    │               │  Prudente
    │               │               │
    │  "¿Qué son   │  "Ahora       │
    │   capas?"    │   sabemos cómo│
    │               │   debimos     │
    │               │   hacerlo"    │
    └───────────────┼───────────────┘
                    │
                Inadvertida
```

### 1. Deuda de Código

**Qué es**: Código mal escrito, duplicado, complejo.

```python
# ❌ DEUDA: Código duplicado
def calculate_order_total_for_web(order):
    total = 0
    for item in order.items:
        total += item.price * item.quantity
    tax = total * 0.08
    return total + tax

def calculate_order_total_for_mobile(order):
    total = 0
    for item in order.items:
        total += item.price * item.quantity
    tax = total * 0.08
    return total + tax

# ✅ REFACTORIZADO: DRY
def calculate_order_total(order):
    subtotal = sum(item.price * item.quantity for item in order.items)
    tax = subtotal * 0.08
    return subtotal + tax
```

**Interés pagado**: Cada bug debe arreglarse en múltiples lugares.

### 2. Deuda de Diseño

**Qué es**: Arquitectura o diseño que no escala o es difícil de mantener.

```python
# ❌ DEUDA: God Class
class OrderManager:
    def create_order(self): pass
    def validate_order(self): pass
    def calculate_total(self): pass
    def process_payment(self): pass
    def send_confirmation_email(self): pass
    def update_inventory(self): pass
    def generate_invoice(self): pass
    def handle_returns(self): pass
    # ... 50 métodos más

# ✅ REFACTORIZADO: Responsabilidades separadas
class OrderService:
    def create_order(self): pass

class PaymentService:
    def process_payment(self): pass

class NotificationService:
    def send_confirmation(self): pass

class InventoryService:
    def update_stock(self): pass
```

**Interés pagado**: Cambios requieren entender toda la clase gigante.

### 3. Deuda de Testing

**Qué es**: Falta de tests o tests de baja calidad.

```python
# ❌ DEUDA: Sin tests
def process_refund(order_id, amount):
    # Lógica compleja sin tests
    order = get_order(order_id)
    if order.status == 'COMPLETED':
        if amount <= order.total:
            # Procesar refund
            return True
    return False

# ✅ CON TESTS
def test_process_refund_success():
    order = create_test_order(total=100, status='COMPLETED')
    assert process_refund(order.id, 50) == True

def test_process_refund_exceeds_total():
    order = create_test_order(total=100, status='COMPLETED')
    assert process_refund(order.id, 150) == False

def test_process_refund_wrong_status():
    order = create_test_order(total=100, status='PENDING')
    assert process_refund(order.id, 50) == False
```

**Interés pagado**: Miedo a cambiar código, bugs en producción.

### 4. Deuda de Documentación

**Qué es**: Falta de documentación o documentación desactualizada.

```python
# ❌ DEUDA: Sin documentación
def calc(x, y, z):
    return (x + y) * z if z > 0 else x - y

# ✅ DOCUMENTADO
def calculate_price_with_tax(base_price: float, 
                             discount: float, 
                             tax_rate: float) -> float:
    """
    Calcula el precio final con descuento y tax.
    
    Args:
        base_price: Precio base del producto
        discount: Descuento a aplicar (0-100)
        tax_rate: Tasa de impuesto (0-1)
    
    Returns:
        Precio final con descuento y tax aplicados
    
    Examples:
        >>> calculate_price_with_tax(100, 10, 0.08)
        97.2  # (100 - 10) * 1.08
    """
    if tax_rate > 0:
        return (base_price - discount) * (1 + tax_rate)
    return base_price - discount
```

**Interés pagado**: Tiempo perdido entendiendo código.

---

## Herramienta: Technical Debt Register

```python
from dataclasses import dataclass
from typing import List, Optional
from enum import Enum
from datetime import datetime, timedelta

class DebtType(Enum):
    CODE = "Code Quality"
    DESIGN = "Design/Architecture"
    TESTING = "Testing"
    DOCUMENTATION = "Documentation"
    INFRASTRUCTURE = "Infrastructure"
    SECURITY = "Security"

class DebtSeverity(Enum):
    CRITICAL = 5  # Bloquea desarrollo
    HIGH = 4      # Impacto significativo
    MEDIUM = 3    # Molestia notable
    LOW = 2       # Molestia menor
    TRIVIAL = 1   # Cosmético

@dataclass
class TechnicalDebt:
    id: str
    title: str
    description: str
    debt_type: DebtType
    severity: DebtSeverity
    affected_components: List[str]
    estimated_effort_hours: int
    interest_rate: str  # Costo de NO resolver
    created_date: datetime
    reason_incurred: str
    proposed_solution: Optional[str] = None
    deadline: Optional[datetime] = None
    
    def priority_score(self) -> float:
        """
        Calcula prioridad: (severidad * urgencia) / esfuerzo
        """
        urgency = 1.0
        if self.deadline:
            days_until_deadline = (self.deadline - datetime.now()).days
            if days_until_deadline < 30:
                urgency = 2.0
            if days_until_deadline < 7:
                urgency = 3.0
        
        return (self.severity.value * urgency) / max(self.estimated_effort_hours, 1)

class TechnicalDebtRegister:
    """
    Registro centralizado de deuda técnica.
    """
    def __init__(self):
        self.debts: List[TechnicalDebt] = []
    
    def add_debt(self, debt: TechnicalDebt):
        """Registra nueva deuda."""
        self.debts.append(debt)
    
    def get_by_severity(self, severity: DebtSeverity) -> List[TechnicalDebt]:
        """Filtra por severidad."""
        return [d for d in self.debts if d.severity == severity]
    
    def get_by_type(self, debt_type: DebtType) -> List[TechnicalDebt]:
        """Filtra por tipo."""
        return [d for d in self.debts if d.debt_type == debt_type]
    
    def prioritize(self) -> List[TechnicalDebt]:
        """
        Retorna deudas ordenadas por prioridad.
        """
        return sorted(self.debts, key=lambda d: d.priority_score(), reverse=True)
    
    def calculate_total_interest(self) -> str:
        """
        Estima el costo total de intereses.
        """
        total_hours_wasted = 0
        for debt in self.debts:
            # Parsear interest_rate (ej: "2 horas/semana")
            if "hora" in debt.interest_rate:
                hours = int(debt.interest_rate.split()[0])
                if "semana" in debt.interest_rate:
                    total_hours_wasted += hours * 4  # Por mes
                elif "sprint" in debt.interest_rate:
                    total_hours_wasted += hours * 2  # Por mes
        
        return f"{total_hours_wasted} horas/mes perdidas en intereses"
    
    def generate_report(self) -> str:
        """Genera reporte de deuda técnica."""
        report = "# Technical Debt Register\n\n"
        report += f"**Total items**: {len(self.debts)}\n"
        report += f"**Total interest**: {self.calculate_total_interest()}\n\n"
        
        # Por severidad
        report += "## By Severity\n\n"
        for severity in [DebtSeverity.CRITICAL, DebtSeverity.HIGH, DebtSeverity.MEDIUM]:
            debts = self.get_by_severity(severity)
            if debts:
                report += f"### {severity.name} ({len(debts)} items)\n\n"
                for debt in debts:
                    report += f"- **{debt.id}**: {debt.title}\n"
                    report += f"  - Effort: {debt.estimated_effort_hours}h\n"
                    report += f"  - Interest: {debt.interest_rate}\n"
                    report += f"  - Components: {', '.join(debt.affected_components)}\n\n"
        
        # Top 10 por prioridad
        report += "## Top 10 Priority (ROI)\n\n"
        report += "| ID | Title | Severity | Effort | Priority Score |\n"
        report += "|----|-------|----------|--------|----------------|\n"
        
        for debt in self.prioritize()[:10]:
            report += f"| {debt.id} | {debt.title} | {debt.severity.name} | "
            report += f"{debt.estimated_effort_hours}h | {debt.priority_score():.2f} |\n"
        
        return report

# Ejemplo de uso
if __name__ == "__main__":
    register = TechnicalDebtRegister()
    
    register.add_debt(TechnicalDebt(
        id="TD-001",
        title="Authentication logic duplicated across 5 services",
        description="Each microservice has its own auth implementation",
        debt_type=DebtType.DESIGN,
        severity=DebtSeverity.CRITICAL,
        affected_components=["UserService", "OrderService", "PaymentService", "NotificationService", "ReportService"],
        estimated_effort_hours=40,
        interest_rate="8 horas/sprint (cada nuevo servicio duplica código)",
        created_date=datetime.now() - timedelta(days=90),
        reason_incurred="MVP rápido, no había tiempo para auth centralizado",
        proposed_solution="Implementar API Gateway con auth centralizado",
        deadline=datetime.now() + timedelta(days=30)
    ))
    
    register.add_debt(TechnicalDebt(
        id="TD-002",
        title="No integration tests for checkout flow",
        description="Critical path sin tests end-to-end",
        debt_type=DebtType.TESTING,
        severity=DebtSeverity.HIGH,
        affected_components=["CheckoutService"],
        estimated_effort_hours=16,
        interest_rate="1 bug crítico cada 2 sprints (4 horas debugging)",
        created_date=datetime.now() - timedelta(days=60),
        reason_incurred="Presión de deadline",
        proposed_solution="Implementar tests con Playwright",
        deadline=datetime.now() + timedelta(days=14)
    ))
    
    register.add_debt(TechnicalDebt(
        id="TD-003",
        title="Monolithic database schema",
        description="Todas las tablas en una BD, dificulta microservicios",
        debt_type=DebtType.DESIGN,
        severity=DebtSeverity.HIGH,
        affected_components=["Database"],
        estimated_effort_hours=80,
        interest_rate="Cada nuevo servicio requiere acceso a BD monolítica",
        created_date=datetime.now() - timedelta(days=180),
        reason_incurred="Sistema empezó como monolito",
        proposed_solution="Database per service pattern",
        deadline=None
    ))
    
    print(register.generate_report())
```

---

## Estrategias de Gestión

### 1. Boy Scout Rule

> "Deja el código mejor de como lo encontraste"

```python
# Cada vez que tocas código, mejóralo un poco

# Antes de tu cambio
def process_order(order):
    # Código legacy complicado
    if order.status == 'pending':
        if order.total > 0:
            # ... 50 líneas más
            pass

# Después de tu cambio (refactorizado mientras añades feature)
def process_order(order):
    if not _is_processable(order):
        return False
    
    _validate_order(order)
    _charge_payment(order)
    _update_inventory(order)
    _send_confirmation(order)
    
    return True

def _is_processable(order):
    return order.status == 'pending' and order.total > 0
```

### 2. Strangler Fig Pattern

**Concepto**: Reemplazar sistema legacy gradualmente, no big bang rewrite.

```python
# Paso 1: Crear nueva implementación
class NewOrderService:
    def create_order(self, data):
        # Nueva implementación limpia
        pass

# Paso 2: Router que decide qué usar
class OrderServiceRouter:
    def __init__(self):
        self.legacy_service = LegacyOrderService()
        self.new_service = NewOrderService()
        self.feature_flag = FeatureFlag()
    
    def create_order(self, data):
        if self.feature_flag.is_enabled('new_order_service', data['user_id']):
            return self.new_service.create_order(data)
        else:
            return self.legacy_service.create_order(data)

# Paso 3: Incrementar % de tráfico a nuevo servicio
# 0% → 10% → 50% → 100%

# Paso 4: Eliminar legacy cuando 100% migrado
```

### 3. Technical Debt Sprint

**Concepto**: Dedicar sprints completos a pagar deuda.

```markdown
# Sprint Planning: Technical Debt Sprint

## Objetivo
Reducir deuda técnica crítica en 50%

## Items seleccionados (del register)
1. TD-001: Centralizar autenticación (40h)
2. TD-002: Tests de integración checkout (16h)
3. TD-005: Refactorizar OrderService (24h)

Total: 80h (capacidad del sprint)

## Métricas de éxito
- Code coverage: 60% → 75%
- Cyclomatic complexity promedio: 15 → 10
- Tiempo de build: 10min → 5min
```

### 4. Deuda Técnica en Definition of Done

```markdown
# Definition of Done (actualizado)

Una historia está DONE cuando:
- ✅ Código implementado y revisado
- ✅ Tests unitarios (coverage > 80%)
- ✅ Tests de integración para happy path
- ✅ Documentación actualizada
- ✅ **No introduce nueva deuda técnica** (o está documentada en register)
- ✅ **Paga al menos 1 item de deuda existente** (Boy Scout Rule)
```

---

## Métricas de Deuda Técnica

### 1. Code Coverage

```python
# Ejecutar con pytest-cov
# pytest --cov=src --cov-report=html

# Meta: > 80% coverage
```

### 2. Cyclomatic Complexity

```python
# Usar radon
# radon cc src/ -a

# Meta: Complejidad promedio < 10
```

### 3. Technical Debt Ratio

```
TD Ratio = (Costo de remediar deuda) / (Costo de desarrollo)

Ejemplo:
- Costo de remediar toda la deuda: 500 horas
- Costo de desarrollo del sistema: 2000 horas
- TD Ratio = 500/2000 = 25%

Meta: < 5% (excelente), < 10% (aceptable), > 20% (peligroso)
```

### 4. Interest Rate

```
Interest = Tiempo perdido por sprint debido a deuda

Ejemplo:
- 8 horas/sprint perdidas en duplicar código de auth
- 4 horas/sprint debugging por falta de tests
- Total: 12 horas/sprint = 30% de capacidad perdida

Meta: < 10% de capacidad del sprint
```

---

## Resumen

**Deuda técnica**:

- Es inevitable
- No siempre es mala (deuda intencional puede ser estratégica)
- Debe gestionarse conscientemente

**Tipos**:

- Código, Diseño, Testing, Documentación, Infraestructura, Seguridad

**Estrategias**:

1. Boy Scout Rule (mejora continua)
2. Strangler Fig (migración gradual)
3. Technical Debt Sprints (pago dedicado)
4. Incluir en Definition of Done

**Métricas**:

- Code coverage, Cyclomatic complexity, TD Ratio, Interest Rate

**Siguiente paso**: Módulo 3 - Estilos Arquitectónicos Fundamentales

---

## ✅ MÓDULO 2 COMPLETADO

Has completado el **Módulo 2: Principios de Diseño**. Ahora dominas:

- Modularidad eficaz
- Principios SOLID
- Arquitectura Limpia y Hexagonal
- Gestión de Deuda Técnica

**Próximo módulo**: Estilos Arquitectónicos (Layered, Microkernel, Pipeline, Monolito Modular)
