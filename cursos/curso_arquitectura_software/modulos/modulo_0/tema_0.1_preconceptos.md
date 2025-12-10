# Módulo 0: Preconceptos Fundamentales de Arquitectura de Software

## Introducción

Bienvenido al curso de **Arquitectura de Software Avanzada**. Antes de sumergirnos en los conceptos avanzados, es fundamental que domines ciertos conceptos base que serán los cimientos de todo lo que aprenderás. Este módulo te preparará con el conocimiento esencial necesario para aprovechar al máximo el curso.

---

## 1. Software y Sistema de Software

### Definición

**Software** es el conjunto de programas, datos y documentación que permite a una computadora realizar tareas específicas. Un **Sistema de Software** es una colección organizada de componentes de software que trabajan juntos para cumplir un propósito específico.

### Por qué es fundamental

Sin entender qué es un sistema de software, no podrás comprender qué significa "arquitecturar" uno. Es como intentar diseñar un edificio sin saber qué es una construcción.

**Analogía**: Piensa en un sistema de software como una ciudad. Las casas individuales son programas, las calles son las conexiones entre ellos, y el plan urbano es la arquitectura.

**Importancia**: 10/10 - Es el concepto más básico y fundamental.

---

## 2. Componente de Software

### Definición

Un **componente** es una unidad modular de software con una interfaz bien definida que encapsula funcionalidad específica. Puede ser reemplazado o actualizado independientemente del resto del sistema.

### Por qué es fundamental

La arquitectura de software trata sobre cómo organizar y conectar componentes. Si no entiendes qué es un componente, no podrás diseñar sistemas modulares.

**Analogía**: Un componente es como una pieza de LEGO. Tiene una forma específica (interfaz), cumple una función, y puede conectarse con otras piezas de manera predecible.

**Importancia**: 10/10 - La modularidad es el corazón de la arquitectura.

---

## 3. Interfaz y Contrato

### Definición

Una **interfaz** es el punto de contacto entre dos componentes, que define qué operaciones están disponibles y cómo invocarlas. Un **contrato** especifica las reglas, precondiciones y postcondiciones que deben cumplirse en esa interacción.

### Por qué es fundamental

Las interfaces son el "lenguaje" que usan los componentes para comunicarse. Sin interfaces claras, los sistemas se vuelven caóticos e imposibles de mantener.

**Analogía**: Una interfaz es como el enchufe de un electrodoméstico. No importa cómo funcione internamente la tostadora, mientras tenga el enchufe correcto (interfaz), funcionará con tu instalación eléctrica.

**Importancia**: 9/10 - Esencial para el desacoplamiento y la interoperabilidad.

---

## 4. Acoplamiento y Cohesión

### Definición

- **Acoplamiento**: Grado de dependencia entre componentes. Bajo acoplamiento significa que los componentes son independientes.
- **Cohesión**: Grado en que las responsabilidades de un componente están relacionadas. Alta cohesión significa que el componente hace una cosa y la hace bien.

### Por qué es fundamental

Estos dos conceptos son los pilares del diseño de software. Un buen arquitecto busca **bajo acoplamiento** y **alta cohesión**.

**Analogía**:

- **Acoplamiento**: Imagina que cada vez que cambias la batería de tu teléfono, también tienes que cambiar la pantalla. Eso es alto acoplamiento (malo).
- **Cohesión**: Un cuchillo corta, un tenedor pincha. Cada uno tiene una función clara (alta cohesión). Un "cuchillo-tenedor-cuchara" haría todo mal (baja cohesión).

**Importancia**: 10/10 - Fundamentales para evaluar la calidad del diseño.

---

## 5. Abstracción y Encapsulamiento

### Definición

- **Abstracción**: Proceso de ocultar detalles complejos y exponer solo lo esencial.
- **Encapsulamiento**: Técnica de agrupar datos y métodos que operan sobre esos datos, ocultando los detalles internos.

### Por qué es fundamental

Permiten manejar la complejidad dividiendo sistemas grandes en partes comprensibles. Son la base de la programación orientada a objetos y del diseño modular.

**Analogía**: Cuando conduces un auto, usas el volante, pedales y palanca de cambios (abstracción). No necesitas saber cómo funciona el motor internamente (encapsulamiento).

**Importancia**: 9/10 - Críticos para gestionar la complejidad.

---

## 6. Patrón de Diseño

### Definición

Un **patrón de diseño** es una solución reutilizable y probada a un problema común en el diseño de software. No es código específico, sino una plantilla que puedes adaptar.

### Por qué es fundamental

Los patrones son el vocabulario compartido de los arquitectos. Conocerlos te permite comunicar diseños complejos de manera concisa y aplicar soluciones probadas.

**Analogía**: Los patrones de diseño son como recetas de cocina. No te dicen exactamente qué cocinar, pero te dan una estructura probada para resolver problemas culinarios comunes.

**Ejemplos comunes**: Singleton, Factory, Observer, Strategy.

**Importancia**: 8/10 - Herramientas esenciales en el arsenal del arquitecto.

---

## 7. Escalabilidad

### Definición

**Escalabilidad** es la capacidad de un sistema para manejar crecimiento (más usuarios, más datos, más transacciones) sin degradar significativamente el rendimiento.

Tipos:

- **Escalabilidad vertical**: Añadir más recursos a una máquina (más RAM, CPU).
- **Escalabilidad horizontal**: Añadir más máquinas al sistema.

### Por qué es fundamental

Uno de los principales objetivos de la arquitectura es diseñar sistemas que puedan crecer. Un sistema que funciona para 100 usuarios pero colapsa con 10,000 tiene una arquitectura deficiente.

**Analogía**:

- **Vertical**: Comprar un camión más grande para transportar más carga.
- **Horizontal**: Comprar más camiones pequeños.

**Importancia**: 9/10 - Crítico para sistemas en producción.

---

## 8. Disponibilidad y Confiabilidad

### Definición

- **Disponibilidad**: Porcentaje de tiempo que un sistema está operativo y accesible.
- **Confiabilidad**: Probabilidad de que un sistema funcione correctamente durante un período específico.

### Por qué es fundamental

Los sistemas de software deben ser confiables. La arquitectura influye directamente en cuán disponible y confiable es un sistema (redundancia, failover, recuperación ante fallos).

**Analogía**: Un hospital debe estar disponible 24/7 (alta disponibilidad) y los equipos médicos deben funcionar correctamente cuando se necesitan (confiabilidad).

**Importancia**: 9/10 - Esencial para sistemas críticos.

---

## 9. Rendimiento y Latencia

### Definición

- **Rendimiento**: Cantidad de trabajo que un sistema puede realizar en un tiempo dado (throughput).
- **Latencia**: Tiempo que tarda el sistema en responder a una solicitud.

### Por qué es fundamental

Los usuarios esperan sistemas rápidos. La arquitectura determina los límites de rendimiento de un sistema (caching, procesamiento asíncrono, balanceo de carga).

**Analogía**:

- **Rendimiento**: Cuántos autos pueden pasar por un peaje en una hora.
- **Latencia**: Cuánto tiempo tarda un auto individual en pasar.

**Importancia**: 8/10 - Crítico para la experiencia del usuario.

---

## 10. Persistencia de Datos

### Definición

**Persistencia** es la capacidad de almacenar datos de manera que sobrevivan más allá de la ejecución del programa. Incluye bases de datos, archivos, y otros mecanismos de almacenamiento.

### Por qué es fundamental

Casi todos los sistemas necesitan guardar información. Las decisiones arquitectónicas sobre cómo y dónde persistir datos son fundamentales (SQL vs NoSQL, transacciones, consistencia).

**Analogía**: Es como la diferencia entre escribir en una pizarra (volátil) vs escribir en un cuaderno (persistente).

**Importancia**: 9/10 - Fundamental para la mayoría de aplicaciones.

---

## 11. API (Application Programming Interface)

### Definición

Una **API** es un conjunto de definiciones y protocolos que permite que diferentes componentes o sistemas se comuniquen entre sí. Define qué peticiones se pueden hacer, cómo hacerlas, y qué respuestas esperar.

### Por qué es fundamental

Las APIs son los "contratos" entre sistemas. En arquitecturas modernas (microservicios, cloud), las APIs son la columna vertebral de la comunicación.

**Analogía**: Una API es como el menú de un restaurante. Te dice qué puedes pedir (endpoints), cómo pedirlo (métodos HTTP), y qué recibirás (respuestas).

**Ejemplos**: REST API, GraphQL, gRPC.

**Importancia**: 9/10 - Esencial en arquitecturas distribuidas.

---

## 12. Arquitectura vs Diseño

### Definición

- **Arquitectura**: Decisiones estructurales de alto nivel que son difíciles de cambiar (frameworks, bases de datos, patrones arquitectónicos).
- **Diseño**: Decisiones de bajo nivel sobre cómo implementar funcionalidades específicas (clases, métodos, algoritmos).

### Por qué es fundamental

Entender esta distinción te ayuda a identificar qué decisiones son críticas y requieren más análisis. Las decisiones arquitectónicas tienen mayor impacto y costo de cambio.

**Analogía**:

- **Arquitectura**: Decidir si tu casa será de madera o concreto, cuántos pisos tendrá.
- **Diseño**: Decidir el color de las paredes o el tipo de manijas de las puertas.

**Importancia**: 10/10 - Define el alcance de tu rol como arquitecto.

---

## 13. Stakeholder (Parte Interesada)

### Definición

Un **stakeholder** es cualquier persona o grupo que tiene interés en el sistema: usuarios, desarrolladores, gerentes, clientes, operadores, etc.

### Por qué es fundamental

La arquitectura debe balancear las necesidades de múltiples stakeholders. Cada uno tiene diferentes prioridades (usuarios quieren velocidad, operadores quieren estabilidad, el negocio quiere bajo costo).

**Analogía**: En la construcción de un edificio, los stakeholders incluyen: los residentes (usuarios), los constructores (desarrolladores), el dueño (negocio), y la ciudad (reguladores).

**Importancia**: 8/10 - La arquitectura es una actividad social y política.

---

## 14. Trade-off (Compromiso)

### Definición

Un **trade-off** es una situación donde mejorar un aspecto del sistema implica sacrificar otro. No existe la arquitectura perfecta; todo es un balance.

### Por qué es fundamental

La arquitectura es el arte de tomar decisiones con información incompleta y balancear prioridades conflictivas. Entender que todo tiene un costo es esencial.

**Ejemplos comunes**:

- Rendimiento vs Mantenibilidad
- Consistencia vs Disponibilidad (Teorema CAP)
- Flexibilidad vs Simplicidad

**Analogía**: Al comprar un auto, puedes optimizar para velocidad, economía de combustible, o espacio, pero no puedes maximizar todo simultáneamente.

**Importancia**: 10/10 - El núcleo de la toma de decisiones arquitectónicas.

---

## 15. Deuda Técnica

### Definición

**Deuda técnica** es el costo implícito de rehacer trabajo debido a elegir una solución rápida y fácil ahora, en lugar de una mejor solución que tomaría más tiempo.

### Por qué es fundamental

Toda decisión arquitectónica tiene consecuencias a largo plazo. Entender la deuda técnica te ayuda a tomar decisiones conscientes sobre cuándo es aceptable "tomar atajos".

**Analogía**: Es como usar una tarjeta de crédito. Puedes obtener algo ahora, pero pagarás intereses (esfuerzo adicional) en el futuro.

**Importancia**: 8/10 - Crítico para la sostenibilidad del proyecto.

---

## 16. Separación de Responsabilidades (Separation of Concerns)

### Definición

Principio que establece que un sistema debe dividirse en secciones distintas, cada una abordando una preocupación o responsabilidad específica.

### Por qué es fundamental

Es uno de los principios más importantes del diseño de software. Permite que diferentes partes del sistema evolucionen independientemente.

**Analogía**: En un hospital, hay departamentos separados: emergencias, cirugía, pediatría. Cada uno se enfoca en su área sin interferir con los demás.

**Importancia**: 10/10 - Principio fundamental de la ingeniería de software.

---

## 17. Estado y Stateless

### Definición

- **Estado (Stateful)**: El sistema recuerda información de interacciones previas.
- **Sin Estado (Stateless)**: Cada petición es independiente y contiene toda la información necesaria.

### Por qué es fundamental

Las decisiones sobre gestión de estado afectan la escalabilidad, confiabilidad y complejidad del sistema. Los sistemas stateless son más fáciles de escalar.

**Analogía**:

- **Stateful**: Una conversación cara a cara donde recuerdas el contexto.
- **Stateless**: Intercambiar notas donde cada nota debe ser autocontenida.

**Importancia**: 8/10 - Crítico para arquitecturas distribuidas.

---

## 18. Sincronía vs Asincronía

### Definición

- **Síncrono**: El emisor espera la respuesta antes de continuar.
- **Asíncrono**: El emisor continúa sin esperar la respuesta inmediata.

### Por qué es fundamental

La comunicación asíncrona mejora el rendimiento y la resiliencia, pero añade complejidad. Es fundamental en arquitecturas modernas (eventos, mensajería).

**Analogía**:

- **Síncrono**: Llamada telefónica (esperas respuesta inmediata).
- **Asíncrono**: Email (envías y continúas con tu trabajo).

**Importancia**: 8/10 - Esencial para sistemas de alto rendimiento.

---

## 19. Monolito vs Distribuido

### Definición

- **Monolito**: Aplicación única donde todos los componentes se ejecutan en un solo proceso.
- **Distribuido**: Sistema donde los componentes se ejecutan en múltiples procesos/máquinas.

### Por qué es fundamental

Esta es una de las decisiones arquitectónicas más importantes. Cada enfoque tiene ventajas y desventajas significativas.

**Analogía**:

- **Monolito**: Una navaja suiza (todo en un solo lugar).
- **Distribuido**: Un set de herramientas especializadas (cada una en su caja).

**Importancia**: 9/10 - Define la topología fundamental del sistema.

---

## 20. Calidad de Software (Quality Attributes)

### Definición

Los **atributos de calidad** son características medibles o testables de un sistema que indican qué tan bien satisface las necesidades de los stakeholders. Incluyen: rendimiento, seguridad, mantenibilidad, usabilidad, etc.

### Por qué es fundamental

La arquitectura existe para satisfacer atributos de calidad. No diseñas arquitectura por arte; la diseñas para lograr objetivos específicos de calidad.

**Ejemplos clave**:

- **Mantenibilidad**: Facilidad para modificar el sistema
- **Seguridad**: Protección contra amenazas
- **Testabilidad**: Facilidad para probar el sistema
- **Usabilidad**: Facilidad de uso

**Importancia**: 10/10 - El propósito fundamental de la arquitectura.

---

## Resumen y Próximos Pasos

Has completado el **Módulo 0: Preconceptos Fundamentales**. Estos 20 conceptos son los cimientos sobre los que construirás tu conocimiento de arquitectura de software.

### Checklist de Dominio

Antes de continuar al Módulo 1, asegúrate de poder:

- [ ] Explicar la diferencia entre componente, interfaz y contrato
- [ ] Describir qué es acoplamiento y cohesión con ejemplos
- [ ] Distinguir entre arquitectura y diseño
- [ ] Explicar al menos 3 atributos de calidad
- [ ] Describir trade-offs comunes en arquitectura
- [ ] Explicar la diferencia entre sistemas stateful y stateless
- [ ] Describir comunicación síncrona vs asíncrona
- [ ] Explicar escalabilidad vertical vs horizontal

### Recursos Adicionales Recomendados

1. **Libro**: "Software Architecture in Practice" - Bass, Clements, Kazman
2. **Artículo**: "The Twelve-Factor App" (12factor.net)
3. **Video**: "Fundamentals of Software Architecture" - Mark Richards

---

**¡Felicidades!** Ahora estás listo para comenzar tu viaje hacia convertirte en un arquitecto de software experto. En el Módulo 1, aplicaremos estos conceptos para entender qué es realmente la arquitectura de software y el rol del arquitecto.
