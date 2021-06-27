const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); //For jwt token
const config = require("config"); // For getting secret key

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User name is compulsary field"],
    minlength: 3
  },
  email: {
    type: String,
    required: [true, "User email is compulsary"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "User email is compulsary"],
    min: 5
  },
  isAdmin: Boolean
});

userSchema.methods.genrateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
  });
  const { error, value } = schema.validate(user);
  return error;
}

exports.User = User;
exports.validateUser = validateUser;
