# Plan Curricular: React para Ingenieros de Front (Nivel Avanzado)

## Información General

- **Tema**: React Avanzado y Patrones de Arquitectura
- **Complejidad**: Alta
- **Audiencia**: Ingenieros Frontend Intermedios (2+ años exp)
- **Duración Estimada**: 25 Horas

## Mapa de Módulos

### Módulo 0: Fundamentos Sólidos y Nivelación

*Objetivo: Asegurar base común en JS moderno y ciclo de vida básico.*

- **Tema 0.1**: JavaScript Moderno para React (Deep dive en Closures, 'this', Event Loop).
- **Tema 0.2**: TypeScript Esencial en React (Generics en componentes, Utility Types, Inferencias).
- **Tema 0.3**: Arquitectura Interna de React (Repaso conceptual de Virtual DOM vs Real DOM).

### Módulo 1: Deep Dive en Rendering y Reconciliación

*Objetivo: Comprender cómo React actualiza la UI bajo el capó para optimizar renders.*

- **Tema 1.1**: Fase de Render vs Fase de Commit.
- **Tema 1.2**: El Algoritmo de Reconciliación (Diffing algorithm, Keys importance).
- **Tema 1.3**: React Fiber Architecture (Units of work, Prioritización básica).

### Módulo 2: Gestión de Estado Avanzada

*Objetivo: Escalar el estado de la aplicación sin prop-drilling ni re-renders innecesarios.*

- **Tema 2.1**: Context Context API: Patrones de optimización (Split Context).
- **Tema 2.2**: State Machines con xState (Lógica de estado determinista).
- **Tema 2.3**: Server State Management (React Query/TanStack Query: Caching, stale-while-revalidate).

### Módulo 3: Patrones de Diseño de Componentes

*Objetivo: Crear componentes reutilizables, flexibles y mantenibles.*

- **Tema 3.1**: Compound Components Pattern (Gestión de estado implícito).
- **Tema 3.2**: Control Props Pattern (Inversión de control).
- **Tema 3.3**: Polymorphic Components con TypeScript.
- **Tema 3.4**: Headless UI Components (Separación total de lógica y vista).

### Módulo 4: Performance y Optimización

*Objetivo: Diagnosticar y solucionar cuellos de botella de rendimiento.*

- **Tema 4.1**: Profiling en React (React DevTools Profiler, Flamegraphs).
- **Tema 4.2**: Memoization Strategies (useMemo, useCallback, React.memo - Cuándo NO usarlos).
- **Tema 4.3**: Code Splitting y Lazy Loading (Route-based vs Component-based).
- **Tema 4.4**: Virtualización de listas (Windowing).

### Módulo 5: Testing y Calidad

*Objetivo: Estrategias de testing para aplicaciones complejas.*

- **Tema 5.1**: Pruebas de Integración con React Testing Library.
- **Tema 5.2**: Testing de Custom Hooks complejos.
- **Tema 5.3**: Mocking avanzado con MSW (Mock Service Worker).

## JSON de Entregables (Para Automatización)

```json
[
  {
    "id": 0,
    "title": "Fundamentos Sólidos y Nivelación",
    "topics": [
      { "id": "0.1", "title": "JavaScript Moderno para React" },
      { "id": "0.2", "title": "TypeScript Esencial en React" },
      { "id": "0.3", "title": "Arquitectura Interna de React" }
    ]
  },
  {
    "id": 1,
    "title": "Deep Dive en Rendering y Reconciliación",
    "topics": [
      { "id": "1.1", "title": "Fase de Render vs Fase de Commit" },
      { "id": "1.2", "title": "El Algoritmo de Reconciliación" },
      { "id": "1.3", "title": "React Fiber Architecture" }
    ]
  },
  {
    "id": 2,
    "title": "Gestión de Estado Avanzada",
    "topics": [
      { "id": "2.1", "title": "Context Context API: Patrones de optimización" },
      { "id": "2.2", "title": "State Machines con xState" },
      { "id": "2.3", "title": "Server State Management" }
    ]
  },
  {
    "id": 3,
    "title": "Patrones de Diseño de Componentes",
    "topics": [
      { "id": "3.1", "title": "Compound Components Pattern" },
      { "id": "3.2", "title": "Control Props Pattern" },
      { "id": "3.3", "title": "Polymorphic Components con TypeScript" },
      { "id": "3.4", "title": "Headless UI Components" }
    ]
  },
  {
    "id": 4,
    "title": "Performance y Optimización",
    "topics": [
      { "id": "4.1", "title": "Profiling en React" },
      { "id": "4.2", "title": "Memoization Strategies" },
      { "id": "4.3", "title": "Code Splitting y Lazy Loading" },
      { "id": "4.4", "title": "Virtualización de listas" }
    ]
  },
  {
    "id": 5,
    "title": "Testing y Calidad",
    "topics": [
      { "id": "5.1", "title": "Pruebas de Integración con React Testing Library" },
      { "id": "5.2", "title": "Testing de Custom Hooks complejos" },
      { "id": "5.3", "title": "Mocking avanzado con MSW" }
    ]
  }
]
```
