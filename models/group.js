'use strict';
module.exports = function(sequelize, DataTypes) {
  var Group = sequelize.define('Group', {
    id:{
      primaryKey: true,
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        Group.belongsToMany(models.Person, { through: { model: models.PersonGroup}})
        Group.hasMany(models.Travel, { onDelete: 'SET NULL', onUpdate: 'cascade'})
      }
    }
  });
  return Group;
};
