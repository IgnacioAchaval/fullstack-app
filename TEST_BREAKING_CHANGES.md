# Test Breaking Changes

Este documento muestra cómo romper los tests para verificar que están funcionando correctamente.

## Backend Unit Tests

En `backend/src/models/Task.js`:

```javascript
const Task = sequelize.define('Task', {
  status: {
    // TESTS PASSING VERSION
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    // TESTS BREAKING VERSION
    // type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending',
  },
});
```

Los tests fallarán porque:
- No se podrá crear ni actualizar tareas con estado 'in_progress'
- Los tests que validan el enum fallarán al intentar usar 'in_progress'

## Frontend Unit Tests

En `frontend/src/App.js`:

```javascript
const handleSubmit = async () => {
  try {
    // TESTS PASSING VERSION
    const response = await axios.post('/api/tasks', currentTask);
    
    // TESTS BREAKING VERSION
    // const response = await axios.post('/api/tasks', {
    //   title: currentTask.title,
    //   status: currentTask.status
    // });
  } catch (error) {
    setError(error.message);
  }
};
```

Los tests fallarán porque:
- El mock de axios espera recibir title, description y status
- La aserción `expect(axios.post).toHaveBeenCalledWith()` fallará al no enviar description

## Integration Tests

En `backend/src/models/index.js`:

```javascript
const dbConfig = {
  // TESTS PASSING VERSION
  host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
  // TESTS BREAKING VERSION
  // host: 'invalid-host',
  port: process.env.POSTGRES_PORT || process.env.DB_PORT || 5432,
};
```

Los tests fallarán porque:
- La conexión a la base de datos fallará
- No se podrán realizar operaciones CRUD
- Los tests de persistencia de datos fallarán

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

Para restaurar los tests:
1. Comentar la versión que rompe los tests
2. Descomentar la versión que hace pasar los tests
3. Ejecutar los tests nuevamente 