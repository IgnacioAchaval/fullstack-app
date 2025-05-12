# Aplicación de Gestión de Tareas

Aplicación full-stack para gestión de tareas desarrollada con Node.js, React y PostgreSQL.

## Características Principales

- Gestión completa de tareas (CRUD)
- Estados de tareas: pendiente, en progreso, completada
- Interfaz responsiva con Material-UI
- Persistencia de datos con PostgreSQL
- Tests automatizados (unitarios e integración)

## Stack Tecnológico

### Backend
- Node.js con Express
- PostgreSQL con Sequelize ORM
- Jest para testing

### Frontend
- React con Create React App
- Material-UI para componentes
- Jest y React Testing Library para testing

### DevOps
- Docker y Docker Compose
- GitHub Actions para CI/CD

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
   - Se ejecuta en cada push a main y pull requests
   - Instala dependencias (npm ci)
   - Ejecuta tests unitarios del backend y frontend
   - Genera reportes de cobertura

2. **Build de Imágenes Docker**
   - Construye imágenes Docker para backend y frontend
   - Publica imágenes en DockerHub

3. **Despliegue a AWS**
   - Despliega contenedores en AWS
   - Configura variables de entorno
   - Verifica el despliegue

4. **Tests de Integración**
   - Ejecuta tests de integración contra el entorno desplegado
   - Verifica funcionalidades críticas
   - Genera reportes de tests

## Estructura del Proyecto

```
.
├── backend/          # API Node.js
│   ├── src/
│   │   ├── models/      # Modelos de datos
│   │   ├── routes/      # Rutas de la API
│   │   ├── controllers/ # Controladores
│   │   └── services/    # Lógica de negocio
├── frontend/         # Aplicación React
│   ├── src/
│   │   ├── tests/      # Tests unitarios
│   │   └── App.js      # Componente principal
├── tests/           # Tests de integración
├── docs/           # Documentación adicional
├── docker-compose.yml
└── README.md
```

## Documentación Adicional

- [Casos de Prueba](TEST_CASES.md) - Detalles de implementación de tests
- [Walkthrough](WALKTHROUGH.md) - Guía de desarrollo y despliegue
