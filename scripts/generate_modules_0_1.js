const fs = require("fs");
const path = require("path");
const {
  algebraKnowledge,
  getSubtemaContent,
  formatEjemplos,
  formatErroresComunes,
} = require("./algebra_knowledge");

// Configuración
const COURSE_DIR = "cursos/teach-laoz-curso-algebra-preuniversitaria";
const MODULOS_DIR = path.join(COURSE_DIR, "modulos");

// Agregar contenido faltante a la base de conocimiento
algebraKnowledge["0.2.1"] = {
  titulo: "Variables y constantes",
  conceptos: [
    "Variable: Símbolo (letra) que representa un número desconocido o cambiante",
    "Constante: Valor fijo que no cambia",
    "Coeficiente: Factor numérico que multiplica a una variable",
    "Término algebriaco: Producto de variables y constantes",
  ],
  ejemplos: [
    {
      problema: "Identificar elementos en 3x + 5",
      solucion: "Variable: x, Coeficiente: 3, Constante: 5",
      pasos: [
        "x es la letra -> Variable",
        "3 multiplica a x -> Coeficiente",
        "5 está solo -> Constante",
      ],
    },
    {
      problema: "Elementos en fórmula A = πr²",
      solucion: "Variables: A, r; Constante: π",
      pasos: ["A y r pueden cambiar", "π siempre vale ~3.1416"],
    },
  ],
  erroresComunes: [
    {
      error: "Confundir 2x con 2+x",
      correccion: "2x significa 2 multiplicado por x",
    },
    {
      error: "Pensar que x siempre vale lo mismo",
      correccion: "x es una variable, su valor depende del contexto o problema",
    },
  ],
};

algebraKnowledge["0.2.2"] = {
  titulo: "Evaluación de expresiones",
  conceptos: [
    "Sustitución: Reemplazar variables por valores numéricos dados",
    "Valor numérico: Resultado de realizar las operaciones tras la sustitución",
    "Uso de paréntesis al sustituir números negativos",
  ],
  ejemplos: [
    {
      problema: "Evaluar 2x + 3 para x = 5",
      solucion: "13",
      pasos: [
        "Sustituir x por 5: 2(5) + 3",
        "Multiplicar: 10 + 3",
        "Sumar: 13",
      ],
    },
    {
      problema: "Evaluar a² - b para a = 3, b = 4",
      solucion: "5",
      pasos: ["Sustituir: (3)² - 4", "Potencia: 9 - 4", "Resta: 5"],
    },
    {
      problema: "Evaluar 3x - y para x = -2, y = -1",
      solucion: "-5",
      pasos: [
        "Sustituir con paréntesis: 3(-2) - (-1)",
        "Operar: -6 + 1",
        "Resultado: -5",
      ],
    },
  ],
  erroresComunes: [
    {
      error: "No usar paréntesis con negativos: x² para x=-3 -> -3² = -9",
      correccion: "Usar paréntesis: (-3)² = 9",
    },
    {
      error: "Operar antes de sustituir incorrectamente",
      correccion:
        "Primero sustituye, luego sigue el orden de operaciones (PEMDAS)",
    },
  ],
};

// Lista de subtemas a generar
const subtemasAGenerar = [
  { mod: 0, tema: "0.1", sub: "0.1.1" },
  { mod: 0, tema: "0.1", sub: "0.1.2" },
  { mod: 0, tema: "0.2", sub: "0.2.1" },
  { mod: 0, tema: "0.2", sub: "0.2.2" },
  { mod: 1, tema: "1.1", sub: "1.1.1" },
  { mod: 1, tema: "1.1", sub: "1.1.2" },
  { mod: 1, tema: "1.1", sub: "1.1.3" },
  { mod: 1, tema: "1.2", sub: "1.2.1" },
  { mod: 1, tema: "1.2", sub: "1.2.2" },
  { mod: 1, tema: "1.2", sub: "1.2.3" },
];

function generateContent(moduloId, temaId, subtemaId) {
  const conocimiento = getSubtemaContent(subtemaId);
  if (!conocimiento) {
    console.error(`❌ No se encontró conocimiento para ${subtemaId}`);
    return;
  }

  const filename = `tema_${temaId}_subtema_${subtemaId}_contenido.md`;
  const filepath = path.join(MODULOS_DIR, `modulo_${moduloId}`, filename);

  // Asegurar que el directorio existe
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const content = `# ${conocimiento.titulo}

## Introducción

${
  conocimiento.titulo
} es un tema fundamental en este curso. Dominar estos conceptos te permitirá avanzar hacia problemas más complejos con confianza.

## Objetivos de Aprendizaje

Al finalizar este subtema, serás capaz de:
1. Comprender los conceptos clave de ${conocimiento.titulo.toLowerCase()}.
2. Resolver problemas aplicando las reglas y propiedades estudiadas.
3. Evitar errores comunes mediante la práctica consciente.

## Contenido Teórico

### Conceptos Fundamentales

${conocimiento.conceptos.map((c) => `- ${c}`).join("\n")}

### Desarrollo del Tema

Para entender ${conocimiento.titulo}, debemos analizar cada componente...
(Aquí se desarrollaría más teoría específica basada en los conceptos listados)

## Ejemplos Resueltos

${formatEjemplos(conocimiento.ejemplos)}

## Errores Comunes

${
  conocimiento.erroresComunes
    ? formatErroresComunes(conocimiento.erroresComunes)
    : "No se han registrado errores comunes críticos, pero mantén la atención en los cálculos básicos."
}

## Estrategias de Resolución

1. **Analizar el problema**: Identifica qué se pide y qué datos tienes.
2. **Identificar patrones**: Busca estructuras conocidas (como productos notables o tipos de factorización).
3. **Verificar paso a paso**: Revisa cada operación intermedia.

## Aplicaciones

Estos conceptos se utilizan en:
- Resolución de problemas de física y geometría.
- Modelado de situaciones cotidianas.
- Bases para cálculo y álgebra lineal.

## Resumen

- Hemos revisado: ${conocimiento.conceptos.slice(0, 3).join(", ")}.
- Recuerda practicar los ejemplos resueltos.
- La práctica constante es la clave del éxito.

`;

  fs.writeFileSync(filepath, content, "utf8");
  console.log(`✅ Contenido generado para ${subtemaId}: ${filename}`);
}

// Ejecutar generación
console.log("Iniciando generación de Módulos 0 y 1...");
subtemasAGenerar.forEach((item) => {
  generateContent(item.mod, item.tema, item.sub);
});
console.log("Generación completada.");
