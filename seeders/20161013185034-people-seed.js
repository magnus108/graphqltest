'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('People', [{
        email: 'john@mail.dk',
        firstname: 'John',
        lastname: 'doe',
        createdAt: 'now()',
        updatedAt: 'now()'
      }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('People', null, {});
  }
};
