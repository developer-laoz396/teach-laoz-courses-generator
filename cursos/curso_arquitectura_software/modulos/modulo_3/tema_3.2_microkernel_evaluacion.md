# EVALUACIÓN: TEMA 3.2 (MICROKERNEL)

## FICHA TÉCNICA

- **Tema**: Arquitectura de Plugins
- **Nivel**: Avanzado

---

## CUESTIONARIO

### Pregunta 1

En una arquitectura Microkernel, ¿cuál es la relación de dependencia correcta?
a) El Core depende de los Plugins (el Core importa los plugins).
b) Los Plugins dependen del Core (los Plugins importan la API del Core).
c) Son interdependientes (Circular).

### Pregunta 2

¿Cuál es la función del "Plugin Registry"?
a) Cobrar dinero por los plugins.
b) Mantener un inventario de qué plugins están disponibles y cómo cargarlos/instanciarlos.
c) Validar el código fuente.

### Pregunta 3

Si modificas la API pública del Core (Breaking Change), ¿qué consecuencia tiene?
a) Ninguna, es transparente.
b) Probablemente rompas todos los plugins existentes que usaban esa API, obligando a sus autores a actualizarlos.
c) El sistema se vuelve más rápido.

### Pregunta 4

El "Core System" debería contener:
a) Toda la lógica de negocio posible para cubrir todos los casos extremos.
b) Solo la lógica mínima indispensable y común para que el sistema arranque y pueda ejecutar las extensiones.
c) Solo la base de datos.

---

## SOLUCIONARIO

1. **b)**. El Core debe ser agnóstico.
2. **b)**. Es el portero de la discoteca.
3. **b)**. Por eso el Core debe ser muy estable.
4. **b)**. "Keep it small".
