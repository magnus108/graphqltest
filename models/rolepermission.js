'use strict';
module.exports = function(sequelize, DataTypes) {
  var RolePermission = sequelize.define('RolePermission', {
    roleId: DataTypes.STRING,
    permissionId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return RolePermission;
};
