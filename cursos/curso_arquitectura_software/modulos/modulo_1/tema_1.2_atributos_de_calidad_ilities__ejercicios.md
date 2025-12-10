# BANCO DE EJERCICIOS: Atributos de Calidad (-ilities)

## METADATA

- **Módulo**: Módulo 1 - Fundamentos
- **Tema**: 1.2 - Atributos de Calidad
- **Tiempo total**: 60 minutos

---

## EJERCICIO 1: Identificar Trade-offs

### METADATA

- **ID**: `EJ-M1-201`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo**: 20 minutos

### ENUNCIADO

Analiza los trade-offs entre Performance y Seguridad en el siguiente escenario:

**Escenario**: API de pagos que procesa 10,000 transacciones/segundo.

**Opciones**:
A) Cachear tokens de autenticación por 1 hora
B) Validar cada request contra base de datos
C) Usar JWT con validación local

**Tarea**: Para cada opción, analiza:

1. Performance (latencia, throughput)
2. Seguridad (riesgos)
3. Recomendación justificada

### SOLUCIÓN

| Opción | Performance | Seguridad | Recomendación |
|--------|-------------|-----------|---------------|
| A | ⭐⭐⭐⭐⭐ Excelente | ⭐⭐ Baja | ❌ Riesgo de tokens comprometidos |
| B | ⭐⭐ Baja | ⭐⭐⭐⭐⭐ Excelente | ❌ No escala |
| C | ⭐⭐⭐⭐ Buena | ⭐⭐⭐⭐ Buena | ✅ Balance óptimo |

**Recomendación**: Opción C (JWT) con refresh tokens cortos.

---

## EJERCICIO 2: Implementar Quality Attribute Workshop (QAW)

### METADATA

- **ID**: `EJ-M1-202`
- **Dificultad**: ⭐⭐⭐ Avanzado
- **Tiempo**: 40 minutos

### ENUNCIADO

Implementa una herramienta para priorizar atributos de calidad.

```python
class QualityAttributeWorkshop:
    def __init__(self):
        self.attributes = {}
    
    def add_attribute(self, name: str, priority: int, scenarios: list):
        # TODO: Implementar
        pass
    
    def prioritize(self):
        # TODO: Implementar priorización
        pass
```

### SOLUCIÓN

```python
class QualityAttributeWorkshop:
    def __init__(self):
        self.attributes = {}
    
    def add_attribute(self, name: str, priority: int, scenarios: list):
        self.attributes[name] = {
            'priority': priority,
            'scenarios': scenarios,
            'score': priority * len(scenarios)
        }
    
    def prioritize(self):
        return sorted(self.attributes.items(), 
                     key=lambda x: x[1]['score'], 
                     reverse=True)

# Uso
qaw = QAW()
qaw.add_attribute('Performance', 9, ['API < 100ms', 'DB query < 50ms'])
qaw.add_attribute('Security', 10, ['Encryption', 'Auth'])
print(qaw.prioritize())
```

---

## AUTOEVALUACIÓN

- [ ] Puedo identificar trade-offs entre atributos
- [ ] Sé priorizar atributos de calidad
- [ ] Entiendo escenarios de atributos
