# Casos de Prueba

Este documento detalla la implementación de los tests en la aplicación de gestión de tareas.

## Tests Unitarios

### Backend

#### Modelo Task
1. **Schema de la Base de Datos**
   - Verifica que el modelo Task tenga todos los campos requeridos
   - Valida los tipos de datos de cada campo
   - Comprueba las restricciones de los campos

2. **Campos Requeridos**
   - Verifica que title sea requerido
   - Verifica que status sea requerido
   - Verifica que createdAt y updatedAt se generen automáticamente

3. **Valores por Defecto**
   - Verifica que status tenga valor por defecto 'pending'
   - Verifica que description sea opcional

4. **UUID**
   - Verifica que el campo id sea de tipo UUID
   - Verifica que se genere automáticamente

5. **Timestamps**
   - Verifica que createdAt se genere al crear
   - Verifica que updatedAt se actualice al modificar

6. **Status ENUM**
   - Verifica que status solo acepte valores válidos
   - Verifica que status tenga valor por defecto 'pending'

### Frontend

#### App Component
1. **Renderizado Inicial**
   - Verifica que se muestre la lista de tareas
   - Verifica que se muestre el formulario de nueva tarea
   - Verifica que se muestren los botones de acción

2. **Creación de Tareas**
   - Verifica que se pueda crear una nueva tarea
   - Verifica que el formulario se limpie después de crear
   - Verifica que la nueva tarea aparezca en la lista

3. **Eliminación de Tareas**
   - Verifica que se pueda eliminar una tarea existente
   - Verifica que la tarea se quite de la lista
   - Verifica que se muestre mensaje de confirmación

## Tests de Integración

### API Endpoints

1. **Crear Tarea (POST /api/tasks)**
   - Verifica creación exitosa (201)
   - Verifica que se requieran campos obligatorios
   - Verifica que se validen los tipos de datos
   - Verifica que se genere UUID
   - Verifica que se generen timestamps

2. **Obtener Tarea (GET /api/tasks/:id)**
   - Verifica obtención exitosa (200)
   - Verifica que se devuelvan todos los campos
   - Verifica manejo de tarea no encontrada (404)

3. **Actualizar Tarea (PUT /api/tasks/:id)**
   - Verifica actualización exitosa (200)
   - Verifica que se actualicen solo los campos enviados
   - Verifica que se actualice el timestamp
   - Verifica manejo de tarea no encontrada (404)

4. **Eliminar Tarea (DELETE /api/tasks/:id)**
   - Verifica eliminación exitosa (204)
   - Verifica que la tarea se elimine de la base de datos
   - Verifica manejo de tarea no encontrada (404)

### Flujos Completos

1. **Ciclo CRUD Completo**
   - Crea una nueva tarea
   - Obtiene la tarea creada
   - Actualiza la tarea
   - Verifica los cambios
   - Elimina la tarea
   - Verifica que no exista

2. **Manejo de Errores**
   - Verifica validación de campos requeridos
   - Verifica validación de tipos de datos
   - Verifica manejo de IDs inválidos
   - Verifica manejo de tareas no encontradas

3. **Persistencia de Datos**
   - Verifica que los datos persistan entre operaciones
   - Verifica que los timestamps se actualicen correctamente
   - Verifica que los estados se mantengan consistentes

## Ejecución de Tests

### Tests Unitarios
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Tests de Integración
```bash
cd tests
npm install
npm test
``` 