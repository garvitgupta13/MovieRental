const Joi = require("joi");
const mongoose = require("mongoose");

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
    unique: true,
    minlength: 10
  }
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().min(10).required(),
    isGold: Joi.boolean()
  });
  const { error, value } = schema.validate(customer);
  return error;
}

//module.exports -> exxports(short form)
exports.Customer = Customer;
exports.validate = validateCustomer;
