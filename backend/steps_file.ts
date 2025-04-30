import { I } from 'codeceptjs';

// in this file you can append custom step methods to 'I' object

export = function() {
  return actor({
    // Define custom steps here, use 'I' to access codeceptjs predefined methods
    // Example:
    // login: function(email, password) {
    //   I.fillField('Email', email);
    //   I.fillField('Password', password);
    //   I.click('Login');
    // }
  });
}