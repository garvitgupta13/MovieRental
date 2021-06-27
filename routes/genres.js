const Express = require("express");
const router = Express.Router();
const mongoose = require("mongoose");
const { Genre, validate } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

//GET
router.get("/", async (req, res, next) => {
  // throw new Error("Test error"); //Just to test the winston
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) {
    return res.status(404).send("Not found");
  }
  res.send(genre);
});

//POST
router.post("/", auth, async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //check if genre is already registered
  let genre = await Genre.findOne({ name: req.body.name });
  if (genre) return res.status(400).send("Genre already exists");

  genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  res.send(genre);
});

//PUT
router.put("/:id", [validateObjectId, auth], async (req, res) => {
  const error = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let genre = await Genre.findOne({ name: req.body.name });
  if (genre) return res.status(400).send("Genre already exists");

  genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) {
    return res.status(404).send("Not found");
  }
  res.send(genre);
});

//DELETE
router.delete("/:id", [validateObjectId, auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) {
    return res.status(404).send("Not found");
  }
  res.send(genre);
});

module.exports = router;
