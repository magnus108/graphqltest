'use strict';
module.exports = function(sequelize, DataTypes) {
  var Token = sequelize.define('Token', {
    uuid: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Token.belongsTo(models.Person, {onUpdate: 'cascade'})
      }
    }
  });
  return Token;
};
