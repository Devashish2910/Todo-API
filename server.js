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
});

// GET request for showing data to user (R - Read Operation)
app.get('/todos', (req, res) => {
  const allTodos = todos;

  // check if has query parameter 'status'
  if(req.query.hasOwnProperty('status') && (req.query.status === 'unfinished' || req.query.status === 'false')) {
    // return unfinised/false todos
    allTodos = _.where(allTodos, {status: false});
  } else if (req.query.hasOwnProperty('status') && (req.query.status === 'finished' || req.query.status === 'true') {
    // return finished/true todos
    allTodos = _.where(allTodos, {status: true});
  }

  // check if has query parameter 'q'
  if(req.query.hasOwnProperty('q')) {
    // return unfinised/false todos
    allTodos = _.filter(allTodos, (cur) => {
      return cur.description.toLowerCase().indexOf(req.query.q.trim().toLowerCase()) > -1;
    });
  }

  // send data back
  if(allTodos.length > 0) {
    res.json(allTodos);
  } else {
    res.status(404).send("No data found.");
  }

});

// GET request for showing data by id
app.get('/todos/:id', (req, res) => {
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

});

// initialize port for app
app.listen(port, () => {
  console.log("Application Stated On Prot:" + port);
});
