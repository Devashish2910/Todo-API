const Sequelize = require('sequelize');
const sequelize = new Sequelize(undefined, undefined, undefined, {
  dialect: 'sqlite',
  storage: __dirname + '/data/todo-api.sqlite'
});

let db = {};

db.todos = sequelize.import(__dirname + '/models/todos.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
