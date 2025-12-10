## 🎧 GUIÓN DE AUDIO: TEMA 5.2 - Event-Driven Architecture (EDA) y Event Sourcing

## Ficha Técnica
- **Duración estimada**: 8-10 minutos
- **Tono**: Profesional, didáctico
- **Ritmo**: Moderado con pausas para reflexión

---

## [00:00 - 00:30] INTRODUCCIÓN

**[Música de fondo sutil entra y se mantiene bajo]**

Bienvenido al tema 5.2: **Event-Driven Architecture (EDA) y Event Sourcing**. 📡

Continuamos explorando la comunicación asíncrona. En este módulo, profundizaremos en el patrón que formaliza el uso de la mensajería: la **Arquitectura Orientada a Eventos (EDA)** y la técnica de persistencia que la complementa, **Event Sourcing**. Estos conceptos son fundamentales para diseñar sistemas **robustos, escalables** y con el máximo **desacoplamiento** entre servicios.

*[Pausa 2 segundos]*

---

## [00:30 - 02:00] CONTEXTO Y MOTIVACIÓN

Imagina que estás diseñando un sistema de producción, como una aplicación de reserva de vuelos que tiene muchos servicios independientes (pagos, emisión de billetes, notificaciones). Si estos servicios se llaman síncronamente, un fallo en Notificaciones puede tumbar el proceso de Reserva. La **EDA** resuelve esto. Una de las decisiones más críticas que enfrentarás es moverte del paradigma síncrono al asíncrono, donde el **"qué sucedió"** es más importante que el "qué hago ahora".

*[Pausa 1 segundo]*

Este patrón de diseño te permite:
- **EDA**: Desacoplar productores y consumidores mediante la publicación de hechos.
- **Event Sourcing**: Utilizar los eventos como la **fuente de verdad** para el estado.
- **Eventos como fuente de verdad**: Entender que el estado actual es solo la proyección de la secuencia histórica de eventos.

*[Pausa 2 segundos]*

---

## [02:00 - 05:00] CONCEPTOS CLAVE

Vamos a desglosar los elementos fundamentales:

### EDA (Arquitectura Orientada a Eventos)
La **EDA** es un patrón arquitectónico donde los servicios se comunican mediante la producción, detección, consumo y reacción a los **eventos**. Un **Evento** es un registro inmutable de algo que ocurrió en el pasado (Ej. `PedidoCreado`, `PagoAceptado`). El servicio que produce el evento (**Productor**) no sabe ni le importa quién lo consume; solo publica el hecho en un **Broker de Mensajes** (Ej. Kafka). Los servicios interesados (**Consumidores**) se suscriben al evento y actúan en consecuencia. Esto genera un **desacoplamiento total** (espacial y temporal) y una enorme **resiliencia**. 

*[Pausa 1 segundo]*

### Event Sourcing
**Event Sourcing** es un patrón de persistencia. En lugar de guardar el **estado actual** del sistema (como una fila en una base de datos), solo guardamos la **secuencia completa de Eventos** que llevaron a ese estado. Por ejemplo, la cuenta bancaria no almacena el saldo final, sino la lista de transacciones (`Depósito(100)`, `Retiro(50)`). El estado actual se **rehidrata** (calcula) reproduciendo todos los eventos. Esto proporciona una **auditoría** perfecta y la capacidad de viajar en el tiempo o generar proyecciones alternativas de datos.

*[Pausa 1 segundo]*

### Eventos como fuente de verdad
En un sistema que utiliza **Event Sourcing**, el *log* de eventos es la **fuente de verdad** inmutable. Si el sistema necesita cambiar su esquema de base de datos o implementar una nueva funcionalidad, puede simplemente **reproducir** todos los eventos históricos desde el inicio. El estado de la aplicación es solo una **proyección** del *log* de eventos.

*[Pausa 1 segundo]*

### Patrón Outbox
Un desafío clave en EDA es asegurar que la **actualización de la base de datos local** y la **publicación del evento** al *Broker* sean **atómicas** (o ambas suceden o ninguna). Si actualizas la base de datos pero el evento no se publica, los sistemas están inconsistentes. El **Patrón Outbox** resuelve esto: en lugar de publicar directamente al *Broker*, el servicio escribe el evento en una tabla temporal (`Outbox`) dentro de su propia base de datos (parte de la misma transacción local). Un proceso separado (el *Outbox Processor*) se encarga de leer esta tabla y enviarla de forma asíncrona al *Broker* externo.

*[Pausa 1 segundo]*

---

## [05:00 - 07:00] EJEMPLO PRÁCTICO

**[Pausa más larga para marcar la transición]**

Veamos cómo se aplica Event Sourcing en el **Servicio de Pedidos**.

1.  **Acción:** Un usuario realiza un pedido.
2.  **Persistencia (Event Sourcing):** El Servicio de Pedidos no guarda un registro de `PedidoActivo`. En cambio, guarda los eventos: `PedidoIniciado`, `ArtículoAñadido`, `DirecciónConfirmada`, `PagoAceptado`.
3.  **Proyección:** El estado actual del pedido (`Estado: Pendiente de Envío`) se calcula sumando la información de esos eventos.
4.  **EDA:** Tras guardar `PagoAceptado` (usando el Patrón Outbox), el Servicio de Pedidos publica el evento `PedidoPagado` al *Broker*.
5.  **Consumo:** El **Servicio de Inventario** consume `PedidoPagado` para reservar *stock*. El **Servicio de Notificaciones** lo consume para enviar el correo de confirmación. Ninguno de estos servicios depende síncronamente del Servicio de Pedidos.

*[Pausa 2 segundos]*

---

## [07:00 - 08:30] ERRORES COMUNES

Antes de terminar, quiero advertirte sobre los errores más frecuentes al usar EDA y Event Sourcing:

1.  **Eventos como Comandos:** Publicar eventos que dicen lo que el receptor **debe hacer** (Ej. `PagarAhora`). Los eventos deben ser **hechos pasados e inmutables** (Ej. `PagoSolicitado`). Si no es un hecho, es un acoplamiento.
2.  **Complejidad Operacional (Event Sourcing):** Adoptar Event Sourcing sin la madurez operativa necesaria. La rehidratación de estados puede ser computacionalmente costosa para historiales muy largos, y la gestión de la consistencia de datos es compleja. No es necesario para todos los servicios.

*[Pausa 1 segundo]*

---

## [08:30 - 10:00] RESUMEN Y CIERRE

**[Música de fondo sutil se eleva ligeramente]**

Para resumir, la **Event-Driven Architecture (EDA)** y **Event Sourcing** son esenciales porque proporcionan las herramientas para el máximo **desacoplamiento** y la **resiliencia** en sistemas distribuidos, tratando los eventos como la **fuente de verdad**.

Los puntos clave que debes recordar son:
1.  **EDA** desacopla servicios mediante la publicación de **eventos inmutables**.
2.  **Event Sourcing** utiliza la secuencia de eventos como la **fuente de verdad** para el estado.
3.  El **Patrón Outbox** asegura la atomicidad entre la base de datos local y la publicación del evento.

En el próximo tema, exploraremos cómo estos conceptos se conectan con... **CQRS (Command Query Responsibility Segregation)**, un patrón que complementa Event Sourcing al optimizar las lecturas y escrituras de datos.

¡Nos vemos en la siguiente lección!

**[Música de fondo se eleva y se desvanece]**

---

## NOTAS DE PRODUCCIÓN
- Insertar música de fondo sutil durante introducción (desde 00:00 - 00:30)
- Enfatizar palabras clave: **EDA**, **Event Sourcing**, **Eventos como fuente de verdad**, **desacoplamiento**, **Patrón Outbox**.
- Pausas más largas antes de ejemplos prácticos (entre 05:00 y 07:00).
- Tono profesional y didáctico.