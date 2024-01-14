// sync db by model
const {
  sequelize,
  Student,
  Group,
  Subject,
  StudentSubjects,
} = require('./models');
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

// (async function () {
//   // CRUD
//   //
//   // C - INSERT - create --------------------------
//   //
//   // INSERT INTO "Students" ("id","firstName","lastName","email","birthday","isMale","activitiesCount","createdAt","updatedAt")
//   // VALUES (DEFAULT,$1,$2,$3,$4,$5,$6,$7,$8)
//   // RETURNING "id","firstName","lastName","email","birthday","isMale","activitiesCount","createdAt","updatedAt";

//   const newStudent = {
//     firstName: 'Test',
//     lastName: 'Testovych',
//     email: 'm@m6.com',
//     birthday: '1990-06-11',
//     isMale: true,
//   };

//   const createdStudent = await Student.create(newStudent);
//   console.log('createdStudent :>> ', createdStudent.get()); // get() -> plain object

//   // R - SELECT - findAll / findOne / findByPk -----------------------------
//   //
//   // SELECT "id", "firstName", "lastName", "email", "birthday", "isMale", "activitiesCount", "createdAt", "updatedAt"
//   // FROM "Students" AS "Student";

//   const foundStudents = await Student.findAll({ raw: true }); // { raw: true } -> plain object
//   console.log('foundStudents :>> ', foundStudents);

//   const foundStudent = await Student.findByPk(1, { raw: true }); // пошук по primary key
//   console.log('foundStudent :>> ', foundStudent);

//   // Проєкція - attributes -----
//   // SELECT firstName, email ...

//   const foundStudents = await Student.findAll({
//     raw: true,
//     attributes: ['firstName', 'email'],
//   });
//   console.log('foundStudents :>> ', foundStudents);

//   // Проєкція "навпаки" - exclude

//   // вивести все окрім 'createdAt', 'updatedAt'
//   const foundStudents = await Student.findAll({
//     raw: true,
//     attributes: { exclude: ['createdAt', 'updatedAt'] },
//   });
//   console.log('foundStudents :>> ', foundStudents);

//   // Пагінація + сортування -----
//   //
//   // сортування - ORDER BY - order
//   // пагінація - LIMIT OFFSET - limit offset
//   //
//   // SELECT "id", "firstName", "lastName", "email", "birthday", "isMale", "activitiesCount"
//   // FROM "Students" AS "Student"
//   // ORDER BY "Student"."id" DESC
//   // LIMIT 2 OFFSET 2;

//   const foundStudents = await Student.findAll({
//     raw: true,
//     order: [['id', 'DESC']],
//     limit: 2,
//     offset: 2,
//     attributes: { exclude: ['createdAt', 'updatedAt'] },
//   });
//   console.log('foundStudents :>> ', foundStudents);

//   // Task: Додати дані в таблицю
//   // і отримати другу сторінку при перегляді по 3 рядки,
//   // впорядкувавши за іменем

//   const foundStudent = await Student.findAll({
//     raw: true,
//     order: ['firstName'],
//     limit: 3,
//     offset: 3,
//   });
//   console.log(foundStudent);

//   // Фільтрація -----
//   // WHERE - where

//   // id = 3;
//   const foundStudent = await Student.findAll({
//     raw: true,
//     where: {
//       id: 3,
//     },
//   });
//   console.log(foundStudent);

//   // isMale = true AND email = 'm@m2.com'
//   const foundStudent = await Student.findAll({
//     raw: true,
//     where: {
//       isMale: true,
//       email: 'm@m2.com',
//     },
//   });
//   console.log(foundStudent);

//   // const { Op } = require('sequelize'); - операції <>, <, <=, IN, ...

//   // id = 5 OR email = 'm@m.com'
//   const foundStudent = await Student.findAll({
//     raw: true,
//     where: {
//       [Op.or]: [{ id: 5 }, { email: 'm@m.com' }],
//     },
//   });
//   console.log(foundStudent);

//   // Task: Вивести чоловіків або у кого кількість активностей = 0
//   const foundStudent = await Student.findAll({
//     raw: true,
//     where: {
//       [Op.or]: [{ isMale: true }, { activitiesCount: 0 }],
//     },
//   });
//   console.log(foundStudent);

//   // Використання функцій -----
//   // sequelize.fn('ФУНКЦІЯ', sequelize.col('СТОВПЧИК'))

//   // Додати COUNT(id)
//   const studentsCount = await Student.findAll({
//     raw: true,
//     attributes: [sequelize.fn('COUNT', sequelize.col('id'))],
//   });
//   console.log('studentsCount :>> ', studentsCount);

//   // + Додавання стовпчика - include

//   // Додати стовпчик з віком
//   const foundStudents = await Student.findAll({
//     raw: true,
//     attributes: {
//       include: [[sequelize.fn('age', sequelize.col('birthday')), 'stud_age']],
//     },
//   });
//   console.log('foundStudents :>> ', foundStudents);

//   // Нестандартні для sequelize операції прописуються чистим SQL:
//   // sequelize.literal('SQL-код')

//   const foundStudents = await Student.findAll({
//     raw: true,
//     attributes: {
//       include: [
//         [sequelize.literal('EXTRACT (YEAR FROM age(birthday))'), 'stud_age'],
//       ],
//     },
//   });
//   console.log('foundStudents :>> ', foundStudents);

//   // *GROUP BY + HAVING - group + having -----

//   const foundStudents = await Student.findAll({
//     raw: true,
//     attributes: [
//       'isMale',
//       [
//         sequelize.fn('sum', sequelize.col('activitiesCount')),
//         'stud_activitiesCount',
//       ],
//     ],
//     group: 'isMale',
//     having: sequelize.literal('sum("activitiesCount") >= 0'),
//   });
//   console.log('foundStudets :>> ', foundStudents);

//   // U - UPDATE - update (як, опції)
//   // => [ кількість_оновлених ]                без returning: true
//   // => [ кількість_оновлених, масив оновлених ] з returning: true

//   const updatedStudent = await Student.update(
//     { firstName: 'Ivo' },
//     {
//       where: { id: 1 },
//       raw: true,
//       returning: true, // повернути оновлений рядок
//     }
//   );

//   console.log('updatedStudent :>> ', updatedStudent[1][0]);

//   // D - DELETE - destroy
//   // => кількість оновлених

//   const deletedStudCount = await Student.destroy({
//     where: {
//       id: 1,
//     },
//   });
//   console.log('deletedStudCount :>> ', deletedStudCount);
// })();

//

(async function () {
  //   student n:1 group
  //  Student(firstName, ..., groupId REFERENCES group)

  const newGroup1 = { title: 'pe2022-1', enteredAt: '2022-01-01' };
  const newGroup2 = { title: 'pe2023-1', enteredAt: '2023-01-01' };

  // const createdGroup1 = await Group.create(newGroup1);
  // const createdGroup2 = await Group.create(newGroup2);

  // console.log(createdGroup1, createdGroup2);

  const newStudent1 = {
    firstName: 'Test',
    lastName: 'Testovych',
    email: 'm@m1.com',
    groupId: 1,
  };

  const newStudent2 = {
    firstName: 'Test',
    lastName: 'Testovych',
    email: 'm@m2.com',
    groupId: 1,
  };

  const newStudent3 = {
    firstName: 'Test',
    lastName: 'Testovych',
    email: 'm@m3.com',
    groupId: 2,
  };

  // const createdStudent1 = await Student.create(newStudent1);
  // const createdStudent2 = await Student.create(newStudent2);
  // const createdStudent3 = await Student.create(newStudent3);
  // console.log(createdStudent1, createdStudent2, createdStudent3);

  // Eager Loading ~ JOINS - отримаємо інформацію з усіх моделей (foreign keys)
  // const foundStudentsWithGroups = await Student.findAll({
  //   raw: true,
  //   include: 'Group',
  // });

  // console.log('foundStudentsWithGroups :>> ', foundStudentsWithGroups);

  // const foundGroupsWithStudents = await Group.findAll({
  //   raw: true,
  //   include: 'Student',
  // });
  // console.log('foundGroupsWithStudents :>> ', foundGroupsWithStudents);

  // Lazy loading - отримаємо інформацію з пов'язаної моделі (associations)

  //  Student.belongsTo => student.getGroup(), ...
  // const student1Inst = await Student.findByPk(1);
  // const groupOfStud1 = await student1Inst.getGroup({ raw: true });
  // console.log('groupOfStud1 :>> ', groupOfStud1);

  // Group.hasMany => group.getStudents(), ...
  // const group1Inst = await Group.findByPk(1);
  // const studOfGroup1 = await group1Inst.getStudents({ raw: true });
  // console.log('studOfGroup1 :>> ', studOfGroup1);

  // Student m:n Subject => students <= students_to_subjects => subjects

  const subject1 = { title: 'Data Bases', hours: 100 };
  const subject2 = { title: 'Web-programming', hours: 150 };

  const studSubj1 = { studentId: 1, subjectId: 1, mark: 100 };
  const studSubj2 = { studentId: 1, subjectId: 2, mark: 90 };
  const studSubj3 = { studentId: 2, subjectId: 1, mark: 85 };
  const studSubj4 = { studentId: 2, subjectId: 2, mark: 88 };

  // await Subject.create(subject1);
  // await Subject.create(subject2);

  // await StudentSubjects.create(studSubj1);
  // await StudentSubjects.create(studSubj2);
  // await StudentSubjects.create(studSubj3);
  // await StudentSubjects.create(studSubj4);

  // Eager Loading

  // const studentsWithSubjects = await Student.findAll({
  //   raw: true,
  //   include: Subject,
  // });
  // console.log('studentsWithSubjects :>> ', studentsWithSubjects);

  // Lazy Loading

  // Student.belongsToMany => student.getSubjects
  // Subject.belongsToMany => subject.getStudents

  const student1Inst = await Student.findByPk(1);
  const subjOfStud1 = await student1Inst.getSubjects({ raw: true });
  console.log('subjOfStud1 :>> ', subjOfStud1);
})();
