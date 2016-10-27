'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Travel', [{
        destination: 'America',
        status: 'full',
        createdAt: 'now()',
        updatedAt: 'now()'
    },{
        destination: 'Africa',
        status: 'full',
        createdAt: 'now()',
        updatedAt: 'now()'
    },{
        destination: 'Thailand',
        status: 'full',
        createdAt: 'now()',
        updatedAt: 'now()'
    },{
        destination: 'Italy',
        status: 'full',
        createdAt: 'now()',
        updatedAt: 'now()'
    },{
        destination: 'Vietnam',
        status: 'dep',
        createdAt: 'now()',
        updatedAt: 'now()'
    },{
        destination: 'Brazil',
        status: 'dep',
        createdAt: 'now()',
        updatedAt: 'now()'
    }], {});
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Travel', null, {});
  }
};
