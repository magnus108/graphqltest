'use strict';
module.exports = function(sequelize, DataTypes) {
  var RolePerson = sequelize.define('RolePerson', {
    personId: DataTypes.STRING,
    roleId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return RolePerson;
};