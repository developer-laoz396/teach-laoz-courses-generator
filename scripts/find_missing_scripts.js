const fs = require('fs');
const path = require('path');

const courseDir = 'e:\\repositories\\teach-laoz-courses-generator\\cursos\\teach-laoz-curso_optimizacion_entrenamientos\\modulos';

function findMissing(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findMissing(fullPath);
    } else if (item.endsWith('_contenido.md')) {
      const guionName = item.replace('_contenido.md', '_guion.md');
      const guionPath = path.join(dir, guionName);
      if (!fs.existsSync(guionPath)) {
        console.log(guionPath);
      }
    }
  });
}

findMissing(courseDir);
