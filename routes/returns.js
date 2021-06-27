const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const moment = require("moment");
const Fawn = require("fawn");
const { Rental, validateRental } = require("../models/rental");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  const rentalError = validateRental(req.body);
  if (rentalError) return res.status(400).send(rentalError.details[0].message);

  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId
  });
  if (!rental) return res.status(404).send("No rental found");

  if (rental.dateReturned)
    return res.status(400).send("Rental already returned");

  rental.dateReturned = new Date();
  const daysSpend = moment().diff(rental.dateOut, "days"); //get the diff in current date and dateReturned in days, moment()->currentDate
  rental.rentalFee = rental.movie.dailyRentalRate * daysSpend;
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );
  /*TODO: Currently its not working, will have to fix it later
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: rental.movie._id },
        { $inc: { numberInStock: 1 } }
      )
      .run();

    console.log(rental);
    res.status(200).send(rental);
  } catch (ex) {
    return res.status(500).send("Something went wrong");
  }*/
  return res.status(200).send(rental);
});

module.exports = router;
