const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");
const validateObjectId = require("../middleware/validateObjectId");

//GET
router.get("/", auth, async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", [validateObjectId,auth], async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).send("Not found");
  }
  res.send(customer);
});

//POST
router.post("/", auth, async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //check if phone number is already registered
  let customer = await Customer.findOne({ phone: req.body.phone });
  if (customer) return res.status(400).send("Phone number already exists");

  customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });
  customer = await customer.save();
  res.send(customer);
});

//PUT
router.put("/:id", [validateObjectId, auth], async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
      { new: true }
    );
    if (!customer) {
      return res.status(404).send("Not found");
    }
    res.send(customer);
  } catch (ex) {
    res.status(400).send("This phone number already exists");
  }
});


module.exports = router;
