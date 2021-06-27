const config = require("config");

module.exports = function () {
  //Exit the app if enviroment variables are not set
  if (!config.get("jwtPrivateKey")) {
    // $env:vidly_jwtPrivateKey='see the notes for this key'
    throw new Error("FATAL Error: jwtPrivateKey is not defined"); //Winston will log this error and exit the app
  }
};
