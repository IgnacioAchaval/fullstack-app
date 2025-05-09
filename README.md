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
- React con TypeScript
- Vite
- Jest para testing

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
   ```yaml
   - Construye imágenes Docker para backend y frontend
   - Etiqueta imágenes con commit SHA
   - Publica imágenes en DockerHub
   ```

3. **Despliegue a AWS**
   ```yaml
   - Despliega contenedores en AWS
   - Configura variables de entorno
   - Verifica el despliegue
   ```

4. **Tests de Integración**
   ```yaml
   - Ejecuta tests E2E contra el entorno desplegado
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

### Tests de Integración (E2E)
```bash
# Instalar dependencias de tests
npm install -g codeceptjs

# Ejecutar tests contra entorno local
npm run test:e2e<

# Ejecutar tests contra entorno de producción
npm run test:e2e:prod
```

Los tests de integración verifican:
- Flujos completos de usuario
- Integración backend-frontend
- Persistencia de datos
- Manejo de errores
- Validaciones de UI

## Estructura del Proyecto

```
.
├── backend/          # API Node.js
├── frontend/         # Aplicación React
├── tests/           # Tests de integración
├── docker-compose.yml
└── README.md
```

## Documentación Adicional

- [Casos de Prueba](TEST_CASES.md)
- [Mejoras Planificadas](IMPROVEMENTS.md)

## Licencia

MIT

## Features

- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Filter and sort tasks
- Responsive design
- Real-time updates

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- TypeScript
- Jest for testing

### Frontend
- React
- TypeScript
- Vite
- Jest for testing

## Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Tasks Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tests/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── tests/
│   │   └── types/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```



