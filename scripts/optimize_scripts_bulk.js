const fs = require('fs');
const path = require('path');

const courseDir = 'e:\\repositories\\teach-laoz-courses-generator\\cursos\\teach-laoz-curso_optimizacion_entrenamientos';

function optimizeText(content) {
    let text = content;

    // 1. Remove Headers (#, ##, ###)
    text = text.replace(/^#+\s+.*$/gm, '');

    // 2. Remove Metadata/Frontmatter (--- ... ---) - simplistic approach
    // Often there's a frontmatter block at the start, or metadata sections.
    // We'll remove specific metadata lines if they persist.
    text = text.replace(/\*\*Duración Estimada\*\*.*$/gim, '');
    text = text.replace(/\*\*Tono\*\*.*$/gim, '');
    text = text.replace(/\*\*Conceptos\*\*.*$/gim, '');
    text = text.replace(/- \*\*.*\*\*.*$/gim, ''); // Remove list items like "- **Duración**..."

    // 3. Remove Separators
    text = text.replace(/^---$/gm, '');

    // 4. Remove Timecodes/Section headers (e.g., ### 00:00 - INTRODUCCIÓN)
    text = text.replace(/^###\s+\[?[\d:]+\]?.*$/gm, '');

    // 5. Remove Locutor tags (**[LOCUTOR]**:)
    text = text.replace(/^\*\*\[LOCUTOR\]\*\*.*$/gm, '');

    // 6. Remove Direction Notes (_(Nota...)_, _[MOSTRAR...]_)
    text = text.replace(/_\(.*?\)_/g, '');
    text = text.replace(/_\[.*?\]_/g, '');

    // 7. Cleanup Markdown formatting
    text = text.replace(/\*\*/g, ''); // Bold
    text = text.replace(/\*/g, '');   // Italic (if single *) - careful not to remove all * if used for other things, but usually OK in this context to remove all markdown symbols.
    // Actually, bullets might be useful to keep as pauses? No, prompt said "Elimina listas".
    text = text.replace(/^- /gm, ''); // Lists

    // 8. Normalize whitespace
    // Replace multiple newlines with a single paragraph break if needed, 
    // but we want "puntos y aparte para dividir secciones".
    // Let's condense multiple newlines to 2 newlines.
    text = text.replace(/\n\s*\n/g, '\n\n');
    
    // Trim each line
    text = text.split('\n').map(line => line.trim()).filter(line => line.length > 0).join('\n\n');

    return text;
}

function processDirectory(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('_guion.md')) {
            console.log(`Processing: ${file}`);
            const content = fs.readFileSync(fullPath, 'utf8');
            const optimized = optimizeText(content);
            const outputPath = fullPath.replace('_guion.md', '_guion_optimizada.txt');
            fs.writeFileSync(outputPath, optimized, 'utf8');
        }
    });
}

console.log('Starting bulk script optimization...');
processDirectory(courseDir);
console.log('Done.');
