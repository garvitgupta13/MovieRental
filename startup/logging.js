const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  //Log any uncaught exception
  /*//Method-1 (manual)
process.on("uncaughtException", (ex) => {
  console.log("⚠️ WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1); //Terminate the app
});*/
  //Method-2
  //print in console
  winston.add(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint()
      ),
      handleExceptions: true
    })
  );
  //log in file
  winston.add(
    new winston.transports.File({
      filename: "uncaughtException.log",
      handleExceptions: true,
      exitOnError: true
    })
  );

  //Log any unhandled promise rejection
  /*Method-1 (manual)
  process.on("unhandledRejection", (ex) => {
    console.log("🟥 WE GOT AN UNHANDLED PROMISE REJECTION");
    winston.error(ex.message, ex);
    process.exit(1); //Terminate the app
  });*/
  //Method-2
  // Unhandled rejection doesnt work in winston (14/6/21)
  process.on("unhandledRejection", (ex) => {
    //Throw a exception if any unhandled rejectection is found and winston handleException will log it in unhandledException.log
    throw ex;
  });

  //Logg the errors in logfile.log (default level error)
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  //Logg the errors in mongoDB
  winston.add(
    new winston.transports.MongoDB({
      useUnifiedTopology: true,
      useNewUrlParser: true,
      db: "mongodb://localhost/vidlybackend",
      level: "info" //this will log {error, warn,info}
    })
  );

  // throw new Error("Test error-Someting failed during startup"); //To test uncaught exception logger

  /*Testing Unhandled promise rejection
  const p = Promise.reject(new Error("Test Error- Something failed in promise"));
  // p.then().catch(ex=>{console.log(ex)}) //Proper way of handling promise (it will not throw any error)
  p.then(() => console.log("Done")); //Unhandled promise*/
};
