const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(() => winston.info(`Connected to ${db} `));
};

//Here we are handling unhandled promise, so if we are unable to connect, winston will log it in uncaughtException
