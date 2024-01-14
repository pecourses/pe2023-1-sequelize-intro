'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    static associate (models) {
      Subject.belongsToMany(models.Student, {
        through: 'StudentSubjects',
        foreignKey: 'subjectId',
      });
    }
  }
  Subject.init(
    {
      title: DataTypes.STRING,
      hours: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Subject',
    }
  );
  return Subject;
};
