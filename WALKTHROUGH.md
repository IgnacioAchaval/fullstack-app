# Walkthrough

## Estructura del Proyecto

```
.
├── backend/               # API REST con Node.js y Express
│   ├── src/
│   │   ├── models/       # Modelos
│   │   ├── routes/       # Rutas de la API
│   │   └── index.js      # Punto de entrada
│   └── tests/            # Tests unitarios
├── frontend/             # Aplicación React
│   ├── src/
│   │   ├── App.js        # Componente principal
│   │   └── tests/        # Tests unitarios
│   └── public/           # Archivos estáticos
└── tests/                # Tests de integración
```

## Implementación

### Backend

El backend es una API REST simple que maneja tareas. Usa:
- Express para el servidor
- Sequelize para la base de datos
- Jest para tests

La API expone estos endpoints:
- `GET /api/tasks` - Lista todas las tareas
- `POST /api/tasks` - Crea una tarea
- `GET /api/tasks/:id` - Obtiene una tarea
- `PUT /api/tasks/:id` - Actualiza una tarea
- `DELETE /api/tasks/:id` - Elimina una tarea

### Frontend

El frontend es una aplicación React simple que:
- Muestra una lista de tareas
- Permite crear nuevas tareas
- Permite marcar tareas como completadas
- Permite eliminar tareas

Usa:
- React para la UI
- Axios para llamadas a la API
- Jest para tests

## Tests

### Backend

Los tests unitarios verifican:
- Creación de tareas
- Validación de estados
- Manejo de errores

### Frontend

Los tests unitarios verifican:
- Renderizado de tareas
- Creación de tareas
- Eliminación de tareas

### Integración

Los tests de integración verifican:
- Ciclo CRUD completo
- Persistencia de datos
- Manejo de errores

## Despliegue

La aplicación se despliega en AWS usando:
- EC2 para los contenedores
- GitHub Actions para CI/CD

El pipeline de CI/CD:
1. Ejecuta tests
2. Construye imágenes Docker
3. Despliega en AWS
