const fs = require('fs');
const path = require('path');

// Cargar la estructura del curso
const structurePath = 'e:\\repositories\\teach-laoz-courses-generator\\temp_structure.json';
const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));

const baseDir = 'e:\\repositories\\teach-laoz-courses-generator\\cursos\\curso_arquitectura_software';
const outputFile = path.join(baseDir, 'CURSO_COMPLETO.md');

// Función para leer un archivo de contenido
function readFile(filepath) {
  try {
    if (fs.existsSync(filepath)) {
      return fs.readFileSync(filepath, 'utf8');
    }
    return null;
  } catch (error) {
    console.error(`Error leyendo ${filepath}: ${error.message}`);
    return null;
  }
}

// Generar el curso completo
let cursoCompleto = `# CURSO COMPLETO: ARQUITECTURA DE SOFTWARE AVANZADA

**De 0 a Experto**

---

## TABLA DE CONTENIDOS

`;

// Generar índice
structure.forEach(modulo => {
  cursoCompleto += `### ${modulo.titulo}\n`;
  modulo.temas.forEach(tema => {
    cursoCompleto += `- [Tema ${tema.id}: ${tema.nombre}](#tema-${tema.id.replace('.', '')})\n`;
  });
  cursoCompleto += '\n';
});

cursoCompleto += `---

`;

// Agregar contenido de cada módulo
structure.forEach(modulo => {
  cursoCompleto += `\n\n# MÓDULO ${modulo.id}: ${modulo.titulo}\n\n`;
  
  if (modulo.objetivo) {
    cursoCompleto += `**Objetivo del Módulo**: ${modulo.objetivo}\n\n`;
  }

  cursoCompleto += `---\n\n`;

  modulo.temas.forEach(tema => {
    const moduloDir = path.join(baseDir, 'modulos', modulo.modulo);
    const temaBase = `tema_${tema.id}_${tema.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
    
    // Leer contenido
    const contenidoPath = path.join(moduloDir, `${temaBase}_contenido.md`);
    const ejerciciosPath = path.join(moduloDir, `${temaBase}_ejercicios.md`);
    const evaluacionPath = path.join(moduloDir, `${temaBase}_evaluacion.md`);

    const contenido = readFile(contenidoPath);
    const ejercicios = readFile(ejerciciosPath);
    const evaluacion = readFile(evaluacionPath);

    if (contenido) {
      cursoCompleto += `${contenido}\n\n`;
      cursoCompleto += `---\n\n`;
    } else {
      console.warn(`⚠ No se encontró contenido para ${tema.id}`);
    }

    if (ejercicios) {
      cursoCompleto += `${ejercicios}\n\n`;
      cursoCompleto += `---\n\n`;
    }

    if (evaluacion) {
      cursoCompleto += `${evaluacion}\n\n`;
      cursoCompleto += `---\n\n`;
    }
  });
});

// Agregar pie de página
cursoCompleto += `\n\n---

## FIN DEL CURSO

¡Felicitaciones por completar el curso de Arquitectura de Software Avanzada!

### Próximos Pasos

1. **Practica**: Aplica estos conceptos en proyectos reales
2. **Profundiza**: Lee los papers y recursos recomendados
3. **Comparte**: Enseña estos conceptos a tu equipo
4. **Evoluciona**: La arquitectura es un campo en constante cambio

### Recursos Adicionales

- [Software Architecture in Practice](https://www.amazon.com/Software-Architecture-Practice-3rd-Engineering/dp/0321815734)
- [Building Microservices](https://www.amazon.com/Building-Microservices-Designing-Fine-Grained-Systems/dp/1491950358)
- [Clean Architecture](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)

---

**Generado**: ${new Date().toISOString()}
`;

// Escribir el archivo
fs.writeFileSync(outputFile, cursoCompleto, 'utf8');

console.log(`✓ CURSO_COMPLETO.md generado exitosamente`);
console.log(`  Ubicación: ${outputFile}`);
console.log(`  Tamaño: ${(cursoCompleto.length / 1024).toFixed(2)} KB`);
console.log(`  Módulos: ${structure.length}`);
console.log(`  Temas: ${structure.reduce((acc, m) => acc + m.temas.length, 0)}`);
