'use strict';
module.exports = function(sequelize, DataTypes) {
  var PersonGroup = sequelize.define('PersonGroup', {
    id: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return PersonGroup;
};
