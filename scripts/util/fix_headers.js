const fs = require('fs');
const path = require('path');

const COURSE_DIR = "e:\\repositories\\teach-laoz-courses-generator\\cursos\\curso_arquitectura_software\\modulos";

function traverseAndFix(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverseAndFix(fullPath);
        } else if (file.endsWith('.md')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Logic driven by filename
            if (file.includes('tema_3.1')) { // Was 4.1
                content = content.replace(/TEMA 4\.1/g, 'TEMA 3.1');
            }
            if (file.includes('tema_3.2')) { // Was 4.2
                content = content.replace(/TEMA 4\.2/g, 'TEMA 3.2');
            }
            if (file.includes('tema_4.1')) { // Was 6.1
                content = content.replace(/TEMA 6\.1/g, 'TEMA 4.1');
            }
            if (file.includes('tema_4.3')) { // Was 6.3
                content = content.replace(/TEMA 6\.3/g, 'TEMA 4.3');
            }
            if (file.includes('tema_4.4')) { // Was 6.4
                content = content.replace(/TEMA 6\.4/g, 'TEMA 4.4');
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log(`Fixed headers in ${file}`);
            }
        }
    });
}

traverseAndFix(COURSE_DIR);
console.log("Header fix complete.");
