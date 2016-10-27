'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Role', [{
        createdAt: 'now()',
        updatedAt: 'now()'
      }], {});
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Group', null, {});
  }
};
