# Todo-API
The Todo-API is basically a back-end API for Todolist application, in which I've added the Login, Logout and Authentication modules in addition back-end requests for Create, Update, View, Delete Todos.

# Table of Contents
1. [Authors and Contributors](#author)
2. [How to deploy the app?](#deploy-app)
3. [Resources Used](#resources)
4. [Future Improvements](#future-improvements)

### <a name="author"></a>1. Authors and Contributors

I, [Devashish Patel](https://github.com/Devashish2910) am the developer for this API.

### <a name="deploy-app"></a>2. How to deploy the app ?
Follow the steps below to run the API :

1. Download Sqlite and Postman.
2. Clone the repository from https://github.com/Devashish2910/Todo-API
3. To run locally :
  * Unzip the contents from the cloned directory.
	* Open the terminal and Navigate to the location where the repo was cloned.
  * Run command `npm install`, then run `node server.js`.
  * Open browser and run App at: localhost: 3000
  * Copy the URL and go to the Postman.
  * Set up the environment of Postmen with the URL.
  * Below is the list for the URL endpoints for testing:
      * Creating User: `POST/URL/users` (In which you need to pass "email" in string and "password" in string as JSON in Body)
      * Login: `POST/URL/users/login` (Enter the same values which you passed for the User Creation in body, copy the key for   "Auth" from Headers and set it in the Postman environment which will be used as a header for all other requests.)
      * Create Todo: `POST/URL/todos` (In which you need to pass "description" in string and "status" in boolean as JSON in Body)
      * Fetch all Todos created by you: `GET/URL/todos`
      * Fetch by id: `GET/URL/todos/:id`
      * Fetch all unfinished: `GET/URL/todos?status=false` or `GET/URL/todos?status=unfinished`
      * Fetch all finished: `GET/URL/todos?status=true` or `GET/URL/todos?status=finished`
      * Fetch by query string: `GET/URL/todos?q=what ever the word you want to find`
      * Update the todos: `PUT/URL/todos/:id` (In which you need to pass "description" in string and "status" in boolean as JSON in Body)
      * Delete the todos: `DELETE/URL/todos/:id`
      * Logout: `DELETE/URL/login`
4. If you want to visit the live hosted app, visit this URL : https://todo-api-deva.herokuapp.com/. Just change the URL in Postman everything else will be the same as local.

### <a name="resources"></a> 3. Resources

* Node.js is used as the scripting language for the server.
* `npm` modules used in the API.
 * `express`, `Sequelize`, `crypto-js`, `bcryptjs`, `pg`, `pg-hstore`,`sqlite3`, `underscore`, `body-parser`
* Database : Sqlite (For Local), Postgres (For Heroku)

### <a name="future-improvements"></a> 4. Future Improvements

* Use `mongodb` as No Sql Database
* Implement front-end with React

_Any suggestions for the API are welcomed. Please email me at devashish2910@gmail.com to share your suggestions_
