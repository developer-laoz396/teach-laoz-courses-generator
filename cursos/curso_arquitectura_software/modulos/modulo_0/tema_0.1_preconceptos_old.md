# TEMA 0.1: PRECONCEPTOS (GLOSARIO DE NIVELACIÓN)

## OBJETIVO

Antes de diseñar sistemas, debemos hablar el mismo idioma. Aquí definimos los términos que causan más confusión en las entrevistas y en la práctica.

---

## 1. El Concepto Rey: TRADE-OFF (Compromiso)

**Definición**: En arquitectura de software, **no hay soluciones perfectas, solo compromisos**.

* Si quieres más velocidad, quizás pierdas consistencia.
* Si quieres más seguridad, quizás sacrifiques usabilidad.
* **Regla de Oro**: Si un arquitecto te dice que una solución es "perfecta" y no tiene desventajas, está vendiendo humo.

## 2. Latencia vs Throughput

* **Latencia**: El tiempo que tarda un solo paquete en ir del punto A al punto B. (Ej: "La página tardó 200ms en cargar").
  * *Analogía*: La velocidad de un Ferrari en la autopista.
* **Throughput (Caudal)**: Cuántos paquetes pueden pasar por el sistema en un tiempo dado. (Ej: "El servidor aguanta 10,000 peticiones por segundo").
  * *Analogía*: El ancho de la autopista (cuántos coches caben).

## 3. Escalabilidad vs Elasticidad

* **Escalabilidad**: La capacidad de un sistema para manejar más carga agregando recursos ( Vertical u Horizontal).
* **Elasticidad**: La capacidad de agregar Y QUITAR recursos automáticamente según la demanda (Cloud).

## 4. Monolito vs Microservicios

* **Monolito**: Una sola unidad de despliegue. Todo el código en un solo binario/WAR/Jar.
  * *Ventaja*: Simple de desarrollar, testear y desplegar al inicio.
* **Microservicios**: Pequeños servicios independientes que se comunican por red.
  * *Ventaja*: Despliegue independiente, escala granular.
  * *Desventaja*: Complejidad operacional infernal.

## 5. ACID vs BASE

* **ACID (SQL)**: Atomicidad, Consistencia, Aislamiento, Durabilidad. Garantiza que los datos siempre esten correctos, a costa de disponibilidad.
* **BASE (NoSQL)**: Basically Available, Soft state, Eventual consistency. Garantiza disponibilidad, a costa de que los datos pueden estar desactualizados unos milisegundos.
