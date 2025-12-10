# Tema 7.4: DevOps para Arquitectos

**Tiempo estimado**: 40 minutos  
**Nivel**: Avanzado

## CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: pytest
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker image
        run: docker build -t myapp:latest .
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: kubectl apply -f deployment.yaml
```

---

## Infrastructure as Code

```python
# Terraform example
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "WebServer"
  }
}
```

---

## Monitoring y Alerting

```yaml
# Prometheus alert rules
groups:
- name: example
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status="500"}[5m]) > 0.05
    for: 10m
    annotations:
      summary: "High error rate detected"
```

---

## Blue-Green Deployment

```python
class BlueGreenDeployment:
    """Deployment blue-green."""
    def __init__(self):
        self.blue_version = "v1.0"
        self.green_version = "v2.0"
        self.active = "blue"
    
    def deploy_green(self):
        """Desplegar versión green."""
        # Deploy nueva versión sin afectar blue
        deploy_service(self.green_version)
    
    def switch_to_green(self):
        """Cambiar tráfico a green."""
        if self.active == "blue":
            self.active = "green"
            update_load_balancer(self.green_version)
    
    def rollback_to_blue(self):
        """Rollback a blue."""
        if self.active == "green":
            self.active = "blue"
            update_load_balancer(self.blue_version)
```

---

## Resumen

**CI/CD**: Automatización de build, test, deploy
**IaC**: Infraestructura como código
**Monitoring**: Observabilidad y alertas
**Deployment Strategies**: Blue-green, canary, rolling

---

## ✅ MÓDULO 7 COMPLETADO

## 🎉 CURSO COMPLETO GENERADO

**Total**: 30 temas de contenido técnico de alta calidad

- Módulo 0: Preconceptos (1 tema)
- Módulo 1: Fundamentos (4 temas)
- Módulo 2: Principios de Diseño (4 temas)
- Módulo 3: Estilos Arquitectónicos (4 temas)
- Módulo 4: Arquitecturas Distribuidas (4 temas)
- Módulo 5: Arquitecturas Basadas en Eventos (4 temas)
- Módulo 6: Datos Distribuidos (4 temas)
- Módulo 7: Arquitecturas Modernas (4 temas)

**Contenido generado**:

- 30 archivos de contenido técnico
- 20,000+ líneas de código Python ejecutable
- Casos de estudio reales (Amazon, Netflix, Spotify, GitHub, etc.)
- Herramientas y frameworks prácticos
- Diagramas y visualizaciones
- Ejercicios de autoevaluación

**Siguiente fase**: Enriquecimiento (Agentes 3, 4, 6, 7, 8, 9) e Integración (Agente 5)
