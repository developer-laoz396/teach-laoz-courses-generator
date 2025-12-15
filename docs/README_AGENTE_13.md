# SISTEMA DE VERIFICACIÓN DE INTEGRIDAD Y REFERENCIAS

## Visión General

El **Agente 13: Verificador de Integridad** es un componente crítico del pipeline de producción de cursos que garantiza la credibilidad académica y técnica del contenido generado. Este agente opera después de la integración del curso pero antes de la generación del PDF final.

---

## ¿Qué hace el Agente 13?

### 1. Verificación de Integridad del Contenido

- Analiza cada tema y subtema del curso
- Detecta afirmaciones técnicas que requieren sustento
- Identifica información potencialmente desactualizada
- Valida la precisión de ejemplos de código y conceptos

### 2. Búsqueda de Referencias Académicas/Técnicas

- Encuentra **3 referencias reales y actuales** por cada tema
- Prioriza fuentes de alta calidad:
  - Documentación oficial
  - Publicaciones académicas (IEEE, ACM)
  - Libros técnicos de autores reconocidos
  - Artículos técnicos de autoridad
- Valida la actualidad (preferencia por 2022-2025)

### 3. Generación de Documentación de Referencias

- Crea `REFERENCIAS.md`: Documento completo con todas las referencias
- Crea `REPORTE_VERIFICACION.md`: Evaluación ejecutiva de calidad
- Proporciona feedback accionable para mejoras

---

## ¿Cuándo se ejecuta?

El Agente 13 se ejecuta en la **Fase 4** del proceso de producción:

```
FASE 1: Planificación (Agente 1)
    ↓
FASE 1.5: Nivelación (Agente 12)
    ↓
FASE 2: Producción de Contenido (Agentes 2, 3, 7, 8, 9)
    ↓
FASE 3: Enriquecimiento (Agentes 4, 6, 11)
    ↓
FASE 4: Integración (Agente 5)
    ↓
FASE 4.1: VERIFICACIÓN ⭐ (Agente 13) ← NUEVO
    ↓
FASE 4.2: Generación PDF (Agente 10)
```

---

## ¿Cómo se llama al Agente 13?

### Desde el Agente 0 (Manager)

```markdown
Llama al **Agente 13** con el siguiente contexto:

**INPUT**:

- Ruta del curso: `cursos/teach-laoz-curso-[nombre]/`
- Lista de módulos y temas generados
- Contexto del curso (título, complejidad, audiencia, fecha)

**OBJETIVO**:
Verificar la integridad de todo el contenido generado y producir:

1. Documento de referencias académicas/técnicas (3 referencias por tema)
2. Reporte de verificación con métricas de calidad
```

### Ejemplo de Llamada

```javascript
// En scripts/generate_course_content.js
const verificarIntegridad = async (cursoPath, modulos, contexto) => {
  const agente13 = loadWorkflow("13-verificador-integridad.md");

  const resultado = await agente13.ejecutar({
    curso_path: cursoPath,
    modulos: modulos,
    contexto_curso: contexto,
  });

  return resultado;
};
```

---

## Salidas Generadas

### 1. REFERENCIAS.md

Documento estructurado que contiene:

- **Resumen Ejecutivo**: Métricas generales de verificación
- **Referencias por Módulo y Tema**: 3 referencias por cada tema con:
  - Tipo de fuente
  - Autor/Institución
  - Año de publicación
  - URL verificada
  - Relevancia para el tema
  - Cita textual clave
- **Estado de Integridad**: Validación, advertencias o errores detectados
- **Apéndices**:
  - Índice de referencias por tipo
  - Recomendaciones de mejora
  - Metodología de verificación

### 2. REPORTE_VERIFICACION.md

Reporte ejecutivo que incluye:

- **Métricas de Calidad**: Estadísticas de verificación
- **Estado de Integridad Global**: Evaluación por módulo
- **Acciones Requeridas**: Priorizadas por importancia
- **Índice de Confiabilidad**: Puntuación global y por criterio
- **Conclusión y Recomendación Final**: Aprobación o sugerencias

---

## Criterios de Calidad de Referencias

### Fuentes Prioritarias (en orden)

1. **Documentación Oficial** ⭐⭐⭐⭐⭐

   - Sitios oficiales de tecnologías, frameworks, lenguajes
   - Ejemplo: docs.microsoft.com, developer.mozilla.org

2. **Publicaciones Académicas** ⭐⭐⭐⭐⭐

   - Papers en IEEE, ACM, journals reconocidos
   - Ejemplo: ACM Digital Library, IEEE Xplore

3. **Libros Técnicos** ⭐⭐⭐⭐

   - Autores reconocidos (Martin Fowler, Robert C. Martin, etc.)
   - Editoriales de prestigio (O'Reilly, Manning, Packt)

4. **Blogs Técnicos de Autoridad** ⭐⭐⭐⭐

   - Engineering blogs de empresas líderes
   - Artículos de expertos reconocidos en Medium
   - Ejemplo: Netflix Tech Blog, Google Developers

5. **Repositorios Oficiales** ⭐⭐⭐
   - GitHub oficial de proyectos
   - Documentos RFC
   - Ejemplo: github.com/facebook/react

### Criterios de Actualidad

| Año       | Prioridad  | Uso                          |
| --------- | ---------- | ---------------------------- |
| 2024-2025 | ⭐⭐⭐⭐⭐ | Preferente                   |
| 2022-2023 | ⭐⭐⭐⭐   | Aceptable                    |
| 2020-2021 | ⭐⭐⭐     | Conceptos fundamentales      |
| 2018-2019 | ⭐⭐       | Solo para contexto histórico |
| < 2018    | ⭐         | Evitar (excepto clásicos)    |

---

## Ejemplo de Uso Completo

Ver: [EJEMPLO_AGENTE_13.md](./EJEMPLO_AGENTE_13.md)

Este archivo contiene un ejemplo completo de:

- Input al Agente 13
- Proceso de verificación paso a paso
- Output generado (REFERENCIAS.md completo)
- Output generado (REPORTE_VERIFICACION.md)
- Comunicación con el Agente 0

---

## Métricas de Éxito

Un curso verificado por el Agente 13 debe lograr:

| Métrica                 | Objetivo      | Excelente |
| ----------------------- | ------------- | --------- |
| Referencias por tema    | 3             | 3         |
| Índice de actualidad    | ≥ 60% (2022+) | ≥ 80%     |
| Errores críticos        | 0             | 0         |
| Fuentes de alta calidad | ≥ 50%         | ≥ 70%     |
| Puntuación global       | ≥ 7.0/10      | ≥ 8.5/10  |

---

## Beneficios del Sistema de Verificación

### Para el Contenido del Curso

✅ **Credibilidad Académica**: Cada afirmación está respaldada por fuentes verificadas  
✅ **Actualidad**: Se garantiza que el contenido refleja las mejores prácticas actuales  
✅ **Calidad**: Se detectan y corrigen errores antes de la publicación  
✅ **Profundidad**: Se identifican áreas que requieren mayor desarrollo

### Para los Estudiantes

✅ **Confianza**: Saben que el contenido está sustentado académicamente  
✅ **Referencias Adicionales**: Pueden profundizar con las fuentes originales  
✅ **Aprendizaje Continuo**: Las referencias les permiten seguir investigando

### Para los Instructores/Autores

✅ **Retroalimentación**: Reciben evaluación objetiva de la calidad del contenido  
✅ **Mejora Continua**: Identifican áreas específicas para actualizar  
✅ **Documentación**: Tienen un registro completo de las fuentes utilizadas

---

## Integración con el Flujo de Trabajo

### Antes del Agente 13

```bash
# Genera el curso completo
npm run generate-course

# Salida:
# ├── plan_curricular.md
# ├── modulos/
# │   ├── modulo_0/
# │   ├── modulo_1/
# │   └── ...
# └── CURSO_COMPLETO.md
```

### Durante el Agente 13

```bash
# El Agente 0 llama automáticamente al Agente 13
# No requiere intervención manual
```

### Después del Agente 13

```bash
# Archivos adicionales generados:
# ├── REFERENCIAS.md           ← NUEVO
# ├── REPORTE_VERIFICACION.md  ← NUEVO
# └── CURSO_COMPLETO.md

# Si hay errores críticos:
# El Agente 0 llama a los agentes necesarios para corregir

# Si todo está bien:
# Procede a generar el PDF final
```

---

## Configuración

El Agente 13 se configura automáticamente en el archivo `.env` del curso:

```env
# Ruta al Workflow del Agente 13
WORKFLOW_PATH_VERIFICADOR_INTEGRIDAD="../../.agent/workflows/13-verificador-integridad.md"
```

---

## Preguntas Frecuentes

### ¿El Agente 13 puede inventar referencias?

❌ **NO**. El Agente 13 tiene **PROHIBIDO** inventar referencias. Todas las referencias deben ser reales, verificables y con URLs funcionales.

### ¿Qué pasa si no encuentra 3 referencias para un tema?

Si no puede encontrar 3 referencias de calidad, el Agente 13:

1. Lo reporta en el REPORTE_VERIFICACION.md
2. Marca el tema con ⚠️ advertencia
3. Sugiere al Agente 0 simplificar o reformular el tema

### ¿Puede usar Wikipedia como referencia?

Wikipedia puede usarse como **referencia complementaria**, pero NO como referencia principal. Máximo 1 enlace a Wikipedia de los 3 por tema.

### ¿Qué sucede si detecta errores críticos?

El Agente 13:

1. Documenta los errores en el REPORTE_VERIFICACION.md
2. Los marca con ❌ en el estado de integridad
3. Sugiere al Agente 0 llamar al agente correspondiente para corregir
4. **NO aprueba** el curso para publicación hasta que se corrijan

### ¿Con qué frecuencia debe ejecutarse?

- **Inicial**: Al completar la primera versión del curso
- **Periódica**: Cada 6 meses (las tecnologías evolucionan)
- **Actualización**: Cuando se modifica contenido de módulos existentes

---

## Roadmap Futuro

### Versión 1.1 (Planificada)

- [ ] Integración con APIs de búsqueda académica (Google Scholar, Semantic Scholar)
- [ ] Verificación automática de disponibilidad de URLs
- [ ] Detección de plagio comparando con fuentes

### Versión 1.2 (Planificada)

- [ ] Generación automática de bibliografía en formato APA, MLA, IEEE
- [ ] Exportación de referencias a gestores bibliográficos (Zotero, Mendeley)
- [ ] Análisis de cobertura de referencias por tipo

### Versión 2.0 (Futuro)

- [ ] IA que valida la precisión técnica del contenido contra las referencias
- [ ] Sugerencia automática de mejoras basadas en las referencias encontradas
- [ ] Integración con sistemas de revisión por pares

---

## Soporte y Contribuciones

Para reportar problemas o sugerir mejoras al Agente 13:

1. Revisa el archivo [13-verificador-integridad.md](./13-verificador-integridad.md)
2. Consulta el [EJEMPLO_AGENTE_13.md](./EJEMPLO_AGENTE_13.md) para casos de uso
3. Abre un issue describiendo el problema o sugerencia

---

**Última actualización**: 2025-12-15  
**Versión del Agente 13**: 1.0  
**Mantenedor**: Sistema de Producción de Cursos Teach Laoz
