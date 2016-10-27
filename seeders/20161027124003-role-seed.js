'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Role', [{
        name: 'traveler',
        createdAt: 'now()',
        updatedAt: 'now()'
      }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Role', null, {});
  }
};
