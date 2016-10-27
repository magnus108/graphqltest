'use strict';
module.exports = function(sequelize, DataTypes) {
  var Permission = sequelize.define('Permission', {
    object: {
      primaryKey: true,
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        Permission.belongsToMany(models.Role, { through: { model: models.RolePermission }})
      }
    }
  });
  return Permission;
};
