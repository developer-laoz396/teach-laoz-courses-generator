# Tema 1.1: ¿Qué es realmente la arquitectura de software?

**Tiempo estimado**: 45 minutos  
**Nivel**: Básico  
**Prerrequisitos**: Módulo 0 - Preconceptos Fundamentales

## ¿Por qué importa este concepto?

La arquitectura de software es una de las disciplinas más críticas y menos comprendidas en la ingeniería de software moderna. Muchos desarrolladores confunden arquitectura con "dibujar cajas y flechas" o con "elegir un framework". Sin embargo, la arquitectura es mucho más profunda: es el arte y la ciencia de tomar decisiones estructurales que determinarán el éxito o fracaso de un sistema durante toda su vida útil.

Entender qué es realmente la arquitectura te permitirá:

- **Tomar decisiones informadas** sobre tecnologías, patrones y estructuras
- **Comunicar efectivamente** con stakeholders técnicos y de negocio
- **Anticipar problemas** antes de que se conviertan en crisis costosas
- **Diseñar sistemas** que puedan evolucionar con el tiempo sin colapsar

En la industria, la diferencia entre un sistema exitoso y uno que se convierte en "legacy code" a los 6 meses suele estar en la calidad de sus decisiones arquitectónicas iniciales. Empresas como Netflix, Amazon y Google invierten millones en arquitectura porque saben que es el multiplicador de fuerza que permite escalar tanto técnica como organizacionalmente.

## Conexión con conocimientos previos

En el Módulo 0 aprendiste la diferencia entre arquitectura y diseño. Ahora profundizaremos en qué significa realmente "hacer arquitectura", cuál es el alcance del rol del arquitecto, y cómo la arquitectura impacta todos los aspectos de un sistema de software. También aplicaremos conceptos como trade-offs, stakeholders y atributos de calidad en el contexto arquitectónico.

---

## Comprensión intuitiva

### La metáfora del edificio (y por qué es limitada)

Tradicionalmente, la arquitectura de software se compara con la arquitectura de edificios. Un arquitecto de edificios diseña la estructura, decide dónde van las columnas, cómo se distribuyen las habitaciones, qué materiales usar. De manera similar, un arquitecto de software decide la estructura del sistema, cómo se organizan los componentes, qué tecnologías usar.

**Pero aquí está la diferencia crucial**: Los edificios, una vez construidos, raramente cambian su estructura fundamental. El software, por otro lado, está en constante evolución. Es como si tu casa tuviera que crecer de 2 habitaciones a 200, cambiar de madera a acero mientras la gente vive en ella, y todo sin que nadie note la transición.

### ¿Qué es entonces la arquitectura de software?

**Arquitectura de software** es el conjunto de decisiones estructurales significativas sobre:

1. **Organización del sistema**: Cómo se divide el sistema en componentes y cómo se relacionan
2. **Tecnologías fundamentales**: Frameworks, lenguajes, bases de datos, infraestructura
3. **Patrones y estilos**: Microservicios, monolito, event-driven, etc.
4. **Interfaces y contratos**: Cómo se comunican las partes del sistema
5. **Atributos de calidad**: Cómo se logra rendimiento, seguridad, escalabilidad, etc.

**Lo que hace que una decisión sea "arquitectónica"** es que:

- Es **difícil de cambiar** después (alto costo de reversión)
- Tiene **impacto amplio** en el sistema
- Afecta **atributos de calidad** críticos
- Requiere **coordinación** entre múltiples equipos

### Ejemplo motivador

Imagina que estás construyendo una plataforma de e-commerce. Algunas decisiones son arquitectónicas, otras no:

**Decisiones arquitectónicas** (difíciles de cambiar, impacto amplio):

- ¿Monolito o microservicios?
- ¿Base de datos SQL o NoSQL?
- ¿Comunicación síncrona (REST) o asíncrona (eventos)?
- ¿Dónde vive la lógica de negocio: frontend, backend, o ambos?

**Decisiones de diseño** (más fáciles de cambiar, impacto local):

- ¿Qué librería usar para validación de formularios?
- ¿Cómo nombrar las clases del módulo de pagos?
- ¿Qué algoritmo de ordenamiento usar en el carrito?

Si eliges microservicios y después de 6 meses te das cuenta que era mejor un monolito, el costo de cambio es enorme (meses de trabajo, riesgo alto). Si eliges una librería de validación y no te gusta, la cambias en días.

---

## Definición formal

### Definición según IEEE 1471-2000

> "La arquitectura de software es la organización fundamental de un sistema, representada por sus componentes, las relaciones entre ellos y con el entorno, y los principios que gobiernan su diseño y evolución."

### Definición según Bass, Clements y Kazman (Software Architecture in Practice)

> "La arquitectura de software de un sistema es el conjunto de estructuras necesarias para razonar sobre el sistema, que comprende elementos de software, relaciones entre ellos, y propiedades de ambos."

### Definición operacional (la que usaremos)

**Arquitectura de software** = **Decisiones estructurales** + **Justificación de trade-offs** + **Documentación de contexto**

Donde:

- **Decisiones estructurales**: Elecciones sobre componentes, tecnologías, patrones
- **Justificación de trade-offs**: Por qué elegiste X sobre Y, qué sacrificaste
- **Documentación de contexto**: Restricciones, suposiciones, stakeholders, atributos de calidad prioritarios

---

## Propiedades fundamentales de la arquitectura

### 1. La arquitectura es una abstracción

No incluye todos los detalles del sistema, solo los estructuralmente significativos. Es como un mapa: no muestra cada árbol, pero sí las carreteras principales.

### 2. La arquitectura encapsula decisiones tempranas

Las decisiones arquitectónicas se toman cuando hay más incertidumbre y menos información. Por eso es crítico documentar el **contexto** de cada decisión.

### 3. La arquitectura define restricciones

Una vez que eliges una arquitectura, ciertas cosas se vuelven fáciles y otras difíciles. Elegir una arquitectura es elegir qué será fácil y qué será difícil en el futuro.

**Ejemplo**: Si eliges una arquitectura serverless, escalar es trivial, pero debugging y testing local se vuelven complejos.

### 4. La arquitectura influye en la estructura organizacional (Ley de Conway)

> "Las organizaciones que diseñan sistemas están constreñidas a producir diseños que son copias de las estructuras de comunicación de dichas organizaciones."  
> — Melvin Conway, 1967

Si tienes 3 equipos, probablemente terminarás con 3 componentes principales. La arquitectura y la organización se influyen mutuamente.

### 5. La arquitectura es el vehículo para comunicación con stakeholders

Diferentes stakeholders ven diferentes "vistas" de la arquitectura:

- **Desarrolladores**: Módulos, dependencias, APIs
- **Operadores**: Deployment, infraestructura, monitoreo
- **Gerentes**: Costos, tiempos, riesgos
- **Usuarios**: Rendimiento, disponibilidad, seguridad

---

## Implementación práctica

### Ejercicio: Identificar decisiones arquitectónicas

Analicemos un caso real: **Twitter** en sus primeros años.

#### Contexto inicial (2006-2008)

- **Stakeholders**: Usuarios (quieren rapidez), Negocio (crecimiento viral), Ops (estabilidad)
- **Atributos de calidad prioritarios**: Disponibilidad > Rendimiento > Consistencia
- **Restricciones**: Equipo pequeño, presupuesto limitado

#### Decisiones arquitectónicas tomadas

**Decisión 1: Monolito Ruby on Rails**

- **Justificación**: Velocidad de desarrollo, equipo pequeño familiarizado con Rails
- **Trade-off**: Sacrificaron escalabilidad futura por time-to-market
- **Consecuencia**: Funcionó hasta ~2008, luego tuvieron que reescribir partes críticas

**Decisión 2: MySQL como base de datos principal**

- **Justificación**: Familiaridad, ecosistema maduro, transacciones ACID
- **Trade-off**: Sacrificaron escalabilidad horizontal por consistencia
- **Consecuencia**: Tuvieron que implementar sharding manual más adelante

**Decisión 3: Caché agresivo con Memcached**

- **Justificación**: Reducir carga en BD, mejorar tiempos de respuesta
- **Trade-off**: Sacrificaron consistencia inmediata por rendimiento
- **Consecuencia**: Usuarios veían datos ligeramente desactualizados, pero el sistema sobrevivió

#### Evolución arquitectónica (2010-2015)

**Decisión 4: Migración a arquitectura de servicios**

- **Justificación**: Monolito no escalaba, equipos creciendo
- **Trade-off**: Sacrificaron simplicidad por escalabilidad y autonomía de equipos
- **Consecuencia**: Pudieron escalar a cientos de millones de usuarios

**Decisión 5: Adopción de Cassandra para timeline**

- **Justificación**: Necesitaban escalabilidad horizontal masiva
- **Trade-off**: Sacrificaron consistencia fuerte por disponibilidad (CAP theorem)
- **Consecuencia**: Sistema más resiliente pero con complejidad operacional

### Código: Documentando decisiones arquitectónicas (ADR)

Un **Architecture Decision Record (ADR)** es un documento que captura una decisión arquitectónica importante.

```markdown
# ADR-001: Adopción de Arquitectura de Microservicios

## Estado
Aceptado

## Contexto
Nuestro monolito actual tiene 500K líneas de código y 15 equipos trabajando en él.
Problemas observados:
- Deployments toman 2 horas y requieren coordinación de todos los equipos
- Un bug en el módulo de pagos puede tumbar todo el sistema
- Tiempo de onboarding de nuevos desarrolladores: 3-4 semanas
- Escalabilidad: no podemos escalar módulos independientemente

Atributos de calidad prioritarios:
1. Disponibilidad (99.9% SLA)
2. Time-to-market (deploys independientes)
3. Escalabilidad (módulos específicos)

## Decisión
Migraremos a una arquitectura de microservicios con las siguientes características:
- Servicios organizados por bounded contexts (DDD)
- Comunicación asíncrona vía RabbitMQ para eventos
- API Gateway para clientes externos
- Service mesh (Istio) para comunicación interna
- Base de datos por servicio (polyglot persistence)

## Consecuencias

### Positivas
- Equipos pueden deployar independientemente
- Fallas aisladas (circuit breakers)
- Escalabilidad granular
- Tecnologías heterogéneas (elegir la mejor herramienta por servicio)

### Negativas
- Complejidad operacional (monitoreo distribuido, tracing)
- Transacciones distribuidas (eventual consistency)
- Latencia de red entre servicios
- Debugging más complejo
- Costo de infraestructura inicial más alto

### Riesgos
- Sobre-fragmentación (demasiados microservicios pequeños)
- Acoplamiento temporal (servicios dependientes de disponibilidad de otros)
- Consistencia de datos (necesitamos sagas o event sourcing)

## Alternativas consideradas

### Alternativa 1: Monolito modular
**Pros**: Menor complejidad, transacciones simples
**Contras**: No resuelve el problema de deployments ni escalabilidad
**Razón de rechazo**: No cumple con atributos de calidad prioritarios

### Alternativa 2: Service-based architecture (servicios más grandes)
**Pros**: Balance entre monolito y microservicios
**Contras**: Sigue requiriendo coordinación entre equipos
**Razón de rechazo**: No da suficiente autonomía a equipos

## Notas
- Migración será gradual (strangler pattern)
- Empezaremos con servicio de notificaciones (bajo riesgo)
- Revisaremos esta decisión en 6 meses

## Referencias
- Building Microservices (Sam Newman)
- Microservices Patterns (Chris Richardson)
- Experiencia de Netflix, Uber, Amazon
```

### Herramienta: Generador de ADR en Python

```python
from datetime import datetime
from typing import List, Dict
import os

class ADRGenerator:
    """
    Generador de Architecture Decision Records siguiendo el formato estándar.
    """
    
    def __init__(self, adr_directory: str = "./docs/adr"):
        self.adr_directory = adr_directory
        os.makedirs(adr_directory, exist_ok=True)
        
    def create_adr(self,
                   title: str,
                   context: str,
                   decision: str,
                   consequences: Dict[str, List[str]],
                   alternatives: List[Dict[str, str]] = None,
                   status: str = "Propuesto") -> str:
        """
        Crea un nuevo ADR.
        
        Args:
            title: Título de la decisión
            context: Contexto y problema que motiva la decisión
            decision: La decisión tomada
            consequences: Dict con keys 'positivas', 'negativas', 'riesgos'
            alternatives: Lista de alternativas consideradas
            status: Estado (Propuesto, Aceptado, Rechazado, Deprecado)
            
        Returns:
            Path del archivo ADR generado
        """
        # Obtener número de ADR
        adr_number = self._get_next_adr_number()
        
        # Generar contenido
        content = self._generate_adr_content(
            adr_number, title, context, decision, 
            consequences, alternatives, status
        )
        
        # Guardar archivo
        filename = f"ADR-{adr_number:03d}-{self._slugify(title)}.md"
        filepath = os.path.join(self.adr_directory, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
        return filepath
    
    def _get_next_adr_number(self) -> int:
        """Obtiene el siguiente número de ADR disponible."""
        existing_adrs = [f for f in os.listdir(self.adr_directory) 
                        if f.startswith('ADR-') and f.endswith('.md')]
        
        if not existing_adrs:
            return 1
            
        numbers = [int(f.split('-')[1]) for f in existing_adrs]
        return max(numbers) + 1
    
    def _slugify(self, text: str) -> str:
        """Convierte texto a formato slug."""
        return text.lower().replace(' ', '-').replace('/', '-')
    
    def _generate_adr_content(self, number: int, title: str, context: str,
                             decision: str, consequences: Dict[str, List[str]],
                             alternatives: List[Dict[str, str]], 
                             status: str) -> str:
        """Genera el contenido markdown del ADR."""
        
        content = f"""# ADR-{number:03d}: {title}

## Estado
{status}

## Fecha
{datetime.now().strftime('%Y-%m-%d')}

## Contexto
{context}

## Decisión
{decision}

## Consecuencias

### Positivas
{self._format_list(consequences.get('positivas', []))}

### Negativas
{self._format_list(consequences.get('negativas', []))}

### Riesgos
{self._format_list(consequences.get('riesgos', []))}
"""
        
        if alternatives:
            content += "\n## Alternativas consideradas\n\n"
            for i, alt in enumerate(alternatives, 1):
                content += f"""### Alternativa {i}: {alt['nombre']}
**Pros**: {alt.get('pros', 'N/A')}
**Contras**: {alt.get('contras', 'N/A')}
**Razón de rechazo**: {alt.get('razon_rechazo', 'N/A')}

"""
        
        content += """## Notas
[Agregar notas adicionales aquí]

## Referencias
[Agregar referencias aquí]
"""
        return content
    
    def _format_list(self, items: List[str]) -> str:
        """Formatea una lista de items como bullets markdown."""
        if not items:
            return "- N/A"
        return '\n'.join(f"- {item}" for item in items)


# Ejemplo de uso
if __name__ == "__main__":
    generator = ADRGenerator()
    
    adr_path = generator.create_adr(
        title="Adopción de PostgreSQL como base de datos principal",
        context="""
Necesitamos elegir una base de datos para nuestra aplicación de gestión de inventario.
Requisitos:
- Transacciones ACID
- Soporte para consultas complejas (joins, agregaciones)
- Escalabilidad hasta 10M de registros
- Presupuesto limitado (preferencia por open source)
        """,
        decision="""
Adoptaremos PostgreSQL 14 como nuestra base de datos principal.
Configuración:
- Replicación master-slave para alta disponibilidad
- Particionamiento por fecha para tablas de auditoría
- Índices BRIN para series temporales
        """,
        consequences={
            'positivas': [
                "ACID completo garantiza consistencia de datos",
                "Excelente soporte para JSON (flexibilidad)",
                "Comunidad activa y documentación extensa",
                "Sin costos de licenciamiento"
            ],
            'negativas': [
                "Escalabilidad horizontal limitada (comparado con NoSQL)",
                "Requiere tuning manual para alto rendimiento",
                "Backups pueden ser lentos en bases grandes"
            ],
            'riesgos': [
                "Equipo tiene más experiencia con MySQL",
                "Migraciones futuras a cloud pueden requerir adaptación"
            ]
        },
        alternatives=[
            {
                'nombre': 'MySQL',
                'pros': 'Equipo familiarizado, amplio ecosistema',
                'contras': 'Menos features avanzados, JSON support limitado',
                'razon_rechazo': 'PostgreSQL ofrece mejor soporte para nuestros casos de uso'
            },
            {
                'nombre': 'MongoDB',
                'pros': 'Escalabilidad horizontal, schema flexible',
                'contras': 'No ACID completo, consultas complejas difíciles',
                'razon_rechazo': 'Necesitamos transacciones ACID para inventario'
            }
        ],
        status="Aceptado"
    )
    
    print(f"✓ ADR creado: {adr_path}")
```

### Casos de prueba

```python
import tempfile
import shutil
import os

def test_adr_generator():
    """Test básico del generador de ADR."""
    # Crear directorio temporal
    temp_dir = tempfile.mkdtemp()
    
    try:
        generator = ADRGenerator(temp_dir)
        
        # Test 1: Crear primer ADR
        path1 = generator.create_adr(
            title="Test Decision",
            context="Test context",
            decision="Test decision",
            consequences={'positivas': ['Pro 1'], 'negativas': ['Con 1'], 'riesgos': []}
        )
        
        assert os.path.exists(path1), "ADR file should exist"
        assert "ADR-001" in path1, "First ADR should be numbered 001"
        
        # Test 2: Crear segundo ADR (numeración secuencial)
        path2 = generator.create_adr(
            title="Another Decision",
            context="Context 2",
            decision="Decision 2",
            consequences={'positivas': [], 'negativas': [], 'riesgos': ['Risk 1']}
        )
        
        assert "ADR-002" in path2, "Second ADR should be numbered 002"
        
        # Test 3: Verificar contenido
        with open(path1, 'r', encoding='utf-8') as f:
            content = f.read()
            assert "# ADR-001: Test Decision" in content
            assert "## Estado" in content
            assert "## Consecuencias" in content
        
        print("✓ Todos los tests pasaron")
        
    finally:
        # Limpiar
        shutil.rmtree(temp_dir)

test_adr_generator()
```

---

## Variantes y enfoques

### Enfoque 1: Architecture Decision Records (ADR)

**Cuándo usar**: Proyectos medianos a grandes, equipos distribuidos, necesidad de trazabilidad

**Ventajas**:

- Documentación versionada junto al código
- Contexto histórico preservado
- Facilita onboarding de nuevos miembros

**Desventajas**:

- Requiere disciplina para mantener actualizado
- Puede volverse burocrático en equipos pequeños

### Enfoque 2: Architecture Haiku (Lightweight ADR)

Para equipos ágiles que necesitan documentar rápido:

```markdown
# Decisión: [Título]
**Por qué**: [1 párrafo de contexto]
**Qué**: [1 párrafo de decisión]
**Trade-offs**: [Lista de 3-5 bullets]
```

### Enfoque 3: C4 Model (Visualización de arquitectura)

Complementa ADRs con diagramas en 4 niveles:

1. **Context**: Sistema y sus usuarios/sistemas externos
2. **Containers**: Aplicaciones y data stores de alto nivel
3. **Components**: Componentes dentro de cada container
4. **Code**: Clases y detalles de implementación (opcional)

---

## Errores frecuentes

### ❌ Error 1: Confundir arquitectura con tecnología

```markdown
# MAL: ADR centrado en tecnología
Decisión: Usaremos React para el frontend

Contexto: React es popular y tiene muchas librerías
```

**Por qué falla**: No explica el problema que resuelve, ni los trade-offs, ni las alternativas.

### ✅ Solución correcta

```markdown
# BIEN: ADR centrado en atributos de calidad

Decisión: Adoptaremos arquitectura SPA con React

Contexto:
- Necesitamos UX fluida sin recargas de página
- Equipo tiene experiencia en JavaScript
- Prioridad: Time-to-market > SEO

Trade-offs:
- ✅ UX fluida, estado del cliente rico
- ❌ SEO más complejo (requiere SSR o pre-rendering)
- ❌ Bundle size inicial más grande

Alternativas consideradas:
- Server-side rendering tradicional: Rechazado (UX no cumple requisitos)
- Vue.js: Rechazado (equipo no familiarizado, ecosistema más pequeño)
- Svelte: Rechazado (ecosistema inmaduro para nuestras necesidades)
```

### ❌ Error 2: Arquitectura Big Design Up Front (BDUF)

Intentar diseñar toda la arquitectura perfecta antes de escribir código.

**Por qué falla**:

- Requisitos cambian
- No puedes predecir todos los problemas
- Paralysis by analysis

### ✅ Solución correcta: Arquitectura evolutiva

1. Diseña lo mínimo necesario para empezar
2. Identifica "puntos de inflexión" (ej: "cuando tengamos 100K usuarios...")
3. Documenta suposiciones y triggers para revisión
4. Refactoriza arquitectura cuando los triggers se activen

### ❌ Error 3: No documentar el contexto

```markdown
# MAL
Decisión: Usaremos microservicios
```

**Por qué falla**: En 6 meses nadie recordará por qué se tomó esa decisión.

### ✅ Solución correcta

```markdown
# BIEN
Decisión: Usaremos microservicios

Contexto (Enero 2024):
- Equipo: 30 desarrolladores en 5 equipos
- Monolito actual: 300K LOC, deploys semanales coordinados
- Problema: Equipos bloqueados esperando deploys de otros
- SLA requerido: 99.9% (downtime de monolito afecta todo)
- Presupuesto: $50K/mes en infra (podemos aumentar a $100K)

Suposiciones:
- Equipos crecerán a 50+ desarrolladores en 12 meses
- Tráfico crecerá 10x en 18 meses
- No todos los servicios necesitan escalar igual

Triggers para revisión:
- Si equipos no crecen según lo planeado
- Si complejidad operacional excede capacidad del equipo
- Si costos de infra superan $150K/mes
```

---

## Aplicaciones reales

### Caso 1: Netflix - Arquitectura de microservicios

**Contexto**:

- 200M+ usuarios globales
- 15K microservicios
- Millones de requests por segundo

**Decisiones arquitectónicas clave**:

1. **Microservicios + API Gateway (Zuul)**
   - Trade-off: Complejidad operacional vs escalabilidad y resiliencia
2. **Chaos Engineering (Chaos Monkey)**
   - Trade-off: Estabilidad a corto plazo vs resiliencia a largo plazo
3. **Eventual consistency**
   - Trade-off: Consistencia inmediata vs disponibilidad

**Escala**:

- 1M+ requests/segundo en picos
- 99.99% disponibilidad
- Deploys: cientos por día

### Caso 2: Stack Overflow - Monolito bien hecho

**Contexto**:

- 100M+ usuarios mensuales
- 1.5B+ page views/mes
- Equipo pequeño (~25 developers)

**Decisión arquitectónica**: Mantener monolito .NET

**Justificación**:

- Equipo pequeño (complejidad operacional de microservicios no justificada)
- Rendimiento excelente con optimización vertical
- Menor overhead de red

**Resultado**:

- 9 servidores web manejan todo el tráfico
- Latencia promedio: 18ms
- Costo de infraestructura muy bajo

**Lección**: No siempre microservicios es la respuesta. Contexto importa.

---

## ¿Cuándo usar cada enfoque?

| Criterio | Monolito | Microservicios | Serverless |
|----------|----------|----------------|------------|
| Tamaño de equipo | < 10 devs | > 20 devs | Variable |
| Complejidad de dominio | Baja-Media | Alta | Baja-Media |
| Necesidad de escala independiente | No | Sí | Sí |
| Presupuesto de infra | Bajo | Alto | Variable (pay-per-use) |
| Experiencia en sistemas distribuidos | No requerida | Crítica | Media |
| Time-to-market | Rápido | Lento (inicial) | Muy rápido |

**Regla de decisión**:

1. **Empieza con monolito** si: Equipo pequeño, dominio simple, MVP
2. **Considera microservicios** si: Equipos grandes, dominio complejo, necesidad de escala diferenciada
3. **Considera serverless** si: Cargas de trabajo intermitentes, quieres minimizar ops

---

## Para ir más allá

### Papers fundamentales

1. **Kruchten, P. (1995)** - "The 4+1 View Model of Architecture"  
   *Por qué es relevante*: Define cómo documentar arquitectura desde múltiples perspectivas

2. **Fielding, R. (2000)** - "Architectural Styles and the Design of Network-based Software Architectures" (Tesis doctoral que define REST)  
   *Por qué es relevante*: Fundamento teórico de arquitecturas web modernas

3. **Conway, M. (1968)** - "How Do Committees Invent?"  
   *Por qué es relevante*: Ley de Conway - relación entre arquitectura y organización

### Libros esenciales

- **"Software Architecture in Practice" (3rd Ed.)** - Bass, Clements, Kazman  
  El libro definitivo sobre arquitectura de software

- **"Fundamentals of Software Architecture"** - Richards, Ford  
  Guía moderna y práctica para arquitectos

- **"Building Evolutionary Architectures"** - Ford, Parsons, Kua  
  Cómo diseñar sistemas que puedan evolucionar

### Recursos online

- **Martin Fowler's Blog**: martinfowler.com/architecture  
- **The Architecture of Open Source Applications**: aosabook.org  
- **InfoQ Architecture & Design**: infoq.com/architecture-design

---

## Resumen del concepto

**En una frase**: La arquitectura de software es el conjunto de decisiones estructurales significativas que determinan cómo un sistema cumplirá sus atributos de calidad, junto con la justificación de por qué se tomaron esas decisiones.

**Cuándo importa**: Siempre, pero especialmente cuando:

- El sistema vivirá más de 6 meses
- Múltiples equipos trabajarán en él
- Los atributos de calidad son críticos (rendimiento, seguridad, escalabilidad)
- El costo de falla es alto

**Prerequisito crítico**: Entender la diferencia entre arquitectura y diseño, y conocer los atributos de calidad del software.

**Siguiente paso**: En el Tema 1.2 profundizaremos en los **Atributos de Calidad (-ilities)**, que son los drivers principales de las decisiones arquitectónicas.

---

**Ejercicio de autoevaluación**:

1. ¿Puedes explicar por qué "elegir React" no es una decisión arquitectónica completa?
2. ¿Puedes identificar 3 decisiones arquitectónicas en un proyecto en el que hayas trabajado?
3. ¿Puedes escribir un ADR simple para una decisión técnica que hayas tomado recientemente?

Si respondiste sí a las 3, estás listo para continuar. Si no, revisa las secciones de "Definición formal" y "Implementación práctica".
