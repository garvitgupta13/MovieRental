const Joi = require("joi");
const mongoose = require("mongoose");

/*We can import customerSchema, but we dont want all the 50 properties of Customer.
We are intrested in only 3 properties that's why we have extracted them here */
const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    required: [true, "Customer name is compulsary field"],
    minlength: 3
  },
  phone: {
    type: String,
    required: [true, "Customer phone number is compulsary field"],
    minlength: 10
  }
});

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Movie title is compulsary field"],
    trim: true,
    minlength: 5,
    maxlength: 255
  },
  dailyRentalRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 1000
  }
});

const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema,
    required: [true, "Customer is compulsary"]
  },
  movie: {
    type: movieSchema,
    required: [true, "Movie is compulsary"]
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: [true, "Date out is compulsary"]
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  /* Poor way of handling object validation
   if(!mongoose.Types._ObjectId(rental.customerId)){
        return new Error({mesaage:"Invalid customer id"})
    }*/
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  const { error, value } = schema.validate(rental);
  return error;
}

exports.Rental = Rental;
exports.validateRental = validateRental;
