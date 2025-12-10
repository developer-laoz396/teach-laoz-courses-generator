# Tema 1.2: Atributos de Calidad (-ilities)

**Tiempo estimado**: 50 minutos  
**Nivel**: Básico-Intermedio  
**Prerrequisitos**: Tema 1.1 - ¿Qué es realmente la arquitectura?

## ¿Por qué importa este concepto?

Los atributos de calidad (también llamados "quality attributes" o "-ilities" por sus sufijos en inglés) son **la razón de ser de la arquitectura de software**. No diseñas arquitectura por arte; la diseñas para lograr objetivos específicos de calidad.

Imagina que te piden "diseñar una aplicación web". Sin saber los atributos de calidad prioritarios, es imposible tomar decisiones arquitectónicas correctas:

- Si la prioridad es **rendimiento**, elegirás caching agresivo, bases de datos en memoria, CDNs
- Si la prioridad es **seguridad**, elegirás encriptación end-to-end, autenticación multi-factor, auditoría exhaustiva
- Si la prioridad es **time-to-market**, elegirás frameworks conocidos, servicios managed, arquitectura simple

**La arquitectura es el arte de balancear atributos de calidad conflictivos**. Entender estos atributos te permitirá:

- **Priorizar decisiones** arquitectónicas basándote en lo que realmente importa
- **Comunicar con stakeholders** en términos de valor de negocio
- **Medir éxito** de la arquitectura objetivamente
- **Hacer trade-offs** informados y documentados

En la industria, los proyectos fallan no porque el código esté mal escrito, sino porque la arquitectura no cumple los atributos de calidad críticos. Un sistema puede tener código perfecto pero ser inutilizable si tarda 30 segundos en cargar, o si se cae cada vez que hay 1000 usuarios concurrentes.

## Conexión con conocimientos previos

En el Módulo 0 aprendiste que los atributos de calidad son características medibles de un sistema. En el Tema 1.1 viste que la arquitectura existe para satisfacer estos atributos. Ahora profundizaremos en cuáles son los atributos más importantes, cómo medirlos, cómo priorizarlos, y cómo las decisiones arquitectónicas los afectan.

---

## Comprensión intuitiva

### La metáfora del automóvil

Cuando compras un auto, no solo compras "un vehículo que te lleva de A a B". Evalúas múltiples atributos de calidad:

- **Rendimiento**: ¿Qué tan rápido acelera? ¿Cuál es la velocidad máxima?
- **Eficiencia**: ¿Cuántos kilómetros por litro?
- **Seguridad**: ¿Tiene airbags? ¿Qué rating tiene en crash tests?
- **Confiabilidad**: ¿Qué tan seguido se descompone?
- **Mantenibilidad**: ¿Qué tan fácil/caro es repararlo?
- **Usabilidad**: ¿Es cómodo? ¿Fácil de conducir?
- **Costo**: ¿Cuánto cuesta comprarlo? ¿Y mantenerlo?

**No puedes maximizar todos simultáneamente**. Un Ferrari es rápido pero consume mucha gasolina y es caro de mantener. Un Toyota Corolla es confiable y eficiente pero no es rápido. Un tanque militar es seguro pero no es usable para ir al supermercado.

**Lo mismo pasa con la arquitectura de software**: Debes elegir qué atributos priorizar y cuáles sacrificar.

---

## Definición formal

### Definición según ISO/IEC 25010

Los **atributos de calidad** son características de un sistema de software que indican el grado en que el sistema satisface las necesidades implícitas y explícitas de los stakeholders.

### Categorías principales de atributos de calidad

#### 1. **Atributos de Tiempo de Ejecución** (Runtime Quality Attributes)

Observables cuando el sistema está ejecutándose:

- **Performance** (Rendimiento)
- **Availability** (Disponibilidad)
- **Scalability** (Escalabilidad)
- **Security** (Seguridad)
- **Usability** (Usabilidad)
- **Reliability** (Confiabilidad)

#### 2. **Atributos de Tiempo de Desarrollo** (Development-time Quality Attributes)

Observables durante el desarrollo y mantenimiento:

- **Maintainability** (Mantenibilidad)
- **Testability** (Testeabilidad)
- **Modifiability** (Modificabilidad)
- **Portability** (Portabilidad)
- **Reusability** (Reusabilidad)

#### 3. **Atributos de Negocio** (Business Quality Attributes)

Relacionados con aspectos organizacionales:

- **Time-to-Market** (Tiempo al mercado)
- **Cost** (Costo)
- **Lifetime** (Vida útil esperada)

---

## Los 12 Atributos de Calidad Esenciales

### 1. Performance (Rendimiento)

**Definición**: Capacidad del sistema para cumplir requisitos de tiempo (latencia) y throughput (cantidad de trabajo procesado).

**Métricas**:

- **Latencia**: Tiempo de respuesta (ms)
- **Throughput**: Requests por segundo (RPS)
- **Utilización de recursos**: CPU, memoria, red

**Escenario de calidad**:

```
Estímulo: 1000 usuarios concurrentes hacen búsquedas
Respuesta: El sistema responde en < 200ms para el 95% de las peticiones
Medición: p95 latency < 200ms
```

**Tácticas arquitectónicas**:

- **Caching**: Redis, Memcached, CDN
- **Asincronía**: Message queues, event-driven
- **Paralelización**: Multi-threading, sharding
- **Optimización de recursos**: Connection pooling, lazy loading

**Trade-offs**:

- ✅ Mejor experiencia de usuario
- ❌ Mayor complejidad (caching, invalidación)
- ❌ Posible inconsistencia temporal

---

### 2. Availability (Disponibilidad)

**Definición**: Proporción de tiempo que el sistema está operativo y accesible.

**Métricas**:

- **Uptime**: Porcentaje de tiempo disponible (99.9%, 99.99%, etc.)
- **MTBF** (Mean Time Between Failures): Tiempo promedio entre fallos
- **MTTR** (Mean Time To Recovery): Tiempo promedio de recuperación

**Tabla de SLAs comunes**:

| SLA | Downtime/año | Downtime/mes | Downtime/semana |
|-----|--------------|--------------|-----------------|
| 99% | 3.65 días | 7.2 horas | 1.68 horas |
| 99.9% | 8.76 horas | 43.2 minutos | 10.1 minutos |
| 99.99% | 52.6 minutos | 4.32 minutos | 1.01 minutos |
| 99.999% | 5.26 minutos | 25.9 segundos | 6.05 segundos |

**Tácticas arquitectónicas**:

- **Redundancia**: Active-active, active-passive
- **Health checks**: Monitoreo continuo
- **Failover automático**: Circuit breakers, retry logic
- **Graceful degradation**: Funcionalidad reducida vs fallo total

**Trade-offs**:

- ✅ Confianza del usuario, cumplimiento de SLAs
- ❌ Costo de infraestructura (redundancia)
- ❌ Complejidad operacional

---

### 3. Scalability (Escalabilidad)

**Definición**: Capacidad del sistema para manejar crecimiento de carga sin degradación significativa.

**Tipos**:

- **Vertical (Scale Up)**: Más recursos en la misma máquina
- **Horizontal (Scale Out)**: Más máquinas

**Métricas**:

- **Throughput escalado**: RPS con N nodos
- **Eficiencia de escalado**: Speedup = Rendimiento(N nodos) / Rendimiento(1 nodo)
- **Límite de escalabilidad**: Punto donde añadir recursos no mejora rendimiento

**Tácticas arquitectónicas**:

- **Stateless services**: Facilita escalado horizontal
- **Load balancing**: Distribución de carga
- **Sharding/Partitioning**: División de datos
- **Caching distribuido**: Reducir carga en backend

**Trade-offs**:

- ✅ Maneja crecimiento de usuarios/datos
- ❌ Complejidad de coordinación (distributed systems)
- ❌ Eventual consistency en lugar de strong consistency

---

### 4. Security (Seguridad)

**Definición**: Capacidad del sistema para proteger información y funcionalidad contra acceso no autorizado.

**Dimensiones (CIA Triad)**:

- **Confidentiality**: Solo usuarios autorizados acceden a datos
- **Integrity**: Datos no son modificados sin autorización
- **Availability**: Sistema disponible para usuarios legítimos

**Tácticas arquitectónicas**:

- **Authentication**: OAuth2, JWT, MFA
- **Authorization**: RBAC, ABAC, políticas de acceso
- **Encryption**: TLS/SSL, encryption at rest
- **Input validation**: Prevenir injection attacks
- **Audit logging**: Trazabilidad de acciones

**Trade-offs**:

- ✅ Protección de datos sensibles, cumplimiento regulatorio
- ❌ Overhead de rendimiento (encryption, validación)
- ❌ Complejidad de implementación

---

### 5. Maintainability (Mantenibilidad)

**Definición**: Facilidad con la que el sistema puede ser modificado para corregir defectos, mejorar rendimiento, o adaptarse a cambios.

**Métricas**:

- **Cyclomatic complexity**: Complejidad del código
- **Code coverage**: Porcentaje de código cubierto por tests
- **Technical debt**: Tiempo estimado para refactorizar

**Tácticas arquitectónicas**:

- **Modularidad**: Separación de concerns
- **Abstracción**: Interfaces claras
- **Documentación**: ADRs, diagramas C4
- **Code standards**: Linters, formatters

**Trade-offs**:

- ✅ Menor costo de mantenimiento a largo plazo
- ❌ Mayor tiempo inicial de desarrollo
- ❌ Posible over-engineering

---

### 6. Testability (Testeabilidad)

**Definición**: Facilidad con la que se pueden diseñar y ejecutar tests para validar el comportamiento del sistema.

**Métricas**:

- **Code coverage**: Líneas/branches cubiertos
- **Test execution time**: Tiempo de ejecución de suite de tests
- **Flakiness**: Porcentaje de tests intermitentes

**Tácticas arquitectónicas**:

- **Dependency injection**: Facilita mocking
- **Interfaces**: Permite test doubles
- **Observability**: Logs, metrics, traces
- **Test automation**: CI/CD pipelines

**Trade-offs**:

- ✅ Confianza en cambios, detección temprana de bugs
- ❌ Tiempo de desarrollo de tests
- ❌ Mantenimiento de tests

---

### 7. Modifiability (Modificabilidad)

**Definición**: Costo (en tiempo, esfuerzo, riesgo) de realizar cambios al sistema.

**Métricas**:

- **Change impact**: Número de módulos afectados por un cambio
- **Time to implement**: Tiempo promedio para implementar features
- **Coupling metrics**: Afferent/efferent coupling

**Tácticas arquitectónicas**:

- **Low coupling**: Minimizar dependencias entre módulos
- **High cohesion**: Agrupar funcionalidad relacionada
- **Open/Closed Principle**: Abierto a extensión, cerrado a modificación
- **Plugin architecture**: Extensibilidad sin modificar core

**Trade-offs**:

- ✅ Adaptabilidad a cambios de requisitos
- ❌ Complejidad de diseño inicial
- ❌ Posible over-abstraction

---

### 8. Reliability (Confiabilidad)

**Definición**: Probabilidad de que el sistema funcione correctamente durante un período específico bajo condiciones específicas.

**Métricas**:

- **MTBF** (Mean Time Between Failures)
- **Failure rate**: Fallos por unidad de tiempo
- **Error rate**: Porcentaje de operaciones que fallan

**Tácticas arquitectónicas**:

- **Fault tolerance**: Sistema continúa funcionando con fallos parciales
- **Redundancy**: Componentes duplicados
- **Error detection**: Health checks, monitoring
- **Recovery**: Automatic restart, rollback

**Trade-offs**:

- ✅ Confianza del usuario, menos interrupciones
- ❌ Costo de redundancia
- ❌ Complejidad de coordinación

---

### 9. Usability (Usabilidad)

**Definición**: Facilidad con la que los usuarios pueden usar el sistema para lograr sus objetivos.

**Métricas**:

- **Task completion rate**: Porcentaje de tareas completadas exitosamente
- **Time on task**: Tiempo para completar una tarea
- **Error rate**: Errores cometidos por usuarios
- **User satisfaction**: NPS, CSAT scores

**Tácticas arquitectónicas**:

- **Separation of concerns**: UI separada de lógica de negocio
- **API design**: APIs intuitivas y consistentes
- **Error handling**: Mensajes de error claros
- **Responsive design**: Adaptación a diferentes dispositivos

**Trade-offs**:

- ✅ Adopción de usuarios, satisfacción
- ❌ Tiempo de diseño UX
- ❌ Posible complejidad de UI

---

### 10. Portability (Portabilidad)

**Definición**: Facilidad con la que el sistema puede ser transferido de un entorno a otro.

**Dimensiones**:

- **Platform independence**: Windows, Linux, macOS
- **Cloud portability**: AWS, Azure, GCP
- **Database portability**: MySQL, PostgreSQL, Oracle

**Tácticas arquitectónicas**:

- **Containerization**: Docker, Kubernetes
- **Abstraction layers**: ORMs, cloud abstraction libraries
- **Standards compliance**: SQL estándar, REST, etc.
- **Configuration externalization**: 12-factor app

**Trade-offs**:

- ✅ Flexibilidad de deployment, evita vendor lock-in
- ❌ No aprovechar features específicos de plataforma
- ❌ Overhead de abstracción

---

### 11. Interoperability (Interoperabilidad)

**Definición**: Capacidad del sistema para intercambiar información y usar información intercambiada con otros sistemas.

**Tácticas arquitectónicas**:

- **Standard protocols**: HTTP, gRPC, AMQP
- **Standard data formats**: JSON, XML, Protocol Buffers
- **APIs well-defined**: OpenAPI/Swagger specs
- **Event-driven architecture**: Loose coupling

**Trade-offs**:

- ✅ Integración con ecosistema
- ❌ Overhead de transformación de datos
- ❌ Dependencia de estándares externos

---

### 12. Deployability (Desplegabilidad)

**Definición**: Facilidad y frecuencia con la que se pueden desplegar cambios al sistema.

**Métricas**:

- **Deployment frequency**: Deploys por día/semana
- **Lead time**: Tiempo desde commit hasta producción
- **Change failure rate**: Porcentaje de deploys que causan fallos
- **MTTR**: Tiempo para recuperarse de fallo en deploy

**Tácticas arquitectónicas**:

- **CI/CD pipelines**: Automatización de build, test, deploy
- **Blue-green deployment**: Zero-downtime deploys
- **Feature flags**: Deploy sin activar features
- **Microservices**: Deploys independientes

**Trade-offs**:

- ✅ Rápida entrega de valor, feedback rápido
- ❌ Inversión en automatización
- ❌ Riesgo si no hay buenos tests

---

## Implementación práctica

### Herramienta: Quality Attribute Workshop (QAW)

El QAW es una técnica para identificar y priorizar atributos de calidad con stakeholders.

```python
from typing import List, Dict, Tuple
from dataclasses import dataclass
from enum import Enum

class Priority(Enum):
    CRITICAL = 5
    HIGH = 4
    MEDIUM = 3
    LOW = 2
    NICE_TO_HAVE = 1

@dataclass
class QualityAttributeScenario:
    """
    Representa un escenario de atributo de calidad.
    Formato: Estímulo -> Sistema -> Respuesta -> Medición
    """
    id: str
    attribute: str  # Performance, Security, etc.
    stimulus: str  # Qué desencadena el escenario
    environment: str  # Condiciones del sistema
    response: str  # Cómo debe responder el sistema
    measure: str  # Cómo se mide el éxito
    priority: Priority
    stakeholder: str  # Quién lo requiere
    
    def __str__(self) -> str:
        return f"""
Escenario: {self.id}
Atributo: {self.attribute}
Prioridad: {self.priority.name}
Stakeholder: {self.stakeholder}

Estímulo: {self.stimulus}
Entorno: {self.environment}
Respuesta: {self.response}
Medición: {self.measure}
"""

class QualityAttributeWorkshop:
    """
    Facilita la identificación y priorización de atributos de calidad.
    """
    
    def __init__(self, project_name: str):
        self.project_name = project_name
        self.scenarios: List[QualityAttributeScenario] = []
        
    def add_scenario(self, scenario: QualityAttributeScenario):
        """Añade un escenario de calidad."""
        self.scenarios.append(scenario)
        
    def prioritize_scenarios(self) -> List[QualityAttributeScenario]:
        """Retorna escenarios ordenados por prioridad."""
        return sorted(self.scenarios, 
                     key=lambda s: s.priority.value, 
                     reverse=True)
    
    def get_scenarios_by_attribute(self, attribute: str) -> List[QualityAttributeScenario]:
        """Filtra escenarios por atributo de calidad."""
        return [s for s in self.scenarios if s.attribute.lower() == attribute.lower()]
    
    def generate_report(self) -> str:
        """Genera reporte de atributos de calidad priorizados."""
        report = f"# Quality Attribute Workshop: {self.project_name}\n\n"
        report += f"Total de escenarios: {len(self.scenarios)}\n\n"
        
        # Agrupar por prioridad
        by_priority = {}
        for scenario in self.scenarios:
            priority = scenario.priority.name
            if priority not in by_priority:
                by_priority[priority] = []
            by_priority[priority].append(scenario)
        
        # Generar reporte por prioridad
        for priority in [Priority.CRITICAL, Priority.HIGH, Priority.MEDIUM, Priority.LOW, Priority.NICE_TO_HAVE]:
            priority_name = priority.name
            if priority_name in by_priority:
                report += f"## Prioridad: {priority_name}\n\n"
                for scenario in by_priority[priority_name]:
                    report += f"### {scenario.id}: {scenario.attribute}\n"
                    report += f"**Stakeholder**: {scenario.stakeholder}\n\n"
                    report += f"**Estímulo**: {scenario.stimulus}\n\n"
                    report += f"**Respuesta esperada**: {scenario.response}\n\n"
                    report += f"**Medición**: {scenario.measure}\n\n"
                    report += "---\n\n"
        
        return report
    
    def identify_conflicts(self) -> List[Tuple[QualityAttributeScenario, QualityAttributeScenario, str]]:
        """
        Identifica posibles conflictos entre atributos de calidad.
        Retorna lista de tuplas (escenario1, escenario2, razón del conflicto).
        """
        conflicts = []
        
        # Conflictos conocidos
        conflict_pairs = {
            ('performance', 'security'): 'Encryption añade overhead',
            ('performance', 'maintainability'): 'Optimizaciones pueden reducir legibilidad',
            ('availability', 'consistency'): 'CAP theorem',
            ('time-to-market', 'maintainability'): 'Código rápido vs código limpio',
            ('scalability', 'simplicity'): 'Sistemas distribuidos son complejos',
        }
        
        for i, s1 in enumerate(self.scenarios):
            for s2 in self.scenarios[i+1:]:
                key = tuple(sorted([s1.attribute.lower(), s2.attribute.lower()]))
                if key in conflict_pairs:
                    conflicts.append((s1, s2, conflict_pairs[key]))
        
        return conflicts


# Ejemplo de uso
if __name__ == "__main__":
    qaw = QualityAttributeWorkshop("E-commerce Platform")
    
    # Escenario 1: Performance
    qaw.add_scenario(QualityAttributeScenario(
        id="QA-001",
        attribute="Performance",
        stimulus="1000 usuarios concurrentes buscan productos",
        environment="Operación normal, base de datos con 10M productos",
        response="El sistema retorna resultados de búsqueda",
        measure="p95 latency < 200ms",
        priority=Priority.CRITICAL,
        stakeholder="Usuarios finales, Negocio"
    ))
    
    # Escenario 2: Availability
    qaw.add_scenario(QualityAttributeScenario(
        id="QA-002",
        attribute="Availability",
        stimulus="Servidor de base de datos falla",
        environment="Operación normal, tráfico pico",
        response="Sistema continúa funcionando con réplica",
        measure="Uptime 99.9%, MTTR < 5 minutos",
        priority=Priority.CRITICAL,
        stakeholder="Negocio, Operaciones"
    ))
    
    # Escenario 3: Security
    qaw.add_scenario(QualityAttributeScenario(
        id="QA-003",
        attribute="Security",
        stimulus="Atacante intenta SQL injection",
        environment="Cualquier momento",
        response="Sistema rechaza input malicioso y registra intento",
        measure="0 inyecciones exitosas, 100% de intentos loggeados",
        priority=Priority.CRITICAL,
        stakeholder="Seguridad, Legal"
    ))
    
    # Escenario 4: Modifiability
    qaw.add_scenario(QualityAttributeScenario(
        id="QA-004",
        attribute="Modifiability",
        stimulus="Negocio requiere nuevo método de pago",
        environment="Durante desarrollo",
        response="Desarrollador añade nuevo payment provider",
        measure="Implementación < 2 días, sin modificar código existente",
        priority=Priority.HIGH,
        stakeholder="Desarrollo, Negocio"
    ))
    
    # Escenario 5: Testability
    qaw.add_scenario(QualityAttributeScenario(
        id="QA-005",
        attribute="Testability",
        stimulus="Desarrollador implementa nueva feature",
        environment="Durante desarrollo",
        response="Desarrollador escribe tests unitarios e integración",
        measure="Code coverage > 80%, tests ejecutan en < 5 min",
        priority=Priority.HIGH,
        stakeholder="Desarrollo, QA"
    ))
    
    # Generar reporte
    print(qaw.generate_report())
    
    # Identificar conflictos
    print("\n## Posibles conflictos entre atributos de calidad:\n")
    conflicts = qaw.identify_conflicts()
    for s1, s2, reason in conflicts:
        print(f"⚠️  {s1.id} ({s1.attribute}) vs {s2.id} ({s2.attribute})")
        print(f"   Razón: {reason}\n")
```

### Output del ejemplo

```
# Quality Attribute Workshop: E-commerce Platform

Total de escenarios: 5

## Prioridad: CRITICAL

### QA-001: Performance
**Stakeholder**: Usuarios finales, Negocio

**Estímulo**: 1000 usuarios concurrentes buscan productos

**Respuesta esperada**: El sistema retorna resultados de búsqueda

**Medición**: p95 latency < 200ms

---

### QA-002: Availability
**Stakeholder**: Negocio, Operaciones

**Estímulo**: Servidor de base de datos falla

**Respuesta esperada**: Sistema continúa funcionando con réplica

**Medición**: Uptime 99.9%, MTTR < 5 minutos

---

### QA-003: Security
**Stakeholder**: Seguridad, Legal

**Estímulo**: Atacante intenta SQL injection

**Respuesta esperada**: Sistema rechaza input malicioso y registra intento

**Medición**: 0 inyecciones exitosas, 100% de intentos loggeados

---

## Prioridad: HIGH

### QA-004: Modifiability
**Stakeholder**: Desarrollo, Negocio

**Estímulo**: Negocio requiere nuevo método de pago

**Respuesta esperada**: Desarrollador añade nuevo payment provider

**Medición**: Implementación < 2 días, sin modificar código existente

---

### QA-005: Testability
**Stakeholder**: Desarrollo, QA

**Estímulo**: Desarrollador implementa nueva feature

**Respuesta esperada**: Desarrollador escribe tests unitarios e integración

**Medición**: Code coverage > 80%, tests ejecutan en < 5 min

---


## Posibles conflictos entre atributos de calidad:

⚠️  QA-001 (Performance) vs QA-003 (Security)
   Razón: Encryption añade overhead

⚠️  QA-001 (Performance) vs QA-004 (Modifiability)
   Razón: Optimizaciones pueden reducir legibilidad
```

---

## Errores frecuentes

### ❌ Error 1: No priorizar atributos de calidad

```python
# MAL: Intentar maximizar todos los atributos
requirements = {
    'performance': 'máximo',
    'security': 'máximo',
    'maintainability': 'máximo',
    'cost': 'mínimo'
}
```

**Por qué falla**: Es imposible maximizar todo. Terminas con una arquitectura que no satisface ningún atributo bien.

### ✅ Solución correcta: Priorización explícita

```python
# BIEN: Priorización clara
quality_attributes_priority = {
    1: 'Security',      # No negociable
    2: 'Availability',  # 99.9% SLA
    3: 'Performance',   # < 500ms p95
    4: 'Maintainability', # Importante pero no crítico
    5: 'Cost'           # Optimizar después de cumplir 1-4
}

trade_offs_accepted = {
    'Performance vs Security': 'Aceptamos overhead de encryption',
    'Cost vs Availability': 'Aceptamos pagar por redundancia',
    'Time-to-market vs Maintainability': 'Priorizamos features sobre refactoring inicial'
}
```

### ❌ Error 2: Métricas vagas

```markdown
# MAL
Requisito: El sistema debe ser rápido
Requisito: El sistema debe ser seguro
```

**Por qué falla**: No es medible, no es verificable, no guía decisiones arquitectónicas.

### ✅ Solución correcta: Escenarios específicos y medibles

```markdown
# BIEN
Escenario de Performance:
- Estímulo: 5000 usuarios concurrentes hacen checkout
- Entorno: Black Friday, base de datos con 50M productos
- Respuesta: Sistema procesa todas las transacciones
- Medición: p99 latency < 1 segundo, 0 transacciones perdidas

Escenario de Security:
- Estímulo: Atacante intenta acceder a datos de tarjetas de crédito
- Entorno: Cualquier momento
- Respuesta: Sistema bloquea acceso, alerta equipo de seguridad
- Medición: 0 accesos no autorizados, alerta en < 30 segundos
```

### ❌ Error 3: Ignorar trade-offs

Elegir una arquitectura sin documentar qué se sacrifica.

### ✅ Solución correcta: Documentar trade-offs explícitamente

```markdown
# Decisión: Arquitectura de Microservicios

## Trade-offs aceptados:
- ✅ Ganamos: Escalabilidad independiente, deploys autónomos
- ❌ Sacrificamos: Simplicidad, transacciones ACID, latencia de red
- ⚠️  Riesgo: Complejidad operacional puede exceder capacidad del equipo

## Condiciones para revisión:
- Si el equipo de ops no puede manejar 20+ servicios
- Si latencia entre servicios excede 100ms
- Si costo de infra supera presupuesto en 50%
```

---

## Aplicaciones reales

### Caso 1: Amazon - Priorización de Availability

**Contexto**: E-commerce global, cada minuto de downtime cuesta millones.

**Priorización de atributos**:

1. **Availability** (99.99%+)
2. **Performance** (< 100ms p50)
3. **Scalability** (Black Friday, Prime Day)
4. Maintainability
5. Consistency (eventual consistency es aceptable)

**Decisiones arquitectónicas resultantes**:

- **Microservicios**: Fallas aisladas
- **Multi-region deployment**: Redundancia geográfica
- **DynamoDB**: Availability sobre consistency (AP en CAP)
- **Circuit breakers**: Degradación graceful

**Trade-off crítico**: Sacrificaron consistencia fuerte por disponibilidad. Usuarios pueden ver datos ligeramente desactualizados, pero el sitio nunca se cae.

### Caso 2: Stripe - Priorización de Security y Reliability

**Contexto**: Procesamiento de pagos, maneja billones de dólares.

**Priorización de atributos**:

1. **Security** (PCI-DSS compliance)
2. **Reliability** (99.99%+ uptime)
3. **Correctness** (0 transacciones perdidas/duplicadas)
4. Performance
5. Time-to-market

**Decisiones arquitectónicas resultantes**:

- **Idempotency keys**: Prevenir transacciones duplicadas
- **Encryption everywhere**: At rest, in transit, in memory
- **Extensive auditing**: Cada acción loggeada
- **Formal verification**: Pruebas matemáticas de correctness

**Trade-off crítico**: Sacrificaron velocidad de desarrollo por seguridad y correctness. Features tardan más en salir, pero cuando salen, son rock-solid.

---

## Resumen del concepto

**En una frase**: Los atributos de calidad son las características medibles que determinan el éxito de un sistema, y la arquitectura es el medio para lograrlos mediante trade-offs conscientes.

**Cuándo importa**: Siempre. Toda decisión arquitectónica debe estar justificada por atributos de calidad.

**Cómo usarlo**:

1. Identificar atributos de calidad con stakeholders (QAW)
2. Priorizarlos explícitamente (no todo puede ser #1)
3. Definir escenarios medibles para cada atributo
4. Tomar decisiones arquitectónicas que optimicen para los atributos prioritarios
5. Documentar trade-offs aceptados

**Prerequisito crítico**: Entender qué es la arquitectura de software (Tema 1.1).

**Siguiente paso**: En el Tema 1.3 exploraremos la **Ley de Conway**, que explica cómo la estructura organizacional influye en la arquitectura del sistema.

---

**Ejercicio de autoevaluación**:

1. ¿Puedes definir 3 escenarios de calidad medibles para un sistema que conozcas?
2. ¿Puedes identificar al menos 2 trade-offs en la arquitectura de ese sistema?
3. ¿Puedes priorizar los atributos de calidad de 1 a 5 para ese sistema?

Si respondiste sí a las 3, dominas este tema. Si no, revisa la sección de "Implementación práctica" y ejecuta el código del Quality Attribute Workshop.
