'use strict';
module.exports = function(sequelize, DataTypes) {
  var Travel = sequelize.define('Travel', {
    destination: {
      allowNull: false,
      type: DataTypes.STRING
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Travel.belongsTo(models.Group, { onUpdate: 'cascade'});
      }
    }
  });
  return Travel;
};
