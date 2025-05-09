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

# Casos de Prueba E2E

## Gestión de Tareas

### 1. Crear Tarea
- **Objetivo**: Verificar la creación exitosa de una nueva tarea
- **Pasos**:
  1. Acceder a la página principal
  2. Hacer clic en "Nueva Tarea"
  3. Completar el formulario con:
     - Título: "Tarea de prueba"
     - Descripción: "Descripción de prueba"
     - Fecha límite: fecha futura
  4. Hacer clic en "Guardar"
- **Resultado Esperado**: 
  - La tarea aparece en la lista
  - Estado inicial es "pendiente"

### 2. Actualizar Estado
- **Objetivo**: Verificar la actualización del estado de una tarea
- **Pasos**:
  1. Seleccionar una tarea existente
  2. Cambiar el estado a "en progreso"
  3. Guardar cambios
- **Resultado Esperado**: 
  - El estado se actualiza correctamente
  - La fecha de actualización se modifica

### 3. Editar Tarea
- **Objetivo**: Verificar la edición de una tarea existente
- **Pasos**:
  1. Seleccionar una tarea
  2. Modificar título y descripción
  3. Guardar cambios
- **Resultado Esperado**: 
  - Los cambios se reflejan en la lista
  - La fecha de actualización se modifica

### 4. Eliminar Tarea
- **Objetivo**: Verificar la eliminación de una tarea
- **Pasos**:
  1. Seleccionar una tarea
  2. Hacer clic en "Eliminar"
  3. Confirmar eliminación
- **Resultado Esperado**: 
  - La tarea desaparece de la lista
  - Se muestra mensaje de confirmación

### 5. Filtrar Tareas
- **Objetivo**: Verificar el filtrado de tareas por estado
- **Pasos**:
  1. Crear tareas con diferentes estados
  2. Usar el filtro por estado
- **Resultado Esperado**: 
  - Se muestran solo las tareas del estado seleccionado
  - El contador se actualiza correctamente

### 6. Validaciones
- **Objetivo**: Verificar las validaciones del formulario
- **Pasos**:
  1. Intentar crear tarea sin título
  2. Intentar crear tarea con fecha pasada
- **Resultado Esperado**: 
  - Se muestran mensajes de error apropiados
  - No se permite guardar hasta corregir errores

## Integración Backend-Frontend

### 7. Persistencia de Datos
- **Objetivo**: Verificar la persistencia de datos
- **Pasos**:
  1. Crear una tarea
  2. Recargar la página
- **Resultado Esperado**: 
  - La tarea persiste después de recargar
  - Los datos se mantienen en la base de datos

### 8. Manejo de Errores
- **Objetivo**: Verificar el manejo de errores de red
- **Pasos**:
  1. Desconectar la red
  2. Intentar realizar operaciones
- **Resultado Esperado**: 
  - Se muestran mensajes de error apropiados
  - La aplicación no se rompe 