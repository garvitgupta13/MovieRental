/*This middleware catches error related to request process pipeline i.e related to express,
 others errors outside the context of processing the request it cannot catch*/

const winston = require("winston");

module.exports = function (err, req, res, next) {
  //Logging the error
  //Types of logging message -> {error,warn,info,verbose,debug,silly} , but here we will just store the error messages
  winston.error(err.message, err);
  res.status(500).send("Something Failed");
};
