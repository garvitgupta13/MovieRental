const Joi = require("joi");
const mongoose = require("mongoose");
// const { genreSchema } = require("./genre");

/*NOTE: We can import genreSchema but in the imported one unique=true, which will lead to unique genre names
i.e we cannot have 2 movies with same genre name, In the new genreSchema we have removed unique parameter
which leads to allow us to have 2 movies with same genre name*/
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Genre name is compulsary field"],
    minlength: 3
  }
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Movie title is compulsary field"],
    trim: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  genre: {
    type: genreSchema,
    required: [true, "Genre is compulsary"]
  },
  numberInStock: {
    type: Number,
    default: 0,
    min: 0
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 1000
  }
});

const Movie = mongoose.model("Movie", movieSchema);

//JOI Validation for data sent to us by client
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0),
    dailyRentalRate: Joi.number().min(0).max(1000)
  });
  const { error, value } = schema.validate(movie);
  return error;
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
