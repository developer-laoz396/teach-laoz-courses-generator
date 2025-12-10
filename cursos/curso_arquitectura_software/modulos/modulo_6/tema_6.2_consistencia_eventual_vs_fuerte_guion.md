## 🎧 GUIÓN DE AUDIO: TEMA 6.2 - Consistencia Eventual vs Fuerte

## Ficha Técnica
- **Duración estimada**: 8-10 minutos
- **Tono**: Profesional, didáctico
- **Ritmo**: Moderado con pausas para reflexión

---

## [00:00 - 00:30] INTRODUCCIÓN

**[Música de fondo sutil entra y se mantiene bajo]**

Bienvenido al tema 6.2: **Consistencia Eventual vs Fuerte**. 🔄

En el módulo anterior, establecimos el *trade-off* inevitable del Teorema CAP. Ahora, vamos a profundizar en cómo se manifiestan esos compromisos en la práctica a través de los **Modelos de Consistencia**. Esta es la diferencia entre tener la certeza de que tus datos son correctos **inmediatamente** y la certeza de que lo serán **eventualmente**. Entender esta dicotomía es fundamental para diseñar sistemas que prioricen la **correcta experiencia de usuario** según el dominio.

*[Pausa 2 segundos]*

---

## [00:30 - 02:00] CONTEXTO Y MOTIVACIÓN

Imagina que estás diseñando un sistema de producción que tiene réplicas distribuidas en todo el mundo. Un usuario en Sídney actualiza su perfil. ¿Cuánto tiempo tarda un usuario en Nueva York en ver ese cambio? Una de las decisiones más críticas que enfrentarás es definir el **nivel de garantía de datos** que es aceptable para cada funcionalidad.

*[Pausa 1 segundo]*

Adoptar la **Consistencia Eventual** es la clave para la alta **escalabilidad** y **disponibilidad**, pero requiere que los desarrolladores gestionen la posibilidad de leer datos desactualizados. Este concepto te permite:
- **Modelos de consistencia**: Clasificar el nivel de garantía de datos.
- **Staleness**: Cuantificar la "antigüedad" de los datos que lee un sistema.
- **Read your own writes**: Implementar garantías específicas para mejorar la experiencia de usuario dentro de la Consistencia Eventual.

*[Pausa 2 segundos]*

---

## [02:00 - 05:00] CONCEPTOS CLAVE

Vamos a desglosar los elementos fundamentales:

### Modelos de consistencia
Los modelos de consistencia definen el contrato entre los programadores y el sistema de almacenamiento. Los dos principales son:

1.  **Consistencia Fuerte (Strong Consistency):** Después de que una escritura (`Write`) se completa, **todas** las lecturas (`Read`) posteriores devuelven el valor más reciente. Esto es lo que garantizan las bases de datos relacionales tradicionales con transacciones ACID. Ofrece la mayor garantía de integridad de datos, pero sacrifica **Disponibilidad** y **Latencia** en sistemas distribuidos (el sistema debe esperar a que todas las réplicas confirmen la escritura).
2.  **Consistencia Eventual (Eventual Consistency):** El sistema garantiza que, si no ocurren más escrituras en el dato, **eventualmente** todas las réplicas convergerán y las lecturas devolverán el mismo valor. Es la elección preferida de los sistemas AP (Disponibilidad y Tolerancia a la Partición) como Cassandra y DynamoDB. Ofrece **baja latencia y alta disponibilidad**, pero a costa de introducir un **período de inconsistencia**. 

*[Pausa 1 segundo]*

### Staleness
**Staleness** (o **antigüedad de los datos**) es la medida que describe cuán desactualizado está el valor que lees en comparación con el valor más reciente que ha sido escrito. En un sistema de Consistencia Eventual, la *Staleness* no es cero; existe un **período de ventana** en el que el cliente puede leer datos antiguos. Un diseñador de sistemas debe definir la **Staleness aceptable** para cada caso de uso. Por ejemplo:
- La *Staleness* de un carrito de compras debe ser casi cero.
- La *Staleness* del número de "me gusta" en una publicación puede ser de varios minutos.

*[Pausa 1 segundo]*

### Read your own writes (Lee tus propias escrituras)
La **Consistencia Eventual** puede generar una mala experiencia de usuario. Imagina que un usuario publica un comentario y lo ve desaparecer inmediatamente después de ser redirigido a la página. Para mitigar esto, se utilizan garantías más suaves:
- **Read your own writes:** Garantiza que, después de que un usuario realiza una escritura exitosa, **siempre** leerá esa escritura en cualquier lectura posterior (aunque otros usuarios puedan seguir viendo los datos antiguos). Se logra enrutando las lecturas del usuario a la réplica donde se realizó la escritura, hasta que la replicación se ponga al día.
Otros modelos incluyen **Consistencia Monotónica** (si leo X, nunca leeré una versión anterior de X más tarde) y **Consistencia Causal** (si A causa B, entonces nadie que vea B verá A antes).

*[Pausa 1 segundo]*

---

## [05:00 - 07:00] EJEMPLO PRÁCTICO

**[Pausa más larga para marcar la transición]**

Veamos la aplicación de estos modelos en un sistema de **Red Social**.

1.  **Consistencia Fuerte (Cuenta de Crédito):** La función de **crédito o balance de la cuenta** del usuario. Si un usuario tiene 100 créditos y usa 50 para comprar un artículo, se requiere Consistencia Fuerte. El sistema debe bloquear lecturas y escrituras hasta que se garantice que el saldo es 50.

2.  **Consistencia Eventual (Contador de Seguidores):** Cuando un usuario gana un nuevo seguidor, el contador de seguidores se actualiza en la réplica A. El usuario en la réplica B puede ver el contador desactualizado por unos segundos. Esto es Consistencia Eventual. La **Staleness** es aceptable; la **Disponibilidad** es prioritaria.

3.  **Read your own writes (Publicación de Post):** Después de que el usuario publica un *post*, el sistema garantiza que el mismo usuario ve su *post* inmediatamente, incluso si el resto del mundo no lo ve por un momento. La implementación es clave para que la experiencia del usuario sea fluida.

*[Pausa 2 segundos]*

---

## [07:00 - 08:30] ERRORES COMUNES

Antes de terminar, quiero advertirte sobre los errores más frecuentes:

1.  **Asumir Consistencia Fuerte por Defecto:** Utilizar bases de datos CP (Consistencia Fuerte) para cada microservicio, incluso para datos que no lo requieren. Esto impacta innecesariamente la escalabilidad y puede ser un **cuello de botella** de rendimiento.
2.  **Ignorar los Controles de Experiencia (Eventualidad):** Adoptar Consistencia Eventual sin implementar modelos de mitigación como *Read your own writes*. Esto puede frustrar al usuario, que espera ver sus propios cambios de manera inmediata.

*[Pausa 1 segundo]*

---

## [08:30 - 10:00] RESUMEN Y CIERRE

**[Música de fondo sutil se eleva ligeramente]**

Para resumir, la elección entre **Consistencia Eventual vs Fuerte** es esencial porque define el equilibrio entre la **integridad de los datos** y la **disponibilidad del sistema**. Los sistemas distribuidos modernos a menudo optan por la Consistencia Eventual por razones de escalabilidad.

Los puntos clave que debes recordar son:
1.  **Consistencia Fuerte** garantiza la inmediatez, sacrificando *A* y *L*.
2.  **Consistencia Eventual** garantiza la alta disponibilidad y baja latencia, introduciendo una ventana de **Staleness**.
3.  La clave es aplicar garantías más suaves, como **Read your own writes**, para mejorar la experiencia del usuario dentro de la Consistencia Eventual.

En el próximo tema, exploraremos cómo estos conceptos se conectan con... **CQRS (Command Query Responsibility Segregation)**, el patrón ideal para gestionar la complejidad de la Consistencia Eventual separando las operaciones de escritura y lectura.

¡Nos vemos en la siguiente lección!

**[Música de fondo se eleva y se desvanece]**

---

## NOTAS DE PRODUCCIÓN
- Insertar música de fondo sutil durante introducción (desde 00:00 - 00:30)
- Enfatizar palabras clave: **Consistencia Eventual**, **Consistencia Fuerte**, **Staleness**, **Read your own writes**.
- Pausas más largas antes de ejemplos prácticos (entre 05:00 y 07:00).
- Tono profesional y didáctico.