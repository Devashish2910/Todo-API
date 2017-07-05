// database connection
const db = require("./db.js");

// authentication
let auth = require('./auth.js');

// token
let token = require('./token.js')();

// middleware
const middleware = require('./middleware.js')();

// express module initialization
const express = require("express");
const app = express();

// bcrypto module
const bcrypto = require("bcryptjs");

// body-parser module initialization
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// underscore module initialization
const _ = require("underscore");

// port number assignment
const port = process.env.PORT || 3000;

// data structure initialization
let todos = [];

// API Root
app.get('/',(req, res) => {
  res.status(200).send("To do API root");
});

// POST request for taking data from user (C - Create Operation)
app.post('/todos', middleware.requireAuthentication,(req, res) => {
  // pick valid values from user
  const userData = _.pick(req.body, 'description', 'status');

  // check if 'description' & 'status' is valid or send 400
  if(!_.isString(userData.description) || userData.description.trim().length === 0) {
    res.status(400).send("Sorry, you haven't passed valid data.");
  }
  db.todos.create(userData)
  .then((todo) => {
    //Sucessfully inserted
    req.user.addTodo(todo)
    .then(() => {
      todo.reload()
      .then((cur) => {
        res.status(200).json(cur.toJSON());
      });
    });
  })
  .catch((err) => {
    res.send(err);
  });
});

// GET request for showing data to user (R - Read Operation)
app.get('/todos', middleware.requireAuthentication,(req, res) => {
  const queryPram = req.query;
  let where = {};

  // check if has query parameter 'status'
  if(queryPram.hasOwnProperty('status') && (queryPram.status === 'unfinished' || queryPram.status === 'false')) {
    where.status = {$not: true};
  } else if(queryPram.hasOwnProperty('status') && (queryPram.status === 'finished' || queryPram.status === 'true')) {
    where.status = {$not: false};
  }

  // check if has query parameter 'q'
  if(queryPram.hasOwnProperty('q')) {
    where.description = {
      $iLike: `%${queryPram.q}%`
    };
  }
  // go to middle where and take users id from Users table
  where.userId = req.user.get('id');

  // find in database
  db.todos.findAll({where: where})
  .then((cur) => {
      res.json(cur);
  })
  .catch((err) => {
    res.status(500).send();
  });
});

// GET request for showing data by id
app.get('/todos/:id', middleware.requireAuthentication, (req, res) => {
  // convert id into interger
  const id = parseInt(req.params.id);
  let where = {};
  where.id = id;
  where.userId = req.user.get('id');
  // find from database
  db.todos.findOne({where: where})
  .then((cur) => {

    if(!!cur){ // !! if object comes with data or not
      res.json(cur.toJSON());
    } else {
      res.status(404).send("No data found");
    }

  })
  .catch((err) => {
    res.status(500).send();
  });
});

// PUT request for editing vaulues (U - Update Operation)
app.put('/todos/:id', middleware.requireAuthentication, (req, res) => {
  // convert id to integert
  const id = parseInt(req.params.id);
  let where = {};
  where.id = id;

  // get data from data structure
  let cur = _.findWhere(todos, {id: id});

  // user Input
  let userInput= {};
  // pick only necessary information
  const userData = _.pick(req.body, 'description', 'status');

  // update description
  if(req.body.hasOwnProperty('description') && _.isString(req.body.description) && req.body.description.trim().length > 0) {
    // update the value
     userInput.description = req.body.description.trim();
  } else if (req.body.hasOwnProperty('description')) {
    // return 400
    res.status(400).send("Not appropriate value");
  }

  // update status
  if(req.body.hasOwnProperty('status') && _.isBoolean(req.body.status)) {
    // update the value
     userInput.status = req.body.status;
  } else if (req.body.hasOwnProperty('status')) {
    // return 400
    res.status(400).send("Not appropriate value");
  }

  where.userId = req.user.get('id');
  // update in database
  db.todos.findOne({where: where})
  .then(cur => {
    // update with userData
    cur.update(userData)
    .then(cur => {
      // successful update
      if(!!cur) {
        res.status(200).json(cur);
      } else {
        res.sattus(400).send();
      }
    })
    .catch(err => {
      // no data found
      res,status(404).send(err);
    })
  })
  .catch(err => {
    // something weird happened
    res.status(500).send(err);
  })
});

// Delete element (D - Delete Operation)
app.delete('/todos/:id', middleware.requireAuthentication,(req, res) => {
  // convert id into integer
  const id = parseInt(req.params.id);
  let where = {};
  where.id = id;
  where.userId = req.user.get('id');

  db.todos.destroy({where: where})
  .then((cur) => {
    res.send("Deleted Sucessfully");
  })
  .catch((err) => {
    res.status(404).send('No data found');
  });
});

/*------------------------------------USERS SECTION START-----------------------------------------*/

// POST request for User Create (SIGN UP)
app.post('/users', (req, res) => {
  // take only email and password
  const userData = _.pick(req.body, 'email', 'password');

  // add it to database
  db.users.create(userData)
  .then(cur => {
    res.json(cur.toJSON());
  })
  .catch(err => {
    // something went wrong
    res.status(400).send(err);
  });
});

// POST request for User Login (LOG IN)
app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, 'email', 'password');
  let userInst;

  auth(body).then((user) => {
    const generatedToken = token.createToken(user.id, 'authentication');
    userInst = user;
    db.token.create({
       token: generatedToken
     }).then(tokenInstance => {
       res.header('Auth', tokenInstance.get('token')).status(200).send(JSON.stringify({id: userInst.id, email: userInst.email}, null, 4));
     });

  })
  .catch(()=>{
    res.status(401).send();
  });

});

// DELETE users/login
app.delete('/users/login', middleware.requireAuthentication, (req, res) => {
  req.token.destroy().then(() => {
    res.status(204).send();
  })
  .catch(() => {
    res.status(500).send();
  });
});

// app listening
db.sequelize.sync().then(() => {
  // initialize port for app
  app.listen(port, () => {
    console.log("Application Stated On Port:" + port);
  });
});
