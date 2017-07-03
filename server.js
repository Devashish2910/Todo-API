// database connection
const db = require("./db.js");

// express module initialization
const express = require("express");
const app = express();

// body-parser module initialization
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// underscore module initialization
const _ = require("underscore");

// port number assignment
const port = process.env.PORT || 3000;

// data structure initialization
let todos = [];

// function for creating id
const createId = function() {
  if(todos.length === 0) {
    // return 1
    return 1;
  } else {
    // calculate id
    return todos[todos.length - 1].id + 1;
  }
};

// POST request for taking data from user (C - Create Operation)
app.post('/todos', (req, res) => {
  // pick valid values from user
  const userData = _.pick(req.body, 'description', 'status');

  // check if 'description' & 'status' is valid or send 400
  if(!_.isString(userData.description) || userData.description.trim().length === 0) {
    res.status(400).send("Sorry, you haven't passed valid data.");
  }

  //userData.description = userData.desdescription.trim();
  console.log(userData);
  // add data to database
  db.todos.create(userData)
  .then((cur) => {
    res.status(200).json(cur.toJSON());
  })
  .catch((err) => {
    res.status(400).json(err);
  });
/*
  // pick valid object vaulues from user
  const userData = _.pick(req.body, 'description', 'status');

  // add id of that data
  userData.id = createId();
  userData.description = userData.description.trim();
  userData.createdDate = new Date().toString();

  // check if 'description' & 'status' is valid or send 400
  if(!_.isString(userData.description) || !_.isBoolean(userData.status) || userData.description.length === 0) {
    res.status(400).send("Sorry, you haven't passed valid data.");
  }

  // add object to the data structure
  todos.push(userData);

  // send response back to client
  res.json(userData);
*/
});

// GET request for showing data to user (R - Read Operation)
app.get('/todos', (req, res) => {
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

  // find in database
  db.todos.findAll({where: where})
  .then((cur) => {
      res.json(cur);
  })
  .catch((err) => {
    res.status(500).send();
  });

/*
  let allTodos = todos;
  const queryPram = req.query;

  // check if has query parameter 'status'
  if(queryPram.hasOwnProperty('status') && (queryPram.status === 'unfinished' || queryPram.status === 'false')) {
    // return unfinised/false todos
    allTodos = _.where(allTodos, {status: false});
  } else if (queryPram.hasOwnProperty('status') && (queryPram.status === 'finished' || queryPram.status === 'true')) {
    // return finished/true todos
    allTodos = _.where(allTodos, {status: true});
  }

  // check if has query parameter 'q'
  if(queryPram.hasOwnProperty('q')) {
    // return unfinised/false todos
    allTodos = _.filter(allTodos, (cur) => {
      return cur.description.toLowerCase().indexOf(queryPram.q.trim().toLowerCase()) > -1;
    });
  }

  // send data back
  if(allTodos.length > 0) {
    res.json(allTodos);
  } else {
    res.status(404).send("No data found.");
  }
*/
});

// GET request for showing data by id
app.get('/todos/:id', (req, res) => {
  // convert id into interger
  const id = parseInt(req.params.id);

  // find from database
  db.todos.findById(id)
  .then((cur) => {
    //res.send(typeof cur);
    if(!!cur){ // !! if object comes with data or not
      res.json(cur.toJSON());
    } else {
      res.status(404).send("No data found");
    }

  })
  .catch((err) => {
    res.status(500).send();
  });
  /*
  // convert parameter to int
  const id = parseInt(req.params.id);

  // check if available or send 404
  const data = _.findWhere(todos, {id: id});

  //send back to user
  if(data !== undefined) {
    res.json(data);
  } else {
    res.status(404).send("No data found.");
  }
  */
});

// PUT request for editing vaulues (U - Update Operation)
app.put('/todos/:id', (req, res) => {
  // convert id to integert
  const id = parseInt(req.params.id);

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

  // update in database
  db.todos.findById(id)
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
/*
  // update the date edited
  userInput.updatedOn = new Date().toString();

  // change element
  if(cur !== undefined) {
    _.extend(cur, userInput);
    cur.status = "Deleted";
    res.json(cur);
  } else {
    res.status(404).send("No data found");
  }
*/
});

// Delete element (D - Delete Operation)
app.delete('/todos/:id', (req, res) => {
  // convert id into integer
  const id = parseInt(req.params.id);

  db.todos.destroy({where:{id: id}})
  .then((cur) => {
    res.send("Deleted Sucessfully");
  })
  .catch((err) => {
    res.status(500).send();
  });
/*
  // find object in data structure
  const cur = _.findWhere(todos, {id: id});
  if(cur !== undefined) {
    todos = _.without(todos, cur);
    res.json(cur);
  } else {
    res.status(404).send("No data found.");
*/
});

//
db.sequelize.sync().then(() => {
  // initialize port for app
  app.listen(port, () => {
    console.log("Application Stated On Port:" + port);
  });
});
