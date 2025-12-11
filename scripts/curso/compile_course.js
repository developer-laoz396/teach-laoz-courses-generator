const fs = require('fs');
const path = require('path');

const courseDir = process.argv[2];
if (!courseDir) {
    console.error("Please provide course directory.");
    process.exit(1);
}

const outputFile = path.join(courseDir, 'CURSO_COMPLETO.md');
let fullContent = `# CURSO COMPLETO\n\n`;

// 1. Preconceptos
const preconceptosPath = path.join(courseDir, 'tema_0.1_preconceptos.md');
if (fs.existsSync(preconceptosPath)) {
    fullContent += fs.readFileSync(preconceptosPath, 'utf8') + "\n\n---\n\n";
}

// 2. Modulos
const modulosDir = path.join(courseDir, 'modulos');
if (fs.existsSync(modulosDir)) {
    const modulos = fs.readdirSync(modulosDir).sort();
    modulos.forEach(modulo => {
        const moduloPath = path.join(modulosDir, modulo);
        if (fs.statSync(moduloPath).isDirectory()) {
            fullContent += `# ${modulo.toUpperCase().replace('_', ' ')}\n\n`;
            
            const files = fs.readdirSync(moduloPath).sort();
            files.forEach(file => {
                if (file.endsWith('.md')) {
                    const content = fs.readFileSync(path.join(moduloPath, file), 'utf8');
                    fullContent += content + "\n\n---\n\n";
                }
            });
        }
    });
}

// 3. Recursos Visuales
const diagramasPath = path.join(courseDir, 'recursos_visuales', 'recursos_visuales_diagramas.md');
if (fs.existsSync(diagramasPath)) {
    fullContent += `# RECURSOS VISUALES\n\n` + fs.readFileSync(diagramasPath, 'utf8') + "\n\n";
}

fs.writeFileSync(outputFile, fullContent);
console.log(`Generated ${outputFile}`);
