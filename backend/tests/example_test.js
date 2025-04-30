// tests/example_test.js

Feature('Home Page');

Scenario('Verificar página de inicio', ({ I }) => {
  // 1. Ir a la raíz configurada en codecept.conf.js
  I.amOnPage('/');

  // 2. Ver que aparezca un texto específico
  I.see('Usuarios'); 
});