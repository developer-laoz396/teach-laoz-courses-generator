# TEMA 3.1: LAYERED ARCHITECTURE (CAPAS)

**Tiempo estimado**: 45 minutos
**Nivel**: Intermedio
**Prerrequisitos**: Módulo 2

## 1. El Estándar de Facto

Es la arquitectura más común. Todo el mundo la conoce.
Se organiza en capas horizontales, donde cada capa tiene un rol específico.

## 2. Las Capas Clásicas

1. **Presentation (UI)**: Maneja HTML, JSON, CLI. No tiene lógica de negocio.
2. **Business Logic (Domain)**: Toma decisiones. Calcula impuestos, valida reglas.
3. **Persistence (Data Access)**: SQL, ORMs. Sabe cómo guardar cosas.
4. **Database**: El almacenamiento físico.

## 3. Reglas de Oro

* **Separation of Concerns**: La UI no debe hacer consultas SQL. La BD no debe renderizar HTML.
* **Layers of Isolation**: Una capa solo puede llamar a la capa inmediatamente inferior (Strict) o a cualquiera inferior (Relaxed).
  * Esto permite cambiar la BD sin tocar la UI.

## 4. Anti-Patrón: Architecture Sinkhole

Cuando las peticiones pasan por las capas sin hacer nada.
UI -> Business (Pass-through) -> Persistence (Pass-through) -> DB.
El 80% de tu código son funciones que solo llaman a otra función.
Si tienes mucho de esto, quizás Layered no es para ti.

---

## Resumen

Ideal para equipos nuevos, aplicaciones simples y prototipos.
Malo para despliegues rápidos (hay que compilar todo el monolito) y escalabilidad granular.
