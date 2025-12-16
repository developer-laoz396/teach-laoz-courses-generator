/**
 * BASE DE CONOCIMIENTO: ÁLGEBRA PRE-UNIVERSITARIA
 * 
 * Contenido específico por subtema para generación automática
 */

const algebraKnowledge = {
  // Módulo 0: Diagnóstico y Nivelación
  "0.1.1": {
    titulo: "Operaciones con números reales",
    conceptos: [
      "Números naturales, enteros, racionales e irracionales",
      "Operaciones básicas: suma, resta, multiplicación, división",
      "Reglas de signos en operaciones",
      "Orden de operaciones (PEMDAS/BODMAS)",
      "Propiedades: conmutativa, asociativa, distributiva"
    ],
    ejemplos: [
      { problema: "(-8) + 12 ÷ (-3) × 2", solucion: "-16", pasos: ["12 ÷ (-3) = -4", "(-4) × 2 = -8", "(-8) + (-8) = -16"] },
      { problema: "3 + 2 × (8 - 3)² ÷ 5", solucion: "13", pasos: ["(8-3) = 5", "5² = 25", "2×25 = 50", "50÷5 = 10", "3+10 = 13"] },
      { problema: "1/2 + 3/4 × 2/3", solucion: "1", pasos: ["3/4 × 2/3 = 6/12 = 1/2", "1/2 + 1/2 = 1"] }
    ],
    erroresComunes: [
      { error: "Ignorar orden de operaciones: 3 + 2 × 5 = 25", correccion: "Multiplicar primero: 3 + 10 = 13" },
      { error: "Confundir signos: (-3) × (-4) = -12", correccion: "Signos iguales dan positivo: (-3) × (-4) = 12" }
    ]
  },
  
  "0.1.2": {
    titulo: "Propiedades de los números",
    conceptos: [
      "Propiedad conmutativa: a + b = b + a",
      "Propiedad asociativa: (a + b) + c = a + (b + c)",
      "Propiedad distributiva: a(b + c) = ab + ac",
      "Elemento neutro: a + 0 = a, a × 1 = a",
      "Elemento inverso: a + (-a) = 0, a × (1/a) = 1"
    ],
    ejemplos: [
      { problema: "5 × (3 + 7)", solucion: "50", metodos: ["Distributiva: 5×3 + 5×7 = 15 + 35 = 50", "Directa: 5×10 = 50"] },
      { problema: "2 × 17 + 8 × 17", solucion: "170", pasos: ["Factor común: 17(2 + 8)", "17 × 10 = 170"] }
    ]
  },

  // Módulo 1: Expresiones Algebraicas
  "1.1.1": {
    titulo: "Suma y resta de expresiones algebraicas",
    conceptos: [
      "Términos semejantes: misma parte literal",
      "Coeficiente numérico y parte literal",
      "Reducción de términos semejantes",
      "Signos en expresiones algebraicas"
    ],
    ejemplos: [
      { problema: "3x + 5x - 2x", solucion: "6x", pasos: ["(3 + 5 - 2)x", "6x"] },
      { problema: "2x² + 3x - 5x² + 7x", solucion: "-3x² + 10x", pasos: ["2x² - 5x² = -3x²", "3x + 7x = 10x", "-3x² + 10x"] },
      { problema: "4a + 3b - 2a + 5b", solucion: "2a + 8b", pasos: ["4a - 2a = 2a", "3b + 5b = 8b", "2a + 8b"] }
    ],
    erroresComunes: [
      { error: "Sumar términos no semejantes: 2x + 3y = 5xy", correccion: "No se pueden sumar: 2x + 3y" },
      { error: "Ignorar signos: 3x - 5x = 8x", correccion: "3x - 5x = -2x" }
    ]
  },

  "1.1.2": {
    titulo: "Multiplicación de expresiones",
    conceptos: [
      "Propiedad distributiva: a(b + c) = ab + ac",
      "Multiplicación de monomios: (ax^m)(bx^n) = abx^(m+n)",
      "Multiplicación de polinomios",
      "Leyes de exponentes"
    ],
    ejemplos: [
      { problema: "3x × 4x²", solucion: "12x³", pasos: ["3 × 4 = 12", "x × x² = x³", "12x³"] },
      { problema: "2x(3x + 5)", solucion: "6x² + 10x", pasos: ["2x × 3x = 6x²", "2x × 5 = 10x", "6x² + 10x"] },
      { problema: "(x + 3)(x + 2)", solucion: "x² + 5x + 6", pasos: ["x×x = x²", "x×2 + 3×x = 5x", "3×2 = 6", "x² + 5x + 6"] }
    ]
  },

  "1.1.3": {
    titulo: "División de polinomios",
    conceptos: [
      "División de monomios: ax^m ÷ bx^n = (a/b)x^(m-n)",
      "División larga de polinomios",
      "División sintética (Ruffini)",
      "Teorema del residuo"
    ],
    ejemplos: [
      { problema: "12x⁵ ÷ 3x²", solucion: "4x³", pasos: ["12 ÷ 3 = 4", "x⁵ ÷ x² = x³", "4x³"] },
      { problema: "(x² + 5x + 6) ÷ (x + 2)", solucion: "x + 3", metodo: "division_larga" },
      { problema: "(2x³ - 3x² + 4x - 5) ÷ (x - 1)", solucion: "2x² - x + 3, residuo: -2", metodo: "ruffini" }
    ]
  },

  // Productos Notables
  "1.2.1": {
    titulo: "Binomio al cuadrado",
    conceptos: [
      "(a + b)² = a² + 2ab + b²",
      "(a - b)² = a² - 2ab + b²",
      "Identificación de términos: primer término, segundo término, doble producto"
    ],
    ejemplos: [
      { problema: "(x + 5)²", solucion: "x² + 10x + 25", pasos: ["a² = x²", "2ab = 2(x)(5) = 10x", "b² = 25", "x² + 10x + 25"] },
      { problema: "(2x - 3)²", solucion: "4x² - 12x + 9", pasos: ["a² = (2x)² = 4x²", "2ab = 2(2x)(-3) = -12x", "b² = 9", "4x² - 12x + 9"] },
      { problema: "(3a + 4b)²", solucion: "9a² + 24ab + 16b²", pasos: ["9a² + 2(3a)(4b) + 16b²"] }
    ],
    erroresComunes: [
      { error: "(x + 3)² = x² + 9", correccion: "(x + 3)² = x² + 6x + 9 (falta el término 2ab)" },
      { error: "(x - 2)² = x² - 4", correccion: "(x - 2)² = x² - 4x + 4" }
    ]
  },

  "1.2.2": {
    titulo: "Diferencia de cuadrados",
    conceptos: [
      "(a + b)(a - b) = a² - b²",
      "Factorización de diferencia de cuadrados",
      "Aplicaciones en simplificación"
    ],
    ejemplos: [
      { problema: "(x + 7)(x - 7)", solucion: "x² - 49", pasos: ["a² = x²", "b² = 49", "x² - 49"] },
      { problema: "(3x + 2y)(3x - 2y)", solucion: "9x² - 4y²", pasos: ["(3x)² - (2y)²", "9x² - 4y²"] },
      { problema: "Factorizar: x² - 25", solucion: "(x + 5)(x - 5)", pasos: ["√x² = x", "√25 = 5", "(x + 5)(x - 5)"] }
    ]
  },

  "1.2.3": {
    titulo: "Binomio al cubo y otros productos",
    conceptos: [
      "(a + b)³ = a³ + 3a²b + 3ab² + b³",
      "(a - b)³ = a³ - 3a²b + 3ab² - b³",
      "Suma de cubos: a³ + b³ = (a + b)(a² - ab + b²)",
      "Diferencia de cubos: a³ - b³ = (a - b)(a² + ab + b²)"
    ],
    ejemplos: [
      { problema: "(x + 2)³", solucion: "x³ + 6x² + 12x + 8", pasos: ["x³ + 3(x²)(2) + 3(x)(4) + 8"] },
      { problema: "(2a - 1)³", solucion: "8a³ - 12a² + 6a - 1", pasos: ["(2a)³ - 3(2a)²(1) + 3(2a)(1) - 1"] },
      { problema: "Factorizar: x³ + 8", solucion: "(x + 2)(x² - 2x + 4)", tipo: "suma_cubos" }
    ]
  }
};

// Función para obtener contenido específico de un subtema
function getSubtemaContent(subtemaId) {
  return algebraKnowledge[subtemaId] || null;
}

// Función para generar ejemplos formateados
function formatEjemplos(ejemplos) {
  return ejemplos.map((ej, i) => {
    let texto = `### Ejemplo ${i + 1}\n\n**Problema**: ${ej.problema}\n\n**Solución**:\n\`\`\`\n`;
    
    if (ej.pasos) {
      ej.pasos.forEach((paso, j) => {
        texto += `Paso ${j + 1}: ${paso}\n`;
      });
    } else if (ej.metodos) {
      ej.metodos.forEach((metodo, j) => {
        texto += `Método ${j + 1}: ${metodo}\n`;
      });
    }
    
    texto += `\nRespuesta: ${ej.solucion}\n\`\`\`\n`;
    return texto;
  }).join('\n');
}

// Función para generar sección de errores comunes
function formatErroresComunes(errores) {
  return errores.map((err, i) => {
    return `❌ **Error ${i + 1}**: ${err.error}\n✅ **Correcto**: ${err.correccion}\n`;
  }).join('\n');
}

module.exports = {
  algebraKnowledge,
  getSubtemaContent,
  formatEjemplos,
  formatErroresComunes
};
