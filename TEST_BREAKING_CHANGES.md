# Test Breaking Changes

Este documento contiene las modificaciones implementadas que romperán los tests. Útil para verificar que los tests están funcionando correctamente.

## Backend Unit Tests

En `backend/src/models/Task.js`:

```javascript
const Task = sequelize.define('Task', {
  // ... otros campos ...
  status: {
    // TESTS PASSING VERSION
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    // TESTS BREAKING VERSION
    // type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending',
  },
  // ... otros campos ...
});
```

**Relación con los tests:**
- Los tests unitarios del backend verifican que el modelo Task acepte todos los estados válidos
- Al remover 'in_progress' del enum, los tests fallarán porque:
  1. No se podrá crear una tarea con estado 'in_progress'
  2. No se podrá actualizar una tarea a estado 'in_progress'
  3. Los tests que verifican la validación del enum fallarán al intentar usar un valor no permitido

## Frontend Unit Tests

En `frontend/src/App.js`:

```javascript
const handleSubmit = async () => {
  try {
    // ... validación inicial ...
    
    // TESTS PASSING VERSION
    const response = await axios.post('/api/tasks', currentTask);
    
    // TESTS BREAKING VERSION
    // const response = await axios.post('/api/tasks', {
    //   title: currentTask.title,
    //   status: currentTask.status
    // });
    
    // ... resto del código ...
  } catch (error) {
    console.error('Error creating task:', error);
    setError(error.message);
  }
};
```

**Relación con los tests:**
- El test `'adds a new task'` en `App.test.js` verifica que se envíen todos los campos requeridos
- Al remover el campo `description`, el test fallará porque:
  1. El mock de axios espera recibir un objeto con title, description y status
  2. La aserción `expect(axios.post).toHaveBeenCalledWith()` fallará al no coincidir los objetos
  3. El test verifica específicamente que se envíe la descripción junto con los otros campos

## Integration Tests

En `backend/src/models/index.js`:

```javascript
const dbConfig = {
  // TESTS PASSING VERSION
  host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
  // TESTS BREAKING VERSION
  // host: 'invalid-host',
  port: process.env.POSTGRES_PORT || process.env.DB_PORT || 5432,
  // ... resto de la configuración ...
};
```

**Relación con los tests:**
- Los tests de integración verifican el ciclo CRUD completo a través de la API
- Al usar un host inválido, los tests fallarán porque:
  1. La conexión a la base de datos fallará
  2. No se podrán crear tareas (POST /api/tasks)
  3. No se podrán leer tareas (GET /api/tasks/:id)
  4. No se podrán actualizar tareas (PUT /api/tasks/:id)
  5. No se podrán eliminar tareas (DELETE /api/tasks/:id)
  6. Los tests que verifican la persistencia de datos fallarán

## Cómo Usar

1. Para romper los tests unitarios del backend:
   - Comentar la versión que pasa y descomentar la versión que rompe en `Task.js`
   - Ejecutar `cd backend && npm test`

2. Para romper los tests unitarios del frontend:
   - Comentar la versión que pasa y descomentar la versión que rompe en `App.js`
   - Ejecutar `cd frontend && npm test`

3. Para romper los tests de integración:
   - Comentar la versión que pasa y descomentar la versión que rompe en `models/index.js`
   - Ejecutar `cd tests && npm test`

## Restaurar Tests

Para restaurar los tests a su estado funcional:
1. En cada archivo, comentar la versión que rompe los tests
2. Descomentar la versión que hace pasar los tests
3. Ejecutar los tests nuevamente para verificar que pasan 