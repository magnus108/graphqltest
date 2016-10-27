'use strict';
module.exports = function(sequelize, DataTypes) {
  var Person = sequelize.define('Person', {
    email:{
      primaryKey: true,
      allowNull: false,
      validate: {
        isEmail: true
      },
      type: DataTypes.STRING
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Person.hasMany(models.Tokens, {onDelete: 'cascade', onUpdate: 'cascade'})
      }
    }
  });
  return Person;
};
