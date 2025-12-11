const fs = require('fs');
const path = require('path');

const COURSE_DIR = "e:\\repositories\\teach-laoz-courses-generator\\cursos\\curso_arquitectura_software\\modulos";

function traverseAndFix(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseAndFix(fullPath);
        } else if (file.endsWith('.md')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Fix M4 (Falacias / Microservicios)
            // Was moved from 3.1 -> 4.1
            if (file.includes('tema_4.1') && content.includes('TEMA 3.1')) {
                content = content.replace(/TEMA 3\.1/g, 'TEMA 4.1');
            }
            if (file.includes('tema_4.2') && content.includes('TEMA 3.2')) {
                content = content.replace(/TEMA 3\.2/g, 'TEMA 4.2');
            }

            // Fix M6 (CAP / CQRS / Saga)
            // Was moved from 4.1 -> 6.1
            if (file.includes('tema_6.1') && file.includes('cap') && content.includes('TEMA 4.1')) {
                content = content.replace(/TEMA 4\.1/g, 'TEMA 6.1');
            }
            if (file.includes('tema_6.3') && content.includes('TEMA 4.3')) {
                content = content.replace(/TEMA 4\.3/g, 'TEMA 6.3');
            }
            if (file.includes('tema_6.4') && content.includes('TEMA 4.4')) {
                content = content.replace(/TEMA 4\.4/g, 'TEMA 6.4');
            }

            // Fix M7 (Resiliencia)
            // Was 6.1 -> 7.1
            if (file.includes('tema_7.1') && content.includes('TEMA 6.1')) {
                content = content.replace(/TEMA 6\.1/g, 'TEMA 7.1');
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed headers in ${file}`);
            }
        }
    });
}

traverseAndFix(COURSE_DIR);
console.log("Header cleanup complete.");
