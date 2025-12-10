## 🎧 GUIÓN DE AUDIO: TEMA 3.1 - Layered Architecture (Capas)

## Ficha Técnica

- **Duración estimada**: 8-10 minutos
- **Tono**: Profesional, didáctico
- **Ritmo**: Moderado con pausas para reflexión

---

## [00:00 - 00:30] INTRODUCCIÓN

**[Música de fondo sutil entra y se mantiene bajo]**

Bienvenido al tema 3.1: **Layered Architecture (Arquitectura en Capas)**. 🪜

Iniciamos la sección de **Patrones Arquitectónicos**. La Arquitectura en Capas es quizás el patrón más antiguo y universalmente adoptado. Comprender la **Arquitectura en Capas** es fundamental para diseñar sistemas **robustos y escalables** porque introduce un principio de **Separación de Responsabilidades** esencial para la **mantenibilidad**.

_[Pausa 2 segundos]_

---

## [00:30 - 02:00] CONTEXTO Y MOTIVACIÓN

Imagina que estás diseñando un sistema de producción, como una aplicación de gestión de clientes. Si toda la lógica de presentación, negocio y base de datos estuviera en una sola pieza de código, sería un desastre inmanejable. La **Arquitectura en Capas** resuelve esto dividiendo el sistema en módulos lógicos que interactúan entre sí.

_[Pausa 1 segundo]_

Este concepto te permite:

- **El estándar de facto**: Es la base de casi todas las arquitecturas de software modernas.
- **Capa de Dominio**: Centralizar las reglas y la lógica de negocio.
- **Capa de Aplicación**: Gestionar las interacciones y los flujos de trabajo del sistema.

_[Pausa 2 segundos]_

---

## [02:00 - 05:00] CONCEPTOS CLAVE

Vamos a desglosar los elementos fundamentales de esta arquitectura clásica de tres (o cuatro) capas:

### El estándar de facto

La Arquitectura en Capas es el **estándar de facto** porque impone un **estricto control de dependencias**. Una capa solo puede invocar a los servicios de la capa inmediatamente inferior. Esto reduce el acoplamiento al evitar que la lógica de la presentación acceda directamente a la base de datos, por ejemplo. La capa superior depende de la inferior, pero nunca al revés.

_[Pausa 1 segundo]_

### Capa de Dominio

También conocida como la **Capa de Negocio**, es el corazón del sistema. Contiene las **reglas de negocio** que definen qué hace la aplicación. Aquí residen las entidades, los objetos de valor y la lógica que rige las interacciones clave (Ej. calcular un precio, aplicar una regla de descuento). Esta capa debe ser **independiente** de cualquier detalle de infraestructura.

_[Pausa 1 segundo]_

### Capa de Aplicación

Esta capa actúa como el **coordinador** o el **flujo de trabajo**. No contiene reglas de negocio propiamente dichas, sino que orquesta las acciones de la Capa de Dominio. Recibe una solicitud (Ej. del controlador web), valida la entrada, invoca la lógica en el Dominio y luego gestiona la persistencia a través de la Infraestructura. Contiene los _Use Cases_ o **Casos de Uso** del sistema.

_[Pausa 1 segundo]_

### Capa de Infraestructura

Esta es la capa de los **detalles técnicos**. Se encarga de la comunicación con el mundo exterior: la **persistencia** (bases de datos, _brokers_ de mensajes) y las **comunicaciones externas** (servicios de correo electrónico, APIs externas). La Capa de Aplicación y la Capa de Dominio solo interactúan con esta capa a través de **interfaces** (siguiendo el Principio de Inversión de Dependencias, DIP).

_[Pausa 1 segundo]_

---

## [05:00 - 07:00] EJEMPLO PRÁCTICO

**[Pausa más larga para marcar la transición]**

Veamos cómo se aplica esto en un caso real: el proceso de **Crear un Pedido**.

1. **Capa de Presentación:** Un controlador web (`OrderController`) recibe la solicitud HTTP y pasa los datos a la capa inferior.
2. **Capa de Aplicación:** El `OrderService` (o Caso de Uso) valida la solicitud, invoca la entidad `Pedido` de la Capa de Dominio para aplicar la lógica (Ej. calcular impuestos), y luego utiliza la interfaz `OrderRepository` de la Capa de Infraestructura para guardar el pedido.
3. **Capa de Dominio:** La entidad `Pedido` asegura que, por ejemplo, el _stock_ no baje de cero. Contiene la regla de negocio.
4. **Capa de Infraestructura:** Una implementación concreta de `OrderRepository` ejecuta la consulta SQL para guardar el pedido en la base de datos.
   La clave es que `OrderService` (Aplicación) y `Pedido` (Dominio) no saben que la base de datos es MySQL; solo conocen la interfaz `OrderRepository`.

_[Pausa 2 segundos]_

---

## [07:00 - 08:30] ERRORES COMUNES

Antes de terminar, quiero advertirte sobre los errores más frecuentes al usar la Arquitectura en Capas:

1. **"Saltarse la Capa":** Permitir que una capa superior acceda directamente a una capa inferior no adyacente (Ej. la Capa de Presentación llamando directamente a la Capa de Infraestructura). Esto destruye el control de dependencias y anula el beneficio de la modularidad.
2. **"Túnel de Negocio":** Poner la lógica de negocio real en la Capa de Aplicación o, peor aún, en la Capa de Presentación. Esto debilita la Capa de Dominio, haciendo que el sistema sea difícil de mantener y reusar la lógica de negocio en diferentes interfaces (Ej. una API y una GUI).

_[Pausa 1 segundo]_

---

## [08:30 - 10:00] RESUMEN Y CIERRE

**[Música de fondo sutil se eleva ligeramente]**

Para resumir, la **Layered Architecture (Capas)** es esencial porque proporciona un marco claro y rígido para la **Separación de Responsabilidades** y el **control de dependencias**, lo que la convierte en la base para casi todo el diseño de sistemas.

Los puntos clave que debes recordar son:

1. Es el **estándar de facto** y se basa en la regla de dependencia estricta: solo se comunica con la capa adyacente inferior.
2. La **Capa de Dominio** centraliza las reglas de negocio.
3. La **Capa de Aplicación** orquesta los Casos de Uso.

En el próximo tema, exploraremos cómo estos conceptos se conectan con... la **Arquitectura Cliente-Servidor**, el patrón que define cómo estas capas se distribuyen a través de la red.

¡Nos vemos en la siguiente lección!

**[Música de fondo se eleva y se desvanece]**

---

## NOTAS DE PRODUCCIÓN

- Insertar música de fondo sutil durante introducción (desde 00:00 - 00:30)
- Enfatizar palabras clave: **Layered Architecture**, **estándar de facto**, **Capa de Dominio**, **Capa de Aplicación**, **Separación de Responsabilidades**.
- Pausas más largas antes de ejemplos prácticos (entre 05:00 y 07:00).
- Tono profesional y didáctico.
