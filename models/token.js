'use strict';
module.exports = function(sequelize, DataTypes) {
  var Token = sequelize.define('Tokens', {
    Uuid: {
      allowNull: false,
      type: DataTypes.STRING
    },
    PersonEmail: {
      allowNull: false,
      type: DataTypes.INTEGER
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
