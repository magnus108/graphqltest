'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.bulkInsert('Permission', [{
        object: 'group',
        createdAt: 'now()',
        updatedAt: 'now()'
      },{
        object: 'group:id/people',
        createdAt: 'now()',
        updatedAt: 'now()'
      },{
        object: 'travel:id/group',
        createdAt: 'now()',
        updatedAt: 'now()'
      },{
        object: 'group:id/travels',
        createdAt: 'now()',
        updatedAt: 'now()'
      },{
        object: 'person',
        createdAt: 'now()',
        updatedAt: 'now()'
      },{
        object: 'person:id/group',
        createdAt: 'now()',
        updatedAt: 'now()'
      }], {});
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Permission', null, {});
  }
};
