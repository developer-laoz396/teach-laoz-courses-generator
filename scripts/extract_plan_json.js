const fs = require('fs');

// Leer el archivo plan_curricular.md
const content = fs.readFileSync('e:\\\\repositories\\\\teach-laoz-courses-generator\\\\cursos\\\\curso_arquitectura_software\\\\plan_curricular.md', 'utf8');

// Encontrar el JSON al final del archivo
const jsonStart = content.indexOf('[');
const jsonEnd = content.lastIndexOf(']') + 1;

if (jsonStart > 0 && jsonEnd > jsonStart) {
    const jsonStr = content.substring(jsonStart, jsonEnd);
    // Guardar el JSON extraído
    fs.writeFileSync('e:\\\\repositories\\\\teach-laoz-courses-generator\\\\cursos\\\\curso_arquitectura_software\\\\structure.json', jsonStr, 'utf8');
    console.log('JSON extracted to structure.json');
    console.log('Length:', jsonStr.length);
} else {
    console.error('No JSON found in file');
}
