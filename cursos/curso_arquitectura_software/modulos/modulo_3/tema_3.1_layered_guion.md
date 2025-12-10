## 🎧 GUIÓN DE AUDIO: TEMA 3.1 - Layered Architecture (Capas)

## Ficha Técnica

- **Duración**: 4 minutos
- **Tono**: Gastronómico.

---

### [00:00 - 01:15] LA LASAÑA DE SOFTWARE 🍝

**[LOCUTOR]**:

Imagina una lasaña. **[Música de fondo sutil entra y se mantiene bajo]**

Tiene capas claras. Pasta, carne, queso, salsa. Cada capa tiene un propósito único. No mezclas la carne con el postre.
La arquitectura por capas es igual. Es el patrón de diseño más intuitivo y común que existe, y se basa en el principio de **Separación de Responsabilidades** que ya exploramos.

Arriba del todo, la **Capa de Presentación** (la Interfaz de Usuario, la API REST). Piénsala como el **camarero** que atiende al cliente. Lo único que sabe hacer es tomar el pedido, pasarlo y sonreír. No sabe ni debe saber cómo se cocina.

En medio, la **Capa de Negocio** (o Dominio). Este es el **chef**. Él sabe cocinar. Sabe que el filete tarda diez minutos, que las recetas llevan ciertas especias y que no se puede servir un plato sin salsa. Sabe las reglas. No sabe quién se lo va a comer, solo sabe cocinarlo.

Abajo, la **Capa de Persistencia** (la Base de Datos, el Sistema de Archivos). Esta es la **despensa**. El chef pide "tomates", y la despensa se los da. Al chef no le importa si los tomates vienen del huerto o del supermercado, siempre y cuando cumplan con el contrato de "tomates". 

---

### [01:15 - 02:30] SEPARACIÓN DE RESPONSABILIDADES 🔪

**[LOCUTOR]**:

La regla sagrada es: el **camarero NO cocina**, y la **despensa NO sirve mesas**.

Si la Capa de Presentación contiene sentencias SQL o lógica de cálculo de impuestos, has roto la lasaña. Has hecho un revuelto inmanejable. La regla estricta es que **cada capa solo llama a la inmediatamente inferior**.

Mantener las capas puras es lo que te da **flexibilidad**. Así, si mañana cambias tu base de datos **MySQL por MongoDB**, solo tocas el código de la capa de abajo, la **Persistencia**. El chef (la Capa de Negocio) ni se entera, ya que él solo conoce la interfaz que pide "tomates", y no el Adaptador que los recupera. Esto reduce el **acoplamiento** y maximiza la **mantenibilidad**.

---

### [02:30 - 03:40] EL SINKHOLE (AGUJERO NEGRO) 🕳️

**[LOCUTOR]**:

Pero cuidado. No todo son ventajas.

A veces, caemos en la trampa del **Sinkhole** o Agujero Negro. Esto ocurre cuando creamos capas por puro vicio o burocracia.

Tienes un Controlador que llama a un Servicio que llama a un Repositorio... y **ninguno hace nada**. Simplemente pasan el dato. El Servicio no tiene lógica de negocio propia; solo es un *proxy* entre el Controlador y el Repositorio.

Si el cien por ciento de tu aplicación es un **CRUD simple** (Crear, Leer, Actualizar, Borrar) sin reglas de negocio complejas, quizás esta arquitectura es demasiado compleja. Estás añadiendo sobrecarga. No tengas miedo de simplificar y eliminar capas innecesarias que solo ralentizan el flujo de trabajo.

---

### [03:40 - 04:00] CIERRE ✅

**[LOCUTOR]**:

La arquitectura por capas es un clásico por una razón: **Funciona**. Es fácil de testear, fácil de entender y fácil de delegar entre equipos. Es el punto de partida para cualquier sistema.

Empieza por aquí. Si tu negocio crece mucho, ya tendrás una base sólida para partirla en **microservicios**.

Pero recuerda: una buena lasaña con capas definidas siempre es mejor que un plato de espaguetis enredados.

**[Música de fondo se eleva y se desvanece]**