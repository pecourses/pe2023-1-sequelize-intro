'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // GroupId
      Student.belongsTo(models.Group, {
        foreignKey: 'groupId',
      });
      Student.belongsToMany(models.Subject, {
        through: 'StudentSubjects',
        foreignKey: 'studentId',
      });
    }
  }
  /* Обмеження
PRIMARY KEY - primaryKey
UNIQUE - unique (constraint)
CHECK - validate (validator)
NOT NULL - allowNull (validator + constraint),
FOREIGN KEY

constraint - db
validator - app
*/

  Student.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-Z][a-z]+$/,
          len: [2, 64],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-Z][a-z]+$/,
          len: [2, 64],
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true },
      },
      birthday: {
        type: DataTypes.DATE,
        validate: { isBefore: new Date().toISOString() },
      },
      isMale: DataTypes.BOOLEAN,
      activitiesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: { min: 0 },
      },
    },
    {
      sequelize,
      modelName: 'Student',
    }
  );
  return Student;
};
