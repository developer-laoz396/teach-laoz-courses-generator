# EJERCICIOS: TEMA 3.3 (PIPELINE)

## OBJETIVOS

1. Construir una cadena de procesamiento.
2. Entender la independencia de los filtros.

---

## 1. COMPOSICIÓN FUNCIONAL

**Tarea**: Implementa un pipeline simple en JavaScript usando composición de funciones.

```javascript
const text = "   Hola Mundo  ";

const trim = (str) => str.trim();
const toLower = (str) => str.toLowerCase();
const wrapP = (str) => `<p>${str}</p>`;

// Tu tarea: Crea una función `pipeline` que tome N filtros y los ejecute en orden.
const process = pipeline(trim, toLower, wrapP);

console.log(process(text)); // "<p>hola mundo</p>"
```

---

## 2. STREAMING

Si el archivo de entrada pesa 50GB, no puedes cargarlo todo en memoria.
Debes usar procesado por streams (tubería real).
Investiga cómo funciona `.pipe()` en Node.js.
Escribe un script teórico que lea `bigdata.csv`, comprima con Gzip y escriba en disco, todo streamado.

```javascript
fs.createReadStream('input.csv')
  .pipe(__________________) // Comprimir
  .pipe(fs.createWriteStream('output.gz'));
```

---

## 3. REFLEXIÓN

Si el filtro 3 falla (ej: formato inválido), ¿cómo le avisa al filtro 1 para que deje de enviar datos?
_________________________________________________________________________
