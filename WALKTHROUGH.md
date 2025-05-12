# WALKTHROUGH

## 1. Descripción General

Este proyecto es una **aplicación de gestión de tareas** (Task Manager) full-stack, desarrollada como trabajo práctico integrador. Cumple con los requisitos de tener un backend, un frontend, base de datos, tests automatizados, CI/CD y despliegue en contenedores.

---

## 2. Estructura del Proyecto

```
fullstack-app/
├── backend/         # API REST Node.js/Express
├── frontend/        # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/        # Vistas principales
│   │   └── tests/        # Tests unitarios
├── tests/           # Pruebas de integración (E2E)
├── docker-compose.yml
├── README.md
└── ...otros archivos de configuración
```

---

## 3. Backend

- **Tecnologías:** Node.js, Express, TypeScript, Sequelize (ORM), PostgreSQL, Jest.
- **Ubicación:** `/backend`

### Estructura principal:
- `/src/models/`: Modelos de datos (por ejemplo, `Task.js` define la entidad Tarea con campos como id, título, descripción, estado, fecha límite).
- `/src/controllers/`: Lógica para manejar las peticiones HTTP (crear, leer, actualizar, eliminar tareas).
- `/src/routes/`: Define los endpoints de la API REST.
- `/src/services/`: Lógica de negocio y conexión con la base de datos.
- `/src/middleware/`: Funciones intermedias (validaciones, manejo de errores, etc).
- `/src/tests/`: Pruebas unitarias y de integración del backend.

### Principales endpoints:
- `GET /api/tasks` - Listar tareas
- `GET /api/tasks/:id` - Obtener tarea por ID
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

---

## 4. Frontend

- **Tecnologías:** React, JavaScript, Material-UI, Jest, React Testing Library.
- **Ubicación:** `/frontend`

### Estructura principal:
- `/src/components/`: Componentes reutilizables (formularios, listas, botones, etc).
- `/src/pages/`: Vistas principales (listado de tareas, detalle, edición).
- `/src/tests/`: Tests unitarios del frontend.

### Funcionalidades:
- Crear, editar, eliminar y listar tareas.
- Cambiar estado de las tareas (pendiente, en progreso, completada).
- Filtrar y ordenar tareas.
- Interfaz responsiva con Material-UI.

### Tests Unitarios:
- Renderizado inicial de componentes
- Interacciones del usuario
- Operaciones CRUD
- Manejo de estados y efectos

---

## 5. Base de Datos

- **Tecnología:** PostgreSQL
- **Gestión:** Sequelize ORM
- **Modelo principal:** Tarea (`Task`) con campos:
  - `id` (UUID)
  - `title` (string, requerido)
  - `description` (texto, opcional)
  - `status` (enum: 'pending', 'in_progress', 'completed')
  - `dueDate` (fecha, opcional)
  - timestamps (creación/actualización)

---

## 6. Pruebas (Testing)

### Tests Unitarios
- **Frontend:** Jest y React Testing Library
  - Pruebas de componentes
  - Pruebas de interacción
  - Pruebas de estado

- **Backend:** Jest
  - Pruebas de controladores
  - Pruebas de servicios
  - Pruebas de modelos

### Tests de Integración
- **Tecnología:** CodeceptJS
- **Ubicación:** `/tests`
- **Cobertura:**
  - Operaciones CRUD completas
  - Validación de respuestas HTTP
  - Manejo de errores
  - Persistencia de datos

---

## 7. DevOps y CI/CD

- **Contenedores:** Docker y Docker Compose para levantar backend, frontend y base de datos.
- **Pipeline:** GitHub Actions automatiza:
  - Instalación de dependencias
  - Ejecución de tests unitarios y de integración
  - Build de imágenes Docker y push a DockerHub
  - Despliegue automático en AWS
  - Ejecución de tests E2E sobre el entorno desplegado

---

## 8. Ejecución y Despliegue

- **Desarrollo local:**  
  ```bash
  docker compose up --build
  ```
- **Producción (AWS):**
  - Se usan imágenes Docker publicadas en DockerHub.
  - El pipeline automatiza el despliegue y testing.

---

## 9. Documentación y Casos de Prueba

- **README.md:** Explica instalación, ejecución, estructura y pipeline.
- **TEST_CASES.md:** Enumera los casos de prueba unitarios y de integración.
- **WALKTHROUGH.md:** Guía detallada de la arquitectura y componentes.

---

## 10. Mejoras y Extensiones

- El proyecto está preparado para agregar autenticación, notificaciones, métricas, etc.
- El código es modular y fácil de mantener.
