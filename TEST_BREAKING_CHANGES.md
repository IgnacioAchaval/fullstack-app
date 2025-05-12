# Test Breaking Changes

Este documento contiene modificaciones que romperán los tests. Útil para verificar que los tests están funcionando correctamente.

## Backend Unit Tests

En `backend/src/models/Task.js`:

```javascript
// Modificación que rompe los tests unitarios del backend
// Comentar la versión original y descomentar esta versión
const Task = sequelize.define('Task', {
  // ... otros campos ...
  status: {
    // Versión que rompe los tests
    type: DataTypes.ENUM('pending', 'completed'), // Removido 'in_progress'
    defaultValue: 'pending',
  },
  // ... otros campos ...
});
```

## Frontend Unit Tests

En `frontend/src/App.js`:

```javascript
// Modificación que rompe los tests unitarios del frontend
// Comentar la versión original y descomentar esta versión
const handleAddTask = async (e) => {
  e.preventDefault();
  try {
    // Versión que rompe los tests
    await axios.post('/api/tasks', {
      title: newTask.title,
      // description: newTask.description, // Comentar esta línea
      status: 'pending'
    });
    // ... resto del código ...
  } catch (error) {
    console.error('Error adding task:', error);
  }
};
```

## Integration Tests

En `backend/src/routes/tasks.js`:

```javascript
// Modificación que rompe los tests de integración
// Comentar la versión original y descomentar esta versión
router.post('/', async (req, res) => {
  try {
    // Versión que rompe los tests
    const task = await Task.create({
      title: req.body.title,
      // description: req.body.description, // Comentar esta línea
      status: req.body.status || 'pending'
    });
    res.status(201).json({ data: task });
  } catch (error) {
    // Versión que rompe los tests
    res.status(500).json({ error: 'Internal Server Error' }); // Cambiar a 500 en lugar de 400
  }
});
```

## Cómo Usar

1. Para romper los tests unitarios del backend:
   - Modificar el enum de status en el modelo Task
   - Ejecutar `cd backend && npm test`

2. Para romper los tests unitarios del frontend:
   - Modificar el handleAddTask en App.js
   - Ejecutar `cd frontend && npm test`

3. Para romper los tests de integración:
   - Modificar la ruta POST en tasks.js
   - Ejecutar `cd tests && npm test`

## Restaurar Tests

Para restaurar los tests a su estado funcional, simplemente revertir los cambios comentando las versiones que rompen los tests y descomentando las versiones originales. 