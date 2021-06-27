//Authenticate route- tells if the email password are valid
const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const Joi = require("joi"); //For validating
const _ = require("lodash"); //For rendering selective props
const bcrypt = require("bcrypt"); //For hashing
const { User } = require("../models/user");
const auth = require("../middleware/auth"); //Authorization middleware

/*
//GET
router.get("/", auth, async (req, res) => {
  const users = await User.find().sort("name");
  res.send(users);
});

router.get("/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).send("Not found");
  }
  res.send(user);
});
*/

//POST
router.post("/", async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //check if such email exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email");

  //Check password
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.status(400).send("Invalid password");

  //Creating jwt token
  const token = user.genrateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
  });
  const { error, value } = schema.validate(req);
  return error;
}

module.exports = router;
