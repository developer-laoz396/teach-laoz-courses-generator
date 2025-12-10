# EJERCICIOS: TEMA 3.2 (MICROKERNEL)

## OBJETIVOS

1. Diseñar una arquitectura extensible.
2. Definir contratos de Plugin.

---

## 1. EL NAVEGADOR WEB

Estás construyendo un navegador nuevo ("ChromeKiller").
El navegador base solo sabe renderizar HTML.
Quieres permitir que terceros creen "AdBlockers" o "DarkReaders".

**Tarea**: Diseña la interfaz del Plugin.

```typescript
interface IBrowserPlugin {
    // ¿Qué métodos necesita exponer el plugin?
    onPageLoad(url: string, content: string): string; // Para modificar contenido
    onRequest(url: string): boolean; // Para bloquear traza
}
```

---

## 2. EL REGISTRY

¿Cómo sabe el Core qué plugins están instalados?
Escribe pseudocódigo para un `PluginRegistry`.

```javascript
class Registry {
    plugins = [];

    register(plugin) {
        // Validar que cumpla la interfaz
        _____________________
        this.plugins.push(plugin);
    }

    executeAll(eventName, data) {
        // Recorrer plugins y ejecutarlos
        _____________________
    }
}
```

---

## 3. REFLEXIÓN

Si un Plugin falla (lanza excepción infinita), ¿debe caerse el Core?
¿Cómo aíslas el Plugin? (Ej: Ejecutar en un Sandbox, WebWorker o proceso separado).
_________________________________________________________________________
