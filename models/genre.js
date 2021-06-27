const Joi = require("joi");
const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Genre name is compulsary field"],
    unique: true,
    minlength: 3
  }
});

const Genre = mongoose.model("Genre", genresSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  const { error, value } = schema.validate(genre);
  return error;
}

exports.genreSchema = genresSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
