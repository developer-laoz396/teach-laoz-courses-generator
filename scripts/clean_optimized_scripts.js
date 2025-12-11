const fs = require('fs');
const path = require('path');

const targetDir = 'e:\\repositories\\teach-laoz-courses-generator\\cursos\\teach-laoz-curso_optimizacion_entrenamientos';

function cleanFiles(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Directory not found: ${dir}`);
        return;
    }
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            cleanFiles(fullPath);
        } else if (file.endsWith('_guion_optimizada.txt')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // 1. Remove "Personaje: Entrenador Experto." (case insensitive)
            content = content.replace(/Personaje:\s*Entrenador\s*Experto\.?/gi, '');

            // 2. Remove timecodes (00:00 - 00:30) and (02:00 - Ends)
            content = content.replace(/\(\d{1,2}:\d{2}\s*-\s*(\d{1,2}:\d{2}|Ends?)\)/gi, '');

            // 3. Remove "LOCUTOR:" variants (bold, brackets, etc)
            content = content.replace(/\*\*\[LOCUTOR\]\*\*:/gi, '');
            content = content.replace(/\[LOCUTOR\]:/gi, '');
            content = content.replace(/LOCUTOR:/gi, '');
            content = content.replace(/^LOCUTOR\s*$/gim, ''); // LOCUTOR on its own line

            // 4. Remove extra newlines that might have been left behind
            content = content.replace(/\n{3,}/g, '\n\n');
            content = content.trim();

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Cleaned: ${file}`);
            }
        }
    });
}

console.log("Starting cleanup process...");
cleanFiles(targetDir);
console.log("Cleanup complete.");
