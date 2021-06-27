const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/auth"); //Autorization middleware

//GET
//This route is not safe for seecurity reason, as we dont want to give user detail to anyone (this is just for tutorial purposes)
router.get("/", auth, async (req, res) => {
  const users = await User.find().select(["_id", "name", "email"]).sort("name");
  res.send(users);
});

/*
//This route is not safe for seecurity reason, as we dont want to give user detail to anyone (this is just for tutorial purposes)
router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("Not found");
  }
  res.send(_.pick(user, ["_id", "name", "email"]));
});
*/

//Getting the currently logged in user
router.get("/me", auth, async (req, res) => {
  /*In the auth middleware we have set the req.user to payload containing the _id of user
  so req.user._id gives the _id of user whose jwtToken is passed*/
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//POST
router.post("/", async (req, res) => {
  const error = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //check if user is already registered
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User with this email already exists");

  //Method1
  /*user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });*/

  //Method-2
  user = new User(_.pick(req.body, ["name", "email", "password"])); //from the user object pick name email password props

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  //Setting the jwtToken as a header
  const token = user.genrateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"])); //from the user object pick _id name email props
});

module.exports = router;
