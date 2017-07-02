const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
let sequelize;

if(env === 'production') {
  // on heroku environment
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'sqlite'
  });
} else {
  // local environment
  sequelize = new Sequelize(undefined, undefined, undefined, {
    dialect: 'sqlite',
    storage: __dirname + '/data/todo-api.sqlite'
  });
}


let db = {};

db.todos = sequelize.import(__dirname + '/models/todos.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
