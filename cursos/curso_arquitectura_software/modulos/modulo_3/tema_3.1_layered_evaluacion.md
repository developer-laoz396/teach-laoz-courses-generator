# EVALUACIÓN: TEMA 3.1 (LAYERED ARCHITECTURE)

## FICHA TÉCNICA

- **Tema**: Patrones Monolíticos
- **Nivel**: Intermedio

---

## CUESTIONARIO

### Pregunta 1

¿Cuál es la responsabilidad principal de la capa de **Lógica de Negocio** (Domain)?
a) Mostrar los datos al usuario en HTML.
b) Ejecutar reglas empresariales, cálculos y validaciones (ej: calcular impuestos).
c) Ejecutar consultas SQL directas contra la base de datos.

### Pregunta 2

¿Qué problema describe el anti-patrón "Architecture Sinkhole"?
a) Cuando la base de datos se llena.
b) Cuando las peticiones atraviesan múltiples capas sin que ninguna aporte valor añadido (solo pass-through code).
c) Cuando hay agujeros de seguridad.

### Pregunta 3

En un modelo de "Capas Estrictas" (Strict Layering), la capa de Presentación puede llamar a:
a) Solo a la capa de Negocio (la inmediatamente inferior).
b) A la capa de Negocio y a la de Persistencia.
c) Directamente a la Base de Datos.

### Pregunta 4

Si cambias tu motor de base de datos de Oracle a PostgreSQL, ¿qué capas deberían verse afectadas idealmente?
a) Todas (Presentación, Negocio y Persistencia).
b) Solo la capa de Persistencia (y Configuración).
c) Solo la capa de Presentación.

---

## SOLUCIONARIO

1. **b)**. Es el cerebro de la aplicación.
2. **b)**. Overhead innecesario.
3. **a)**. Mantiene el desacoplamiento máximo.
4. **b)**. Gracias al aislamiento de capas.
