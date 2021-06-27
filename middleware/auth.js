const jwt = require("jsonwebtoken");
const config = require("config");

//Authorization middleware - tells weather the user has permission to acess the data
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Acess Denied, no token provided");
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey")); //decoded is the payload extracted from jwt token
    req.user = decoded; //the payload consists of '_id' and 'isAdmin' so we can access req.user._id and get the id
    next(); //pass control to next middleware
  } catch (ex) {
    res.status(400).send("Invalid Token");
  }
};

// module.exports=auth; //Instead of exporting like this we can directly export
