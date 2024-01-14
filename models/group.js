'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Group.hasMany(models.Student, {
        foreignKey: {
          name: 'groupId',
          allowNull: false,
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }
  Group.init(
    {
      title: DataTypes.STRING,
      enteredAt: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: 'Group',
    }
  );
  return Group;
};
