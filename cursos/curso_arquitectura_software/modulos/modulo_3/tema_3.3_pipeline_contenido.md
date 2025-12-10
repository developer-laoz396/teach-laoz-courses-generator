# Tema 3.3: Pipeline Architecture (Arquitectura de Pipeline)

**Tiempo estimado**: 40 minutos  
**Nivel**: Intermedio  
**Prerrequisitos**: Tema 3.1, 3.2

## ¿Por qué importa este concepto?

La **Arquitectura de Pipeline** (también llamada **Pipes and Filters**) es ideal para sistemas que procesan datos en etapas secuenciales:

- **Procesamiento de datos**: ETL, análisis de logs, procesamiento de imágenes
- **Compiladores**: Lexer → Parser → Optimizer → Code Generator
- **Procesamiento de streams**: Video, audio, datos en tiempo real
- **Unix philosophy**: Pequeñas herramientas que hacen una cosa bien

**Ejemplos reales**:

- **Unix pipes**: `cat file.txt | grep "error" | sort | uniq -c`
- **FFmpeg**: Procesamiento de video en etapas
- **Apache Kafka Streams**: Procesamiento de streams
- **Compil

adores**: GCC, LLVM

---

## Definición formal

### Estructura

```
Input → [Filter 1] → [Filter 2] → [Filter 3] → Output
         ↓ pipe      ↓ pipe      ↓ pipe
```

### Componentes

1. **Filters (Filtros)**: Componentes que transforman datos
2. **Pipes (Tuberías)**: Conectores que pasan datos entre filtros
3. **Data Source**: Origen de datos
4. **Data Sink**: Destino de datos

### Características

- **Unidireccional**: Datos fluyen en una dirección
- **Transformación**: Cada filtro transforma los datos
- **Independencia**: Filtros no conocen a otros filtros
- **Composabilidad**: Filtros se pueden reordenar/combinar

---

## Implementación: Sistema de Procesamiento de Logs

```python
from abc import ABC, abstractmethod
from typing import Any, List, Iterator, Dict
from datetime import datetime
import re
import json

# ===== FILTER INTERFACE =====

class Filter(ABC):
    """
    Interfaz base para todos los filtros.
    Cada filtro recibe datos, los transforma, y los pasa al siguiente.
    """
    @abstractmethod
    def process(self, data: Any) -> Any:
        """Procesa datos y retorna resultado transformado."""
        pass

# ===== PIPE =====

class Pipe:
    """
    Tubería que conecta filtros.
    Pasa datos de un filtro al siguiente.
    """
    def __init__(self):
        self.filters: List[Filter] = []
    
    def add_filter(self, filter: Filter):
        """Añade un filtro al pipeline."""
        self.filters.append(filter)
        return self  # Para encadenamiento
    
    def execute(self, input_data: Any) -> Any:
        """
        Ejecuta el pipeline completo.
        Pasa datos a través de todos los filtros secuencialmente.
        """
        result = input_data
        
        for filter in self.filters:
            result = filter.process(result)
        
        return result

# ===== FILTERS (Implementaciones) =====

class LogReader(Filter):
    """
    Filtro 1: Lee archivo de logs línea por línea.
    """
    def process(self, file_path: str) -> Iterator[str]:
        """Lee archivo y retorna generador de líneas."""
        try:
            with open(file_path, 'r') as f:
                for line in f:
                    yield line.strip()
        except FileNotFoundError:
            print(f"File not found: {file_path}")
            return iter([])

class LogParser(Filter):
    """
    Filtro 2: Parsea líneas de log a estructuras.
    Formato esperado: [TIMESTAMP] [LEVEL] [MESSAGE]
    """
    def __init__(self):
        self.pattern = re.compile(
            r'\[(?P<timestamp>.*?)\] \[(?P<level>.*?)\] (?P<message>.*)'
        )
    
    def process(self, lines: Iterator[str]) -> Iterator[Dict]:
        """Parsea cada línea a diccionario."""
        for line in lines:
            match = self.pattern.match(line)
            
            if match:
                yield {
                    'timestamp': match.group('timestamp'),
                    'level': match.group('level'),
                    'message': match.group('message'),
                    'raw': line
                }
            else:
                # Línea no válida, skip
                continue

class LevelFilter(Filter):
    """
    Filtro 3: Filtra logs por nivel (ERROR, WARNING, INFO).
    """
    def __init__(self, levels: List[str]):
        self.levels = [level.upper() for level in levels]
    
    def process(self, logs: Iterator[Dict]) -> Iterator[Dict]:
        """Filtra logs que coincidan con niveles especificados."""
        for log in logs:
            if log['level'].upper() in self.levels:
                yield log

class KeywordFilter(Filter):
    """
    Filtro 4: Filtra logs que contengan palabras clave.
    """
    def __init__(self, keywords: List[str]):
        self.keywords = [kw.lower() for kw in keywords]
    
    def process(self, logs: Iterator[Dict]) -> Iterator[Dict]:
        """Filtra logs que contengan alguna keyword."""
        for log in logs:
            message_lower = log['message'].lower()
            
            if any(kw in message_lower for kw in self.keywords):
                yield log

class TimestampParser(Filter):
    """
    Filtro 5: Convierte timestamps de string a datetime.
    """
    def __init__(self, format: str = '%Y-%m-%d %H:%M:%S'):
        self.format = format
    
    def process(self, logs: Iterator[Dict]) -> Iterator[Dict]:
        """Parsea timestamp a datetime."""
        for log in logs:
            try:
                log['timestamp'] = datetime.strptime(log['timestamp'], self.format)
                yield log
            except ValueError:
                # Timestamp inválido, skip
                continue

class Aggregator(Filter):
    """
    Filtro 6: Agrega logs (cuenta por nivel).
    """
    def process(self, logs: Iterator[Dict]) -> Dict[str, int]:
        """Cuenta logs por nivel."""
        counts = {}
        
        for log in logs:
            level = log['level']
            counts[level] = counts.get(level, 0) + 1
        
        return counts

class JSONFormatter(Filter):
    """
    Filtro 7: Formatea logs a JSON.
    """
    def process(self, logs: Iterator[Dict]) -> Iterator[str]:
        """Convierte cada log a JSON string."""
        for log in logs:
            # Convertir datetime a string para JSON
            if isinstance(log.get('timestamp'), datetime):
                log['timestamp'] = log['timestamp'].isoformat()
            
            yield json.dumps(log)

class FileWriter(Filter):
    """
    Filtro 8: Escribe resultados a archivo.
    """
    def __init__(self, output_path: str):
        self.output_path = output_path
    
    def process(self, data: Any) -> str:
        """Escribe datos a archivo."""
        with open(self.output_path, 'w') as f:
            if isinstance(data, dict):
                json.dump(data, f, indent=2)
            elif hasattr(data, '__iter__') and not isinstance(data, str):
                for item in data:
                    f.write(str(item) + '\n')
            else:
                f.write(str(data))
        
        return f"Written to {self.output_path}"

# ===== EJEMPLO DE USO =====

def example_1_basic_pipeline():
    """
    Pipeline básico: Leer logs → Parsear → Filtrar por nivel → Contar
    """
    print("="*60)
    print("Example 1: Basic Log Processing Pipeline")
    print("="*60)
    
    # Crear pipeline
    pipeline = Pipe()
    pipeline.add_filter(LogReader())
    pipeline.add_filter(LogParser())
    pipeline.add_filter(LevelFilter(['ERROR', 'WARNING']))
    pipeline.add_filter(Aggregator())
    
    # Ejecutar
    result = pipeline.execute('application.log')
    
    print("\nResults:")
    print(json.dumps(result, indent=2))

def example_2_keyword_search():
    """
    Pipeline: Leer → Parsear → Filtrar por keyword → Formatear JSON → Escribir
    """
    print("\n" + "="*60)
    print("Example 2: Keyword Search Pipeline")
    print("="*60)
    
    pipeline = Pipe()
    pipeline.add_filter(LogReader())
    pipeline.add_filter(LogParser())
    pipeline.add_filter(KeywordFilter(['database', 'connection', 'timeout']))
    pipeline.add_filter(JSONFormatter())
    pipeline.add_filter(FileWriter('filtered_logs.json'))
    
    result = pipeline.execute('application.log')
    print(f"\n{result}")

def example_3_time_range_filter():
    """
    Pipeline con filtro de rango de tiempo.
    """
    class TimeRangeFilter(Filter):
        """Filtra logs en un rango de tiempo."""
        def __init__(self, start: datetime, end: datetime):
            self.start = start
            self.end = end
        
        def process(self, logs: Iterator[Dict]) -> Iterator[Dict]:
            for log in logs:
                if self.start <= log['timestamp'] <= self.end:
                    yield log
    
    print("\n" + "="*60)
    print("Example 3: Time Range Filter Pipeline")
    print("="*60)
    
    pipeline = Pipe()
    pipeline.add_filter(LogReader())
    pipeline.add_filter(LogParser())
    pipeline.add_filter(TimestampParser())
    pipeline.add_filter(TimeRangeFilter(
        start=datetime(2024, 1, 1, 0, 0),
        end=datetime(2024, 1, 1, 23, 59)
    ))
    pipeline.add_filter(Aggregator())
    
    result = pipeline.execute('application.log')
    print("\nResults:")
    print(json.dumps(result, indent=2))

# ===== PIPELINE AVANZADO: PROCESAMIENTO DE IMÁGENES =====

class ImageFilter(ABC):
    """Filtro base para procesamiento de imágenes."""
    @abstractmethod
    def process(self, image_data: Any) -> Any:
        pass

class GrayscaleFilter(ImageFilter):
    """Convierte imagen a escala de grises."""
    def process(self, image_data):
        # En producción: usar PIL/Pillow
        print("  → Converting to grayscale")
        return image_data  # Simulado

class ResizeFilter(ImageFilter):
    """Redimensiona imagen."""
    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height
    
    def process(self, image_data):
        print(f"  → Resizing to {self.width}x{self.height}")
        return image_data  # Simulado

class BlurFilter(ImageFilter):
    """Aplica blur a imagen."""
    def __init__(self, radius: int):
        self.radius = radius
    
    def process(self, image_data):
        print(f"  → Applying blur (radius={self.radius})")
        return image_data  # Simulado

class WatermarkFilter(ImageFilter):
    """Añade marca de agua."""
    def __init__(self, text: str):
        self.text = text
    
    def process(self, image_data):
        print(f"  → Adding watermark: '{self.text}'")
        return image_data  # Simulado

def example_4_image_processing():
    """
    Pipeline de procesamiento de imágenes.
    """
    print("\n" + "="*60)
    print("Example 4: Image Processing Pipeline")
    print("="*60)
    
    pipeline = Pipe()
    pipeline.add_filter(GrayscaleFilter())
    pipeline.add_filter(ResizeFilter(800, 600))
    pipeline.add_filter(BlurFilter(radius=2))
    pipeline.add_filter(WatermarkFilter("© 2024"))
    
    print("\nProcessing image...")
    result = pipeline.execute("input_image.jpg")
    print("✓ Image processing complete")

# ===== PIPELINE CON BRANCHING =====

class ConditionalPipe(Pipe):
    """
    Pipeline con branching condicional.
    """
    def __init__(self, condition_fn):
        super().__init__()
        self.condition_fn = condition_fn
        self.true_branch = Pipe()
        self.false_branch = Pipe()
    
    def execute(self, input_data: Any) -> Any:
        # Ejecutar filtros principales
        result = super().execute(input_data)
        
        # Branching condicional
        if self.condition_fn(result):
            return self.true_branch.execute(result)
        else:
            return self.false_branch.execute(result)

def example_5_conditional_pipeline():
    """
    Pipeline con branching condicional.
    """
    print("\n" + "="*60)
    print("Example 5: Conditional Pipeline")
    print("="*60)
    
    # Condición: si hay más de 100 errores, enviar alerta
    def has_many_errors(counts: Dict) -> bool:
        return counts.get('ERROR', 0) > 100
    
    pipeline = ConditionalPipe(has_many_errors)
    pipeline.add_filter(LogReader())
    pipeline.add_filter(LogParser())
    pipeline.add_filter(Aggregator())
    
    # Branch TRUE: Enviar alerta
    class AlertFilter(Filter):
        def process(self, data):
            print("  🚨 ALERT: Too many errors!")
            return data
    
    pipeline.true_branch.add_filter(AlertFilter())
    
    # Branch FALSE: Log normal
    class LogFilter(Filter):
        def process(self, data):
            print("  ℹ️  Normal operation")
            return data
    
    pipeline.false_branch.add_filter(LogFilter())
    
    result = pipeline.execute('application.log')
    print(f"\nFinal result: {result}")

if __name__ == '__main__':
    # Ejecutar ejemplos
    example_1_basic_pipeline()
    example_2_keyword_search()
    example_3_time_range_filter()
    example_4_image_processing()
    example_5_conditional_pipeline()
```

---

## Ventajas y Desventajas

### ✅ Ventajas

1. **Simplicidad**: Fácil de entender y razonar
2. **Reusabilidad**: Filtros se pueden reutilizar en diferentes pipelines
3. **Composabilidad**: Fácil añadir/remover/reordenar filtros
4. **Paralelización**: Filtros pueden ejecutarse en paralelo
5. **Testing**: Cada filtro se testea independientemente

### ❌ Desventajas

1. **Performance**: Overhead de pasar datos entre filtros
2. **Complejidad de estado**: Difícil mantener estado entre filtros
3. **Error handling**: Errores en un filtro afectan todo el pipeline
4. **Debugging**: Difícil debuggear pipelines largos
5. **Flexibilidad limitada**: No apto para flujos complejos con branching

---

## Casos de uso

### ✅ Usar Pipeline cuando

- Procesamiento de datos en etapas secuenciales
- Transformaciones independientes
- Necesitas reusabilidad de componentes
- Procesamiento de streams

### ❌ Evitar cuando

- Flujo de control complejo con muchos branches
- Necesitas mantener estado compartido
- Performance es crítico (overhead de pipes)
- Interacción bidireccional entre componentes

---

## Ejemplos reales

### Unix Pipes

```bash
# Pipeline clásico de Unix
cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -rn
```

### Apache Kafka Streams

```java
// Pipeline de procesamiento de streams
stream
    .filter((key, value) -> value.contains("error"))
    .map((key, value) -> value.toUpperCase())
    .groupByKey()
    .count()
    .toStream()
    .to("output-topic");
```

### FFmpeg

```bash
# Pipeline de procesamiento de video
ffmpeg -i input.mp4 \
    -vf "scale=1280:720,fps=30" \
    -c:v libx264 \
    output.mp4
```

---

## Resumen

**Pipeline Architecture**:

- Filtros independientes conectados por pipes
- Datos fluyen unidireccionalmente
- Ideal para procesamiento de datos en etapas
- Usado en Unix, compiladores, procesamiento de streams

**Siguiente paso**: Tema 3.4 - Monolito Modular
