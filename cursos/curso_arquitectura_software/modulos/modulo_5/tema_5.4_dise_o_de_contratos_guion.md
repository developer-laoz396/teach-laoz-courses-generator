## 🎧 GUIÓN DE AUDIO: TEMA 5.4 - Diseño de Contratos

## Ficha Técnica
- **Duración estimada**: 8-10 minutos
- **Tono**: Profesional, didáctico
- **Ritmo**: Moderado con pausas para reflexión

---

## [00:00 - 00:30] INTRODUCCIÓN

**[Música de fondo sutil entra y se mantiene bajo]**

Bienvenido al tema 5.4: **Diseño de Contratos**. 📜

Cerramos esta sección sobre comunicación con el concepto que garantiza que los servicios distribuidos puedan hablar entre sí a lo largo del tiempo. Un **Contrato** es el acuerdo formal sobre la estructura de los datos que se intercambian (ya sean mensajes, eventos o respuestas API). Comprender el **Diseño de Contratos** es fundamental para diseñar sistemas **robustos y escalables** que puedan evolucionar sin romper a los clientes existentes.

*[Pausa 2 segundos]*

---

## [00:30 - 02:00] CONTEXTO Y MOTIVACIÓN

Imagina que estás diseñando un sistema de producción con microservicios y que el Servicio A (Productor) decide renombrar un campo en el evento `PedidoCreado`. Si el Servicio B (Consumidor) no está preparado para este cambio, su lógica se rompe. Una de las decisiones más críticas que enfrentarás es cómo asegurar que el **cambio** en un servicio no provoque una **cascada de fallos** en los demás.

*[Pausa 1 segundo]*

El diseño de contratos es la disciplina que gestiona la evolución de las APIs y los eventos, enfocándose en la **independencia evolutiva**. Este concepto te permite:
- **Versionamiento**: Gestionar múltiples formatos de datos a la vez.
- **Backward compatibility**: Asegurar que las nuevas versiones no rompan a los clientes antiguos.
- **Esquemas (JSON Schema, Protobuf)**: Usar herramientas para definir y validar los contratos de forma estricta.

*[Pausa 2 segundos]*

---

## [02:00 - 05:00] CONCEPTOS CLAVE

Vamos a desglosar los elementos fundamentales del Diseño de Contratos:

### Versionamiento
El **Versionamiento** es el mecanismo para gestionar los cambios en la estructura de los mensajes, APIs o eventos. La clave es evitar el cambio directo y destructivo. Generalmente se utilizan dos enfoques:
1.  **Versionamiento URI (para APIs REST):** Se incluye la versión en la ruta (Ej. `/api/v1/productos`). Esto obliga al cliente a actualizar la URI para usar la nueva versión, pero mantiene las versiones antiguas disponibles.
2.  **Versionamiento por Esquema (para Eventos):** Se incluye un campo de versión dentro del cuerpo del evento o mensaje. El consumidor lee este campo y utiliza la lógica de deserialización adecuada para esa versión.

*[Pausa 1 segundo]*

### Backward compatibility (Compatibilidad con Versiones Anteriores)
La **Compatibilidad con Versiones Anteriores** (*Backward Compatibility*) es la regla de oro. Significa que un **Productor** debe poder lanzar una nueva versión de su contrato que pueda ser entendida y procesada correctamente por **Consumidores** que todavía usan versiones antiguas. Esto se logra con reglas estrictas de cambio:
- **Cambios Aditivos (Seguros):** Añadir nuevos campos **opcionales** a un contrato. Los clientes antiguos simplemente ignorarán el nuevo campo.
- **Cambios Destructivos (Peligrosos):** Renombrar, eliminar o cambiar el tipo de un campo existente. Esto **rompe** la compatibilidad y debe evitarse, o requerir un nuevo *major version* (v2).

*[Pausa 1 segundo]*

### Esquemas (JSON Schema, Protobuf)
Para hacer cumplir el contrato, necesitamos herramientas de **definición de esquema**. Estas herramientas definen la estructura, el tipo de datos y las reglas de validación que debe seguir el mensaje/API.
- **JSON Schema:** Define la estructura de los mensajes JSON. Es excelente para validar los cuerpos de las APIs REST y la serialización legible por humanos.
- **Protocol Buffers (Protobuf) o Avro:** Son lenguajes de definición de interfaz (IDL) que se utilizan a menudo con gRPC y Kafka. Generan código optimizado para la serialización binaria, lo que los hace mucho **más eficientes en latencia** que JSON, y proporcionan una **validación de esquema estricta**. 

*[Pausa 1 segundo]*

---

## [05:00 - 07:00] EJEMPLO PRÁCTICO

**[Pausa más larga para marcar la transición]**

Veamos el impacto de un mal diseño de contrato.

**Escenario de Fallo:** Tenemos el evento `UsuarioRegistrado` que siempre ha tenido el campo `nombreCompleto`. El equipo del servicio Productor lo cambia a `nombre` y `apellido`. Si el Consumidor (que envía el email de bienvenida) no se actualiza, el email saldrá en blanco porque no encuentra el campo `nombreCompleto`. Esto es un **cambio destructivo** que requirió un despliegue coordinado.

**Solución (Backward Compatible):** Si el productor hubiera **añadido** los campos `nombre` y `apellido`, y mantenido `nombreCompleto` (quizás como un campo **deprecated** y opcional), el consumidor antiguo habría seguido funcionando. El nuevo contrato sigue siendo compatible con versiones anteriores. Las herramientas de esquema (como Avro o Protobuf) te obligan a definir explícitamente si un campo es opcional o requerido, previniendo estos fallos.

*[Pausa 2 segundos]*

---

## [07:00 - 08:30] ERRORES COMUNES

Antes de terminar, quiero advertirte sobre los errores más frecuentes en el Diseño de Contratos:

1.  **"Cambiarlo y Ver Qué Pasa":** Modificar un contrato sin revisar el impacto en los consumidores (lo que se conoce como **Acuerdo Implícito**). En un sistema distribuido, siempre debes asumir que hay consumidores que no conoces o que no se han actualizado.
2.  **Exposición Excesiva de Datos (Acoplamiento de Datos):** Incluir más datos en el contrato de los que el consumidor realmente necesita. Esto acopla al consumidor a la estructura interna del productor. Un buen contrato es un acto de **separación de responsabilidades**.

*[Pausa 1 segundo]*

---

## [08:30 - 10:00] RESUMEN Y CIERRE

**[Música de fondo sutil se eleva ligeramente]**

Para resumir, el **Diseño de Contratos** es esencial porque es la herramienta principal que usamos para gestionar el **cambio** y garantizar la **independencia evolutiva** entre los servicios en una arquitectura distribuida.

Los puntos clave que debes recordar son:
1.  El **Versionamiento** es necesario para gestionar los cambios.
2.  Prioriza siempre la **Backward Compatibility** (compatibilidad con versiones anteriores) con cambios aditivos.
3.  Utiliza **Esquemas** (JSON Schema, Protobuf) para validar y hacer cumplir los acuerdos entre servicios.

En el próximo tema, exploraremos cómo estos conceptos se conectan con... **CQRS (Command Query Responsibility Segregation)**, un patrón que ayuda a simplificar el lado de la lectura de los datos.

¡Nos vemos en la siguiente lección!

**[Música de fondo se eleva y se desvanece]**

---

## NOTAS DE PRODUCCIÓN
- Insertar música de fondo sutil durante introducción (desde 00:00 - 00:30)
- Enfatizar palabras clave: **Diseño de Contratos**, **Versionamiento**, **Backward compatibility**, **Esquemas**, **independencia evolutiva**.
- Pausas más largas antes de ejemplos prácticos (entre 05:00 y 07:00).
- Tono profesional y didáctico.