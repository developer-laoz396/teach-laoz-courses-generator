const fs = require('fs');
const path = require('path');

const courseDir = 'e:\\repositories\\teach-laoz-courses-generator\\cursos\\curso_comunicacion_tecnica_efectiva';
const planPath = path.join(courseDir, 'plan_curricular.md');
const structurePath = path.join(courseDir, 'structure.json');

try {
  const content = fs.readFileSync(planPath, 'utf8');

  // Attempt to find the JSON array. usually it is at the end of the file.
  // We look for the last occurrence of specific keys to anchor or just parse the last block.
  // A safer bet if it's a code block:
  // content.match(/```json([\s\S]*?)```/);
  
  // Strategy: Find the start of the JSON array. 
  // Often these files end with the raw JSON or a code block containing it.
  
  let jsonStr = '';
  
  const jsonBlockRegex = /```json\s*(\[\s*\{[\s\S]*\}\s*\])\s*```/;
  const match = content.match(jsonBlockRegex);
  
  if (match && match[1]) {
      jsonStr = match[1];
  } else {
      // Fallback: Try to find the first '[' that starts the array structure if not in code block,
      // but risky if text has '['.
      // Let's looks for the specific marker usually present "Estructura para structure.json"
      const marker = "structure.json";
      const markerIdx = content.indexOf(marker);
      if (markerIdx !== -1) {
          const start = content.indexOf('[', markerIdx);
          const end = content.lastIndexOf(']') + 1;
          jsonStr = content.substring(start, end);
      } else {
           // Last resort: find the last pair of [] that looks like the main array
           const start = content.indexOf('[');
           const end = content.lastIndexOf(']') + 1;
           jsonStr = content.substring(start, end);
      }
  }

  // Verify valid JSON
  JSON.parse(jsonStr);

  fs.writeFileSync(structurePath, jsonStr, 'utf8');
  console.log('✓ structure.json generated successsfully');
  console.log('  Path:', structurePath);

} catch (error) {
  console.error('Error extracting JSON:', error.message);
  process.exit(1);
}
