const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");
const { Movie } = require("../../models/movie");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");

describe("/api/returns", () => {
  let server;
  let rental;
  let customerId;
  let movieId;
  let movie;
  let token;

  beforeEach(async () => {
    server = require("../../index");

    customerId = mongoose.Types.ObjectId().toHexString();
    movieId = mongoose.Types.ObjectId().toHexString();

    token = new User().genrateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: "testMovie",
      dailyRentalRate: 10,
      numberInStock: 13,
      genre: { name: "genre7" }
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "testCustomer",
        phone: "0123456789"
      },
      movie: {
        _id: movieId,
        title: "testMovie",
        dailyRentalRate: 10
      }
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    await server.close();
  });

  const exec = () => {
    return request(server)
      .post("/api/returns/")
      .set("x-auth-token", token)
      .send({ customerId: customerId, movieId: movieId });
  };

  it("should return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not passed", async () => {
    customerId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if movieId is not passed", async () => {
    movieId = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if no rental exists", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if rental is already returned", async () => {
    rental.dateReturned = new Date();
    await rental.save();
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if valid rental is passed", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });

  it("should update the dateReturned in rental", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id); // check if the rental present in DB has the dateReturned property
    const diff = new Date() - rentalInDb.dateReturned;
    expect(rentalInDb).toHaveProperty("dateReturned");
    expect(diff).toBeLessThan(10 * 1000); //diff between current date and the updated rental must have a diff of less than 10ms
  });

  it("should have rentalFee", async () => {
    rental.dateOut = moment().subtract(7, "days").toDate(); //DateOut is set to 7 days before the currrent date and then converted it to javascript date object again
    await rental.save();
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);
    expect(rentalInDb.rentalFee).toBe(rentalInDb.movie.dailyRentalRate * 7);
  });

  it("should increase the movie stock by 1 ", async () => {
    const res = await exec();
    const movieInDb = await Movie.findById(movieId);
    expect(res.status).toBe(200);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("should return the rentaal for valid input", async () => {
    const res = await exec();
    //Method-1
    /*expect(res.body).toHaveProperty("dateOut");
    expect(res.body).toHaveProperty("dateReturned");
    expect(res.body).toHaveProperty("rentalFee");
    expect(res.body).toHaveProperty("customer");
    expect(res.body).toHaveProperty("movie");*/

    //Method-2
    //Object.keys(..)gives the array of keys of this object, and we match with the other array
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie"
      ])
    );
  });
});
