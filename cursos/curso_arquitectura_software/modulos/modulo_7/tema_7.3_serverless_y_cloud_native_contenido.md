# Tema 7.3: Arquitectura Serverless y Cloud-Native

**Tiempo estimado**: 40 minutos  
**Nivel**: Avanzado

## Serverless

**Definición**: Ejecutar código sin gestionar servidores.

**Características**:

- Pay-per-use
- Auto-scaling
- Event-driven
- Stateless

```python
# AWS Lambda example
def lambda_handler(event, context):
    """Handler de Lambda."""
    order_id = event['order_id']
    
    # Procesar orden
    process_order(order_id)
    
    return {
        'statusCode': 200,
        'body': json.dumps({'order_id': order_id})
    }
```

**Ventajas**: Sin gestión de servidores, escalabilidad automática
**Desventajas**: Cold starts, vendor lock-in, límites de ejecución

---

## Cloud-Native Principles

### 1. 12-Factor App

1. **Codebase**: Un codebase, múltiples deploys
2. **Dependencies**: Declarar dependencias explícitamente
3. **Config**: Configuración en environment variables
4. **Backing services**: Tratar como recursos attached
5. **Build, release, run**: Separar etapas
6. **Processes**: Stateless processes
7. **Port binding**: Exportar servicios vía port binding
8. **Concurrency**: Escalar vía process model
9. **Disposability**: Fast startup, graceful shutdown
10. **Dev/prod parity**: Mantener dev y prod similares
11. **Logs**: Logs como event streams
12. **Admin processes**: Admin tasks como one-off processes

```python
# Ejemplo: Config en environment variables
import os

DATABASE_URL = os.getenv('DATABASE_URL')
API_KEY = os.getenv('API_KEY')
```

### 2. Containers (Docker)

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "app.py"]
```

### 3. Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      containers:
      - name: user-service
        image: user-service:1.0
        ports:
        - containerPort: 8080
```

---

## Resumen

**Serverless**: Código sin servidores, event-driven
**Cloud-Native**: 12-factor, containers, Kubernetes
**Beneficios**: Escalabilidad, resiliencia, portabilidad

**Siguiente paso**: Tema 7.4 - DevOps para Arquitectos
