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
  // check if has query parameter 'status'

  // check if has query parameter 'q'

  // send data back
});

// initialize port for app
app.listen(port, () => {
  console.log("Application Stated On Prot:" + port);
});
