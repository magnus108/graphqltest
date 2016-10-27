'use strict';
module.exports = function(sequelize, DataTypes) {
  var Role = sequelize.define('Role', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Role.belongsToMany(models.Person, { through: { model: models.RolePerson }})
        Role.belongsToMany(models.Permission, { through: { model: models.RolePermission }})
      }
    }
  });
  return Role;
};
