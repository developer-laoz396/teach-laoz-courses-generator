# BANCO DE EJERCICIOS: Layered Architecture

## METADATA

- **Módulo**: Módulo 3 - Estilos Arquitectónicos
- **Tema**: 3.1 - Layered Architecture
- **Tiempo total**: 90 minutos

---

## EJERCICIO 1: Implementar 3 Capas

### METADATA

- **ID**: `EJ-M3-101`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo**: 45 minutos

### ENUNCIADO

Implementa un sistema de gestión de tareas con arquitectura en capas.

**Capas**:

1. Presentation (Flask API)
2. Business Logic
3. Data Access (SQLite)

```python
# Presentation Layer
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    # TODO: Implementar
    pass

# Business Layer
class TaskService:
    def __init__(self, task_repository):
        # TODO: Implementar
        pass
    
    def create_task(self, title: str, description: str):
        # TODO: Implementar validaciones de negocio
        pass

# Data Layer
class TaskRepository:
    def save(self, task):
        # TODO: Implementar persistencia
        pass
```

### SOLUCIÓN

```python
# Data Layer
import sqlite3

class TaskRepository:
    def __init__(self, db_path='tasks.db'):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        conn = sqlite3.connect(self.db_path)
        conn.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                completed BOOLEAN DEFAULT 0
            )
        ''')
        conn.commit()
        conn.close()
    
    def save(self, task):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.execute(
            'INSERT INTO tasks (title, description) VALUES (?, ?)',
            (task['title'], task['description'])
        )
        task_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return task_id

# Business Layer
class TaskService:
    def __init__(self, task_repository):
        self.task_repository = task_repository
    
    def create_task(self, title: str, description: str):
        # Validaciones de negocio
        if not title or len(title) < 3:
            raise ValueError("Title must be at least 3 characters")
        
        task = {'title': title, 'description': description}
        return self.task_repository.save(task)

# Presentation Layer
from flask import Flask, jsonify, request

app = Flask(__name__)
task_repo = TaskRepository()
task_service = TaskService(task_repo)

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    try:
        task_id = task_service.create_task(data['title'], data.get('description', ''))
        return jsonify({'id': task_id}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
```

---

## EJERCICIO 2: Identificar Sinkhole Anti-pattern

### METADATA

- **ID**: `EJ-M3-102`
- **Dificultad**: ⭐⭐ Intermedio
- **Tiempo**: 20 minutos

### ENUNCIADO

Identifica el anti-pattern "Sinkhole" en el siguiente código:

```python
# Presentation
def get_user(user_id):
    return user_service.get_user(user_id)

# Business
def get_user(user_id):
    return user_repository.get_user(user_id)

# Data
def get_user(user_id):
    return db.query("SELECT * FROM users WHERE id = ?", user_id)
```

**Pregunta**: ¿Qué problema tiene este código?

### SOLUCIÓN

**Problema**: Sinkhole Anti-pattern

- Business layer no añade valor
- Solo pasa datos de Data a Presentation
- Overhead innecesario

**Solución**: Eliminar Business layer para queries simples, mantenerla solo para lógica compleja.

---

## AUTOEVALUACIÓN

- [ ] Puedo implementar arquitectura en 3 capas
- [ ] Identifico el anti-pattern Sinkhole
- [ ] Sé cuándo usar cada capa
