const Express = require("express");
const router = Express.Router();
const { Movie, validateMovie } = require("../models/movie");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//GET
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).send("Not Found");
  }
  res.send(movie);
});

//POST
router.post("/", auth, async (req, res) => {
  const movieError = validateMovie(req.body);
  if (movieError) return res.status(400).send(movieError.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  //check if movie is already registered
  let movie = await Movie.findOne({ title: req.body.title });
  if (movie) return res.status(400).send("Movie already exists");

  movie = new Movie({
    title: req.body.title,
    // genre:genre, //We dont need the entire 50 properties of genre, we need only name and _id
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });
  movie = await movie.save();
  res.send(movie);
});

//PUT
router.put("/:id", auth, async (req, res) => {
  const movieError = validateMovie(req.body);
  if (movieError) return res.status(400).send(movieError.details[0].message);
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  try {
    let movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: {
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      },
      { new: true }
    );
    if (!movie) {
      return res.send(404).send("Not found");
    }
    res.send(movie);
  } catch (ex) {
    res.status(400).send("This Movie title already exists");
  }
});

//DELETE
router.delete("/:id", [auth, admin], async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) {
    return res.status(404).send("Not Found");
  }
  res.send(movie);
});

module.exports = router;
