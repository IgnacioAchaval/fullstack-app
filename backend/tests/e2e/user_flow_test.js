// backend/tests/e2e/user_flow_test.js
Feature('User Flow');

Scenario('create & list a user', async ({ I }) => {
  I.amOnPage('/');
  I.fillField('Nombre','Carlos');
  I.fillField('Email','carlos@example.com');
  I.click('Agregar');
  I.waitForText('Carlos - carlos@example.com', 5);
});