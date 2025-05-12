# Walkthrough de la Aplicación

Este documento proporciona una guía paso a paso para el desarrollo y despliegue de la aplicación de gestión de tareas.

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

## Configuración del Entorno

### Requisitos Previos
- Node.js v18 o superior
- Docker y Docker Compose
- PostgreSQL (opcional para desarrollo local)

### Variables de Entorno

#### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskmanager
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:3001
```

## Desarrollo Local

### 1. Iniciar la Base de Datos
```bash
docker compose up db
```

### 2. Iniciar el Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Iniciar el Frontend
```bash
cd frontend
npm install
npm start
```

## Despliegue

### 1. Construir Imágenes Docker
```bash
docker compose build
```

### 2. Desplegar con Docker Compose
```bash
docker compose up
```

## API Endpoints

### Tareas

#### Crear Tarea
```http
POST /api/tasks
Content-Type: application/json

{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "status": "pending"
}
```

#### Obtener Tarea
```http
GET /api/tasks/:id
```

#### Actualizar Tarea
```http
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Tarea actualizada",
  "status": "in_progress"
}
```

#### Eliminar Tarea
```http
DELETE /api/tasks/:id
```

## Flujo de Trabajo

1. **Crear Tarea**
   - Ingresar título (requerido)
   - Ingresar descripción (opcional)
   - Seleccionar estado (default: pending)

2. **Gestionar Tarea**
   - Ver detalles
   - Actualizar estado
   - Editar información
   - Eliminar tarea

3. **Estados de Tarea**
   - pending: Tarea pendiente
   - in_progress: Tarea en progreso
   - completed: Tarea completada

## Troubleshooting

### Problemas Comunes

1. **Error de Conexión a la Base de Datos**
   - Verificar variables de entorno
   - Comprobar que PostgreSQL esté corriendo
   - Verificar credenciales

2. **Error en el Frontend**
   - Verificar REACT_APP_API_URL
   - Comprobar que el backend esté corriendo
   - Revisar la consola del navegador

3. **Error en los Tests**
   - Verificar que la base de datos de test esté limpia
   - Comprobar variables de entorno de test
   - Revisar logs de test

## Mejores Prácticas

1. **Desarrollo**
   - Seguir el patrón de commits convencionales
   - Mantener los tests actualizados
   - Documentar cambios significativos

2. **Testing**
   - Ejecutar tests antes de cada commit
   - Mantener cobertura de código alta
   - Verificar tests de integración

3. **Despliegue**
   - Verificar variables de entorno
   - Comprobar logs después del despliegue
   - Monitorear el estado de la aplicación
