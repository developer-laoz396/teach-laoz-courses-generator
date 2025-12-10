# Tema 3.2: Microkernel Architecture (Arquitectura de Microkernel)

**Tiempo estimado**: 45 minutos  
**Nivel**: Intermedio-Avanzado  
**Prerrequisitos**: Tema 3.1 (Layered Architecture)

## ¿Por qué importa este concepto?

La **Arquitectura de Microkernel** (también llamada **Plugin Architecture**) es ideal para sistemas que necesitan:

- **Extensibilidad**: Añadir funcionalidad sin modificar el core
- **Personalización**: Diferentes configuraciones para diferentes clientes
- **Evolución independiente**: Plugins se desarrollan y despliegan separadamente
- **Ecosistema de terceros**: Permitir que otros desarrollen extensiones

**Ejemplos reales**:

- **Eclipse IDE**: Core + plugins para Java, Python, C++, etc.
- **VS Code**: Core editor + extensiones
- **WordPress**: Core CMS + plugins y themes
- **Chrome/Firefox**: Core browser + extensions
- **Jenkins**: Core CI/CD + plugins

---

## Definición formal

### Estructura

```
┌─────────────────────────────────────────┐
│           Core System                    │
│  (Minimal functionality + Plugin API)   │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┬────────┐
    │        │        │        │
┌───▼───┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│Plugin │ │Plugin│ │Plugin│ │Plugin│
│   A   │ │  B   │ │  C   │ │  D   │
└───────┘ └──────┘ └──────┘ └──────┘
```

### Componentes

1. **Core System**: Funcionalidad mínima + registro de plugins
2. **Plugin Interface**: Contrato que deben cumplir los plugins
3. **Plugins**: Módulos independientes que extienden funcionalidad
4. **Plugin Registry**: Catálogo de plugins disponibles

---

## Implementación: Sistema de Procesamiento de Documentos

### Core System

```python
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import importlib
import os

# ===== PLUGIN INTERFACE =====

class DocumentProcessor(ABC):
    """
    Interfaz que deben implementar todos los plugins.
    """
    @abstractmethod
    def get_name(self) -> str:
        """Nombre del plugin."""
        pass
    
    @abstractmethod
    def get_supported_formats(self) -> List[str]:
        """Formatos de archivo soportados (ej: ['pdf', 'docx'])."""
        pass
    
    @abstractmethod
    def process(self, file_path: str) -> Dict[str, Any]:
        """
        Procesa un documento.
        
        Returns:
            Dict con: {
                'text': str,
                'metadata': dict,
                'success': bool
            }
        """
        pass
    
    @abstractmethod
    def validate(self, file_path: str) -> bool:
        """Valida si el archivo puede ser procesado."""
        pass

# ===== CORE SYSTEM =====

class PluginRegistry:
    """
    Registro de plugins.
    Core system usa esto para descubrir y cargar plugins.
    """
    def __init__(self):
        self.plugins: Dict[str, DocumentProcessor] = {}
        self.format_to_plugin: Dict[str, str] = {}
    
    def register(self, plugin: DocumentProcessor):
        """Registra un plugin."""
        name = plugin.get_name()
        self.plugins[name] = plugin
        
        # Mapear formatos a plugin
        for fmt in plugin.get_supported_formats():
            self.format_to_plugin[fmt.lower()] = name
        
        print(f"✓ Plugin registered: {name} (formats: {plugin.get_supported_formats()})")
    
    def unregister(self, plugin_name: str):
        """Desregistra un plugin."""
        if plugin_name in self.plugins:
            plugin = self.plugins[plugin_name]
            
            # Remover mapeos de formatos
            for fmt in plugin.get_supported_formats():
                if fmt.lower() in self.format_to_plugin:
                    del self.format_to_plugin[fmt.lower()]
            
            del self.plugins[plugin_name]
            print(f"✓ Plugin unregistered: {plugin_name}")
    
    def get_plugin_for_format(self, file_format: str) -> Optional[DocumentProcessor]:
        """Obtiene el plugin apropiado para un formato."""
        plugin_name = self.format_to_plugin.get(file_format.lower())
        return self.plugins.get(plugin_name) if plugin_name else None
    
    def list_plugins(self) -> List[str]:
        """Lista todos los plugins registrados."""
        return list(self.plugins.keys())

class DocumentProcessingCore:
    """
    Core System: Funcionalidad mínima + gestión de plugins.
    """
    def __init__(self):
        self.registry = PluginRegistry()
        self.processing_history: List[Dict] = []
    
    def load_plugin(self, plugin: DocumentProcessor):
        """Carga un plugin."""
        self.registry.register(plugin)
    
    def load_plugins_from_directory(self, plugin_dir: str):
        """
        Carga plugins dinámicamente desde un directorio.
        Cada plugin es un módulo Python con una clase que implementa DocumentProcessor.
        """
        if not os.path.exists(plugin_dir):
            print(f"Plugin directory not found: {plugin_dir}")
            return
        
        for filename in os.listdir(plugin_dir):
            if filename.endswith('.py') and not filename.startswith('__'):
                module_name = filename[:-3]
                
                try:
                    # Importar módulo dinámicamente
                    spec = importlib.util.spec_from_file_location(
                        module_name,
                        os.path.join(plugin_dir, filename)
                    )
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)
                    
                    # Buscar clase que implemente DocumentProcessor
                    for attr_name in dir(module):
                        attr = getattr(module, attr_name)
                        if (isinstance(attr, type) and 
                            issubclass(attr, DocumentProcessor) and 
                            attr is not DocumentProcessor):
                            
                            plugin_instance = attr()
                            self.load_plugin(plugin_instance)
                            break
                
                except Exception as e:
                    print(f"Error loading plugin {module_name}: {e}")
    
    def process_document(self, file_path: str) -> Dict[str, Any]:
        """
        Procesa un documento usando el plugin apropiado.
        """
        # Detectar formato
        file_format = file_path.split('.')[-1].lower()
        
        # Obtener plugin
        plugin = self.registry.get_plugin_for_format(file_format)
        
        if not plugin:
            return {
                'success': False,
                'error': f'No plugin available for format: {file_format}'
            }
        
        # Validar
        if not plugin.validate(file_path):
            return {
                'success': False,
                'error': f'File validation failed: {file_path}'
            }
        
        # Procesar
        try:
            result = plugin.process(file_path)
            
            # Registrar en historial
            self.processing_history.append({
                'file': file_path,
                'plugin': plugin.get_name(),
                'success': result.get('success', False)
            })
            
            return result
        
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_statistics(self) -> Dict[str, Any]:
        """Estadísticas de procesamiento."""
        total = len(self.processing_history)
        successful = sum(1 for h in self.processing_history if h['success'])
        
        return {
            'total_processed': total,
            'successful': successful,
            'failed': total - successful,
            'plugins_loaded': len(self.registry.list_plugins())
        }
```

### Plugins (Implementaciones)

```python
# ===== PLUGIN 1: PDF Processor =====

class PDFProcessor(DocumentProcessor):
    """Plugin para procesar archivos PDF."""
    
    def get_name(self) -> str:
        return "PDF Processor"
    
    def get_supported_formats(self) -> List[str]:
        return ['pdf']
    
    def validate(self, file_path: str) -> bool:
        """Valida que el archivo existe y es PDF."""
        if not os.path.exists(file_path):
            return False
        
        # Verificar magic bytes de PDF
        with open(file_path, 'rb') as f:
            header = f.read(4)
            return header == b'%PDF'
    
    def process(self, file_path: str) -> Dict[str, Any]:
        """Procesa PDF y extrae texto."""
        try:
            # En producción: usar PyPDF2 o pdfplumber
            # Aquí simulamos
            text = f"[Extracted text from {file_path}]"
            
            return {
                'success': True,
                'text': text,
                'metadata': {
                    'format': 'pdf',
                    'pages': 10,  # Simulado
                    'file_size': os.path.getsize(file_path)
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# ===== PLUGIN 2: Word Processor =====

class WordProcessor(DocumentProcessor):
    """Plugin para procesar archivos Word (.docx)."""
    
    def get_name(self) -> str:
        return "Word Processor"
    
    def get_supported_formats(self) -> List[str]:
        return ['docx', 'doc']
    
    def validate(self, file_path: str) -> bool:
        return os.path.exists(file_path) and file_path.endswith(('.docx', '.doc'))
    
    def process(self, file_path: str) -> Dict[str, Any]:
        """Procesa Word y extrae texto."""
        try:
            # En producción: usar python-docx
            text = f"[Extracted text from Word document: {file_path}]"
            
            return {
                'success': True,
                'text': text,
                'metadata': {
                    'format': 'docx',
                    'paragraphs': 25,  # Simulado
                    'file_size': os.path.getsize(file_path)
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# ===== PLUGIN 3: Text Processor =====

class TextProcessor(DocumentProcessor):
    """Plugin para procesar archivos de texto plano."""
    
    def get_name(self) -> str:
        return "Text Processor"
    
    def get_supported_formats(self) -> List[str]:
        return ['txt', 'md', 'log']
    
    def validate(self, file_path: str) -> bool:
        return os.path.exists(file_path)
    
    def process(self, file_path: str) -> Dict[str, Any]:
        """Procesa archivo de texto."""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
            
            return {
                'success': True,
                'text': text,
                'metadata': {
                    'format': 'text',
                    'lines': text.count('\n') + 1,
                    'characters': len(text),
                    'file_size': os.path.getsize(file_path)
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# ===== PLUGIN 4: Image OCR Processor (Advanced) =====

class ImageOCRProcessor(DocumentProcessor):
    """Plugin para procesar imágenes con OCR."""
    
    def get_name(self) -> str:
        return "Image OCR Processor"
    
    def get_supported_formats(self) -> List[str]:
        return ['jpg', 'jpeg', 'png', 'tiff']
    
    def validate(self, file_path: str) -> bool:
        return os.path.exists(file_path)
    
    def process(self, file_path: str) -> Dict[str, Any]:
        """Procesa imagen y extrae texto con OCR."""
        try:
            # En producción: usar Tesseract OCR
            text = f"[OCR extracted text from image: {file_path}]"
            
            return {
                'success': True,
                'text': text,
                'metadata': {
                    'format': 'image',
                    'ocr_confidence': 0.95,  # Simulado
                    'file_size': os.path.getsize(file_path)
                }
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
```

### Uso del Sistema

```python
# ===== EJEMPLO DE USO =====

def main():
    # 1. Crear core system
    core = DocumentProcessingCore()
    
    # 2. Cargar plugins manualmente
    core.load_plugin(PDFProcessor())
    core.load_plugin(WordProcessor())
    core.load_plugin(TextProcessor())
    core.load_plugin(ImageOCRProcessor())
    
    print("\n" + "="*50)
    print("Document Processing System")
    print("="*50)
    print(f"Plugins loaded: {core.registry.list_plugins()}")
    print()
    
    # 3. Procesar documentos
    test_files = [
        'document.pdf',
        'report.docx',
        'notes.txt',
        'scan.jpg'
    ]
    
    for file_path in test_files:
        print(f"\nProcessing: {file_path}")
        result = core.process_document(file_path)
        
        if result['success']:
            print(f"  ✓ Success")
            print(f"  Text length: {len(result.get('text', ''))} chars")
            print(f"  Metadata: {result.get('metadata', {})}")
        else:
            print(f"  ✗ Failed: {result.get('error')}")
    
    # 4. Estadísticas
    print("\n" + "="*50)
    stats = core.get_statistics()
    print("Statistics:")
    for key, value in stats.items():
        print(f"  {key}: {value}")

if __name__ == '__main__':
    main()
```

---

## Plugin Discovery Dinámico

```python
# ===== CARGA DINÁMICA DE PLUGINS =====

# Estructura de directorios:
# project/
#   core.py
#   plugins/
#     pdf_plugin.py
#     word_plugin.py
#     text_plugin.py

# En cada archivo de plugin:
# plugins/pdf_plugin.py
class PDFProcessorPlugin(DocumentProcessor):
    # Implementación...
    pass

# Core system carga automáticamente:
core = DocumentProcessingCore()
core.load_plugins_from_directory('./plugins')

# Ahora todos los plugins en ./plugins están cargados
```

---

## Gestión de Plugins en Runtime

```python
class PluginManager:
    """
    Gestor avanzado de plugins con hot-reload.
    """
    def __init__(self, core: DocumentProcessingCore):
        self.core = core
    
    def enable_plugin(self, plugin_name: str):
        """Habilita un plugin."""
        # Lógica para habilitar
        pass
    
    def disable_plugin(self, plugin_name: str):
        """Deshabilita un plugin sin desinstalarlo."""
        self.core.registry.unregister(plugin_name)
    
    def update_plugin(self, plugin_name: str, new_version: DocumentProcessor):
        """Actualiza un plugin a una nueva versión."""
        self.disable_plugin(plugin_name)
        self.core.load_plugin(new_version)
    
    def get_plugin_info(self, plugin_name: str) -> Dict[str, Any]:
        """Obtiene información de un plugin."""
        plugin = self.core.registry.plugins.get(plugin_name)
        
        if not plugin:
            return {'error': 'Plugin not found'}
        
        return {
            'name': plugin.get_name(),
            'formats': plugin.get_supported_formats(),
            'version': getattr(plugin, 'version', 'unknown')
        }
```

---

## Ventajas y Desventajas

### ✅ Ventajas

1. **Extensibilidad**: Añadir funcionalidad sin modificar core
2. **Personalización**: Diferentes configuraciones para diferentes usuarios
3. **Desarrollo independiente**: Plugins se desarrollan separadamente
4. **Ecosistema**: Terceros pueden crear plugins
5. **Mantenibilidad**: Core es pequeño y estable

### ❌ Desventajas

1. **Complejidad de API**: Diseñar buena API de plugins es difícil
2. **Versionado**: Compatibilidad entre versiones de core y plugins
3. **Performance**: Overhead de carga dinámica
4. **Seguridad**: Plugins maliciosos pueden comprometer sistema
5. **Testing**: Difícil testear todas las combinaciones de plugins

---

## Casos de uso

### ✅ Usar Microkernel cuando

- Sistema necesita ser altamente extensible
- Diferentes clientes necesitan diferentes features
- Quieres permitir ecosistema de terceros
- Core es estable pero features evolucionan

### ❌ Evitar cuando

- Sistema es simple y no necesita extensibilidad
- Performance es crítico
- No tienes recursos para mantener API de plugins
- Seguridad es crítica (plugins pueden ser riesgo)

---

## Ejemplos reales

### VS Code

- **Core**: Editor de texto básico
- **Plugins**: Python, JavaScript, Git, Docker, etc.
- **API**: Extension API bien documentada

### WordPress

- **Core**: CMS básico
- **Plugins**: SEO, e-commerce, forms, etc.
- **Hooks**: Actions y Filters para extensión

### Eclipse

- **Core**: Plataforma OSGi
- **Plugins**: Java, C++, Python, etc.
- **Extension Points**: Mecanismo de extensión

---

## Resumen

**Microkernel Architecture**:

- Core mínimo + Plugins extensibles
- Ideal para sistemas que necesitan extensibilidad
- Requiere diseño cuidadoso de API de plugins
- Usado en IDEs, CMS, browsers

**Siguiente paso**: Tema 3.3 - Pipeline Architecture
