# Task Manager

Una aplicación simple para gestionar tareas, construida con Node.js, Express, React y PostgreSQL.

## Características

- Crear, leer, actualizar y eliminar tareas
- Marcar tareas como completadas
- Tests automatizados

## Tecnologías

### Backend
- Node.js y Express
- PostgreSQL con Sequelize
- Jest para tests

### Frontend
- React
- Material-UI
- Axios para API calls
- Jest para tests

## Requisitos

- Node.js v18+
- Docker y Docker Compose
- PostgreSQL (opcional para desarrollo local)

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/IgnacioAchaval/fullstack-app.git
cd fullstack-app
```

2. Instalar dependencias:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```


3. Iniciar la aplicación:
```bash
# Iniciar base de datos
docker compose up db

# Iniciar backend
cd backend
npm run dev

# Iniciar frontend
cd frontend
npm start
```

## Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test

# Integración
cd tests
npm test
```

## Despliegue

La aplicación se despliega automáticamente en AWS usando GitHub Actions cuando se hace push a main.
