import { I } from 'codeceptjs';
import { Actor } from 'codeceptjs';

declare const I: CodeceptJS.I;

Feature('Home Page');

Scenario('should load the home page', ({ I }) => {
  // Navigate to the home page
  I.amOnPage('/');

  // Check if the page title is correct
  I.seeInTitle('Fullstack App');

  // Check if the main content is visible
  I.seeElement('main');
});

Scenario('should have working navigation', ({ I }) => {
  // Navigate to the home page
  I.amOnPage('/');

  // Check if navigation links are present
  I.seeNumberOfElements('nav a', 3); // Adjust based on your actual navigation items

  // Click on a navigation link and verify the URL changes
  I.click('nav a');
  I.seeInCurrentUrl('/about'); // Adjust based on your actual routes
});