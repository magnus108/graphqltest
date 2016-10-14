'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Tokens', [{
        uuid: 'john@mail.dk',
        createdAt: 'now()',
        updatedAt: 'now()'
      }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tokens', null, {});
  }
};
