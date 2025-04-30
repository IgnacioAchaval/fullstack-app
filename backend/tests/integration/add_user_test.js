Feature('Fullstack E2E');

Scenario('add a new user and see it listed', async ({ I }) => {
  I.amOnPage('/');
  I.fillField('Nombre', 'E2E User');
  I.fillField('Email', 'e2e@example.com');
  I.click('Agregar');
  I.waitForText('E2E User - e2e@example.com', 5);
});