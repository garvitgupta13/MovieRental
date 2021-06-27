const Express = require("express");
const app = Express();

//Logging error
require("./startup/logging")();
//Routes
require("./startup/routes")(app);
//Connection to DB
require("./startup/db")();
//Setting the configuration
require("./startup/config")();
//Validation api
require("./startup/validation")();
//To support deployment
require("./startup/prod")(app);

const server = app.listen(3000, () => {
  console.log("Listening on port 3000...");
});

module.exports = server;
