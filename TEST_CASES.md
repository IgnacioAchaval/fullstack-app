# Test Cases de Integración

## Tests de Integración API

### 1. Health Check
- **Endpoint**: GET /health
- **Resultado Esperado**: Status 200, {"status": "ok"}

### 2. CRUD de Tareas
- **Crear**: POST /api/tasks
  - Debe crear una tarea con datos válidos
  - Debe retornar 201 Created
  - Debe retornar los datos de la tarea creada

- **Leer**: GET /api/tasks/:id
  - Debe retornar una tarea con ID válido
  - Debe retornar 200 OK
  - Debe retornar 404 para ID no existente

- **Actualizar**: PUT /api/tasks/:id
  - Debe actualizar una tarea con datos válidos
  - Debe retornar 200 OK
  - Debe retornar los datos actualizados

- **Eliminar**: DELETE /api/tasks/:id
  - Debe eliminar una tarea con ID válido
  - Debe retornar 204 No Content
  - Debe retornar 404 para ID no existente

## Validación de Datos
- Verificar que no se pueden crear tareas sin título
- Verificar que no se pueden crear tareas con datos inválidos
- Verificar que no se pueden editar tareas con datos inválidos 