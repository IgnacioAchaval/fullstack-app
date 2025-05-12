# Aplicación de Gestión de Tareas

Aplicación full-stack para gestión de tareas desarrollada con Node.js, React y PostgreSQL.

## Características Principales

- Gestión completa de tareas (CRUD)
- Estados de tareas: pendiente, en progreso, completada
- Filtrado y ordenamiento de tareas
- Interfaz responsiva
- Persistencia de datos con PostgreSQL
- Tests automatizados (unitarios e integración)

## Stack Tecnológico

### Backend
- Node.js con Express
- TypeScript
- PostgreSQL
- Jest para testing

### Frontend
- React
- Node.js
- Express
- PostgreSQL
- Docker
- Material-UI
- Jest

### DevOps
- Docker y Docker Compose
- GitHub Actions para CI/CD
- Tests E2E con CodeceptJS

## Requisitos

- Node.js (v18 o superior)
- Docker y Docker Compose
- PostgreSQL (si se ejecuta localmente)

## Configuración Rápida

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd fullstack-app
```

2. Configurar variables de entorno:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

3. Iniciar con Docker:
```bash
# Desarrollo local
docker compose up --build

# Producción (requiere DOCKER_USERNAME)
export DOCKER_USERNAME=tu-usuario
docker compose up
```

## Pipeline CI/CD

El proyecto utiliza GitHub Actions para automatización con el siguiente workflow:

1. **Build y Test Unitarios**
   ```yaml
   - Se ejecuta en cada push a main y pull requests
   - Instala dependencias (npm ci)
   - Ejecuta tests unitarios del backend y frontend
   - Genera reportes de cobertura
   ```

2. **Build de Imágenes Docker**
   - Construye imágenes Docker para backend y frontend
   - Etiqueta imágenes con commit SHA
   - Publica imágenes en DockerHub
   ```

3. **Despliegue a AWS**
   - Despliega contenedores en AWS
   - Configura variables de entorno
   - Verifica el despliegue
   ```

4. **Tests de Integración**
   - Ejecuta tests de integracion contra el entorno desplegado
   - Verifica funcionalidades críticas
   - Genera reportes de tests
   ```

## Tests

### Tests Unitarios
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

Los tests unitarios del frontend verifican:
- Renderizado inicial de la lista de tareas
- Creación de nuevas tareas
- Eliminación de tareas existentes
- Interacciones del usuario con la interfaz

### Tests de Integración
```bash
# Ejecutar tests de integración
cd tests
npm test
```

Los tests de integración verifican:
- Operaciones CRUD completas a través de la API
  - Creación de tareas (POST /api/tasks)
  - Lectura de tareas (GET /api/tasks/:id)
  - Actualización de tareas (PUT /api/tasks/:id)
  - Eliminación de tareas (DELETE /api/tasks/:id)
- Validación de respuestas HTTP (201, 200, 204, 404)
- Manejo de errores y casos límite
- Persistencia de datos en la base de datos

## Estructura del Proyecto

```
.
├── backend/          # API Node.js
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/        # Vistas principales
│   │   └── tests/        # Tests unitarios
├── tests/           # Tests de integración
├── docker-compose.yml
└── README.md
```

## Documentación Adicional

- [Casos de Prueba](TEST_CASES.md)
- [Walkthrough](WALKTHROUGH.md)
