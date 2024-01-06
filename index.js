// sync db by model
const { sequelize, Student } = require('./models');
const { Op } = require('sequelize');

// DROP TABLE IF EXISTS "Students" CASCADE;
// CREATE TABLE IF NOT EXISTS "Students" (
//   "id"   SERIAL ,
//   "firstName" VARCHAR(255) NOT NULL,
//   "lastName" VARCHAR(255) NOT NULL,
//   "email" VARCHAR(255) UNIQUE,
//   "birthday" TIMESTAMP WITH TIME ZONE,
//   "isMale" BOOLEAN,
//   "activitiesCount" INTEGER DEFAULT 0,
//   "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
//   "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
//   PRIMARY KEY ("id")
// );

// sequelize
//   .sync({ force: true })
//   .then(() => console.log('Sync Ok'))
//   .catch(err => console.log('err :>> ', err));

(async function () {
  // CRUD
  //
  // C - INSERT - create --------------------------
  //
  // INSERT INTO "Students" ("id","firstName","lastName","email","birthday","isMale","activitiesCount","createdAt","updatedAt")
  // VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8)
  // RETURNING "id","firstName","lastName","email","birthday","isMale","activitiesCount","createdAt","updatedAt";

  const newStudent = {
    firstName: 'Test',
    lastName: 'Testovych',
    email: 'm@m6.com',
    birthday: '1990-06-11',
    isMale: true,
  };

  const createdStudent = await Student.create(newStudent);
  console.log('createdStudent :>> ', createdStudent.get()); // get() -> plain object

  // R - SELECT - findAll / findOne / findByPk -----------------------------
  //
  // SELECT "id", "firstName", "lastName", "email", "birthday", "isMale", "activitiesCount", "createdAt", "updatedAt"
  // FROM "Students" AS "Student";

  const foundStudents = await Student.findAll({ raw: true }); // { raw: true } -> plain object
  console.log('foundStudents :>> ', foundStudents);

  const foundStudent = await Student.findByPk(1, { raw: true }); // пошук по primary key
  console.log('foundStudent :>> ', foundStudent);

  // Проєкція - attributes -----
  // SELECT firstName, email ...

  const foundStudents = await Student.findAll({
    raw: true,
    attributes: ['firstName', 'email'],
  });
  console.log('foundStudents :>> ', foundStudents);

  // Проєкція "навпаки" - exclude

  // вивести все окрім 'createdAt', 'updatedAt'
  const foundStudents = await Student.findAll({
    raw: true,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  console.log('foundStudents :>> ', foundStudents);

  // Пагінація + сортування -----
  //
  // сортування - ORDER BY - order
  // пагінація - LIMIT OFFSET - limit offset
  //
  // SELECT "id", "firstName", "lastName", "email", "birthday", "isMale", "activitiesCount"
  // FROM "Students" AS "Student"
  // ORDER BY "Student"."id" DESC
  // LIMIT 2 OFFSET 2;

  const foundStudents = await Student.findAll({
    raw: true,
    order: [['id', 'DESC']],
    limit: 2,
    offset: 2,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
  console.log('foundStudents :>> ', foundStudents);

  // Task: Додати дані в таблицю
  // і отримати другу сторінку при перегляді по 3 рядки,
  // впорядкувавши за іменем

  const foundStudent = await Student.findAll({
    raw: true,
    order: ['firstName'],
    limit: 3,
    offset: 3,
  });
  console.log(foundStudent);

  // Фільтрація -----
  // WHERE - where

  // id = 3;
  const foundStudent = await Student.findAll({
    raw: true,
    where: {
      id: 3,
    },
  });
  console.log(foundStudent);

  // isMale = true AND email = 'm@m2.com'
  const foundStudent = await Student.findAll({
    raw: true,
    where: {
      isMale: true,
      email: 'm@m2.com',
    },
  });
  console.log(foundStudent);

  // const { Op } = require('sequelize'); - операції <>, <, <=, IN, ...

  // id = 5 OR email = 'm@m.com'
  const foundStudent = await Student.findAll({
    raw: true,
    where: {
      [Op.or]: [{ id: 5 }, { email: 'm@m.com' }],
    },
  });
  console.log(foundStudent);

  // Task: Вивести чоловіків або у кого кількість активностей = 0
  const foundStudent = await Student.findAll({
    raw: true,
    where: {
      [Op.or]: [{ isMale: true }, { activitiesCount: 0 }],
    },
  });
  console.log(foundStudent);

  // Використання функцій -----
  // sequelize.fn('ФУНКЦІЯ', sequelize.col('СТОВПЧИК'))

  // Додати COUNT(id)
  const studentsCount = await Student.findAll({
    raw: true,
    attributes: [sequelize.fn('COUNT', sequelize.col('id'))],
  });
  console.log('studentsCount :>> ', studentsCount);

  // + Додавання стовпчика - include

  // Додати стовпчик з віком
  const foundStudents = await Student.findAll({
    raw: true,
    attributes: {
      include: [[sequelize.fn('age', sequelize.col('birthday')), 'stud_age']],
    },
  });
  console.log('foundStudents :>> ', foundStudents);

  // Нестандартні для sequelize операції прописуються чистим SQL:
  // sequelize.literal('SQL-код')

  const foundStudents = await Student.findAll({
    raw: true,
    attributes: {
      include: [
        [sequelize.literal('EXTRACT (YEAR FROM age(birthday))'), 'stud_age'],
      ],
    },
  });
  console.log('foundStudents :>> ', foundStudents);

  // *GROUP BY + HAVING - group + having -----

  const foundStudents = await Student.findAll({
    raw: true,
    attributes: [
      'isMale',
      [
        sequelize.fn('sum', sequelize.col('activitiesCount')),
        'stud_activitiesCount',
      ],
    ],
    group: 'isMale',
    having: sequelize.literal('sum("activitiesCount") >= 0'),
  });
  console.log('foundStudets :>> ', foundStudents);

  // U - UPDATE - update (як, опції)
  // => [ кількість_оновлених ]                без returning: true
  // => [ кількість_оновлених, масив оновлених ] з returning: true

  const updatedStudent = await Student.update(
    { firstName: 'Ivo' },
    {
      where: { id: 1 },
      raw: true,
      returning: true, // повернути оновлений рядок
    }
  );

  console.log('updatedStudent :>> ', updatedStudent[1][0]);

  // D - DELETE - destroy
  // => кількість оновлених

  const deletedStudCount = await Student.destroy({
    where: {
      id: 1,
    },
  });
  console.log('deletedStudCount :>> ', deletedStudCount);
})();
