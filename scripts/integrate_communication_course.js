const fs = require('fs');
const path = require('path');

// Configuration
const courseDir = 'e:\\repositories\\teach-laoz-courses-generator\\cursos\\curso_comunicacion_tecnica_efectiva';
const structurePath = path.join(courseDir, 'structure.json');
const outputFile = path.join(courseDir, 'CURSO_COMPLETO.md');

// Load structure
if (!fs.existsSync(structurePath)) {
  console.error('structure.json not found!');
  process.exit(1);
}
const structure = JSON.parse(fs.readFileSync(structurePath, 'utf8'));

// Helper to read file
function readFile(filepath) {
  try {
    if (fs.existsSync(filepath)) {
      return fs.readFileSync(filepath, 'utf8');
    }
    return null;
  } catch (error) {
    console.warn(`Error reading ${filepath}: ${error.message}`);
    return null;
  }
}

// Start generating content
let cursoCompleto = `# CURSO COMPLETO: COMUNICACIÓN TÉCNICA EFECTIVA

**De 0 a Experto**

---

## TABLA DE CONTENIDOS

`;

// Generate Index
structure.forEach(modulo => {
  cursoCompleto += `### ${modulo.titulo}\n`;
  if (modulo.temas) {
      modulo.temas.forEach(tema => {
        const temaIdSanitized = tema.tema_id ? tema.tema_id.replace(/\./g, '') : '';
        cursoCompleto += `- [Tema ${tema.tema_id}: ${tema.titulo}](#tema-${temaIdSanitized})\n`;
      });
  }
  cursoCompleto += '\n';
});

cursoCompleto += `---

`;

// Append Module Content
structure.forEach(modulo => {
  cursoCompleto += `\n\n# MÓDULO ${modulo.modulo_id}: ${modulo.titulo}\n\n`;
  
  if (modulo.objetivo) {
    cursoCompleto += `**Objetivo**: ${modulo.objetivo}\n\n`;
  }

  cursoCompleto += `---\n\n`;

  if (modulo.temas) {
  if (modulo.temas) {
      modulo.temas.forEach(tema => {
        cursoCompleto += `### Tema ${tema.tema_id}: ${tema.titulo}\n\n`;
        
        if (tema.subtemas && tema.subtemas.length > 0) {
            tema.subtemas.forEach(subtema => {
                cursoCompleto += `#### Subtema ${subtema.subtema_id}: ${subtema.titulo}\n\n`;

                const moduloDirName = `modulo_${modulo.modulo_id}`;
                const moduloDir = path.join(courseDir, 'modulos', moduloDirName);
                
                // Pattern: tema_1.1_subtema_1.1.1_contenido.md
                // We'll search for files containing the subtopic ID to be safe
                let match = null;

                try {
                    if (fs.existsSync(moduloDir)) {
                        const files = fs.readdirSync(moduloDir);
                        // Search for file starting with tema_[TopicID]_subtema_[SubtopicID]
                        // Note: subtema.subtema_id might be "1.1.1"
                        match = files.find(f => f.includes(`subtema_${subtema.subtema_id}_`) && f.endsWith('_contenido.md'));
                    }
                } catch (e) {
                    console.warn(`Error scanning dir for ${subtema.subtema_id}`);
                }

                if (match) {
                     const contenido = readFile(path.join(moduloDir, match));
                     if (contenido) {
                         cursoCompleto += `${contenido}\n\n`;
                     }

                     const baseMatch = match.replace('_contenido.md', '');
                     const ej = readFile(path.join(moduloDir, `${baseMatch}_ejercicios.md`));
                     if (ej) {
                         cursoCompleto += `**Ejercicios del Subtema**\n\n${ej}\n\n`;
                     }
                     
                     const ev = readFile(path.join(moduloDir, `${baseMatch}_evaluacion.md`));
                     if (ev) {
                         cursoCompleto += `**Evaluación del Subtema**\n\n${ev}\n\n`;
                     }

                     cursoCompleto += `---\n\n`;

                } else {
                     console.log(`[MISSING] Content for Subtopic ${subtema.subtema_id}`);
                     cursoCompleto += `*(Contenido pendiente para ${subtema.titulo})*\n\n---\n\n`;
                }
            });
        } else {
             // Fallback if no subtopics defined but content exists at topic level (unlikely based on file list but possible)
             // ... logic omitted for brevity as file listing showed subtheme pattern
        }
      });
  }
  }
});

// Footer
cursoCompleto += `\n\n---
## FIN DEL CURSO
**Generado**: ${new Date().toISOString()}
`;

fs.writeFileSync(outputFile, cursoCompleto, 'utf8');
console.log(`✓ CURSO_COMPLETO.md generated at ${outputFile}`);
