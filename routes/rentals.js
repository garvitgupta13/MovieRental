const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const Fawn = require("fawn");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const { Rental, validateRental } = require("../models/rental");
const auth = require("../middleware/auth");

//Initialize FAWN
Fawn.init(mongoose);

//GET
router.get("/", auth, async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    return res.status(404).send("Rental not found");
  }
  res.send(rental);
});

//POST
router.post("/", auth, async (req, res) => {
  const rentalError = validateRental(req.body);
  if (rentalError) return res.status(400).send(rentalError.details[0].message);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("No such movie exists");

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("No such customer exists");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie is out of stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      isGold: customer.isGold
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });
  /*If rental.save() fails but movie.save() works, it will create data
    inconsistency, so to avoid that we use fawn
  rental = await rental.save();
  //Reduce the movie stock
  movie.numberInStock--;
  movie.save();*/

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (ex) {
    return res.status(500).send("Something went wrong");
  }
});

module.exports = router;
