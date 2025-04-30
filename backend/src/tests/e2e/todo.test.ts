import { I } from 'codeceptjs';

Feature('Todo Management');

Scenario('should create and retrieve a todo', ({ I }) => {
  // Create a new todo
  I.sendPostRequest('/api/todos', {
    text: 'Test Todo'
  });

  // Verify the response
  I.seeResponseCodeIs(201);
  I.seeResponseContainsJson({
    text: 'Test Todo'
  });

  // Get all todos
  I.sendGetRequest('/api/todos');
  I.seeResponseCodeIs(200);
  I.seeResponseContainsJson([{
    text: 'Test Todo'
  }]);
});

Scenario('should delete a todo', ({ I }) => {
  // Create a todo first
  I.sendPostRequest('/api/todos', {
    text: 'Todo to Delete'
  });

  const todoId = I.grabDataFromResponseByJsonPath('$.id')[0];

  // Delete the todo
  I.sendDeleteRequest(`/api/todos/${todoId}`);
  I.seeResponseCodeIs(204);
}); 