# EJERCICIOS: TEMA 3.1 (LAYERED ARCHITECTURE)

## OBJETIVOS

1. Identificar violaciones de capas.
2. Refactorizar código espagueti a capas.

---

## 1. POLICÍA DE CAPAS

**Código Sospechoso (Controller.js)**:

```javascript
router.post('/checkout', (req, res) => {
    // 1. Validar input (OK para Controller)
    if (!req.body.cart) return res.status(400);

    // 2. Calcular total con impuestos (BLOQUEO: Lógica de Negocio)
    let total = 0;
    req.body.cart.forEach(item => {
        if (item.category === 'food') total += item.price * 1.10;
        else total += item.price * 1.21;
    });

    // 3. Guardar en BD (BLOQUEO: Persistencia directa)
    db.query("INSERT INTO orders...", [total]);

    res.send({ total });
});
```

**Tarea**: Separa este código en 3 archivos ficticios: `OrderController`, `OrderService`, `OrderRepository`.

---

## 2. STRICT VS RELAXED

Si tienes una capa de "Utils" (ej: formatear fechas), ¿quién puede llamarla?

* ¿Solo Persistence?
* ¿Solo Business?
* ¿Todos?
Dibuja un diagrama de dependencias si permitimos que TODOS llamen a Utils (Relaxed Layering).
¿Crea esto acoplamiento peligroso?

_________________________________________________________________________
