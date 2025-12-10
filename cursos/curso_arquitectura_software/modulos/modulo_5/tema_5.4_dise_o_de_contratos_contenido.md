# Tema 5.4: Diseño de Contratos (API Contracts)

**Tiempo estimado**: 35 minutos  
**Nivel**: Intermedio

## ¿Por qué importan los contratos?

En sistemas distribuidos, los **contratos** definen cómo se comunican los servicios. Un contrato mal diseñado causa:

- Breaking changes
- Incompatibilidades de versiones
- Acoplamiento fuerte

---

## OpenAPI (Swagger)

```yaml
# openapi.yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0

paths:
  /users/{userId}:
    get:
      summary: Get user by ID
      parameters:
        - name: userId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found

components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
      properties:
        id:
          type: string
        email:
          type: string
        name:
          type: string
```

---

## Versionado de APIs

### 1. URL Versioning

```python
# v1
@app.route('/api/v1/users/<user_id>')
def get_user_v1(user_id):
    return {'id': user_id, 'name': 'John'}

# v2 (con cambios)
@app.route('/api/v2/users/<user_id>')
def get_user_v2(user_id):
    return {
        'id': user_id,
        'full_name': 'John Doe',  # Campo renombrado
        'email': 'john@example.com'  # Campo nuevo
    }
```

### 2. Header Versioning

```python
@app.route('/api/users/<user_id>')
def get_user(user_id):
    version = request.headers.get('API-Version', '1')
    
    if version == '1':
        return {'id': user_id, 'name': 'John'}
    elif version == '2':
        return {'id': user_id, 'full_name': 'John Doe'}
```

---

## Consumer-Driven Contracts

```python
# Pact: Consumer define contrato
# consumer_test.py
from pact import Consumer, Provider

pact = Consumer('UserService').has_pact_with(Provider('OrderService'))

pact.given('user exists').upon_receiving('a request for user').with_request(
    method='GET',
    path='/users/123'
).will_respond_with(200, body={
    'id': '123',
    'email': 'user@example.com'
})

# Provider debe cumplir contrato
```

---

## Resumen

**Contratos**: Definen comunicación entre servicios
**OpenAPI**: Estándar para documentar APIs REST
**Versionado**: Evita breaking changes
**Consumer-Driven**: Consumers definen contratos

---

## ✅ MÓDULO 5 COMPLETADO

**Próximo módulo**: Datos en Arquitecturas Distribuidas
