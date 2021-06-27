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

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Listening on port", port, "...");
});

module.exports = server;
