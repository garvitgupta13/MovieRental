const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;
describe("/api/genres", () => {
  //open server before each request
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await Genre.deleteMany({}); //clear the database after each request;
    await server.close(); //close server after each request NOTE: Use await while closing server
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ]);
      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" }); //create a genre object
      await genre.save(); //monggose will save the genre in testdb

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return a 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    it("should return a 404 if no genre exists for valid id", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token;
    const exec = (genreName) => {
      //removing await from it will not affect because we are awaiting it everytime we call it
      return request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({ name: genreName });
    };

    beforeEach(() => {
      token = new User().genrateAuthToken(); //genrate auth token before each request
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre length is less than 3", async () => {
      const res = await exec("g1");
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is not passed", async () => {
      const res = await request(server)
        .post("/api/genres/")
        .set("x-auth-token", token)
        .send({});
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre already present is added again", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save(); //insert a genre

      const res = await exec("genre1");
      expect(res.status).toBe(400);
    });

    it("should return a genre if it is valid", async () => {
      const res = await exec("genre1");
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });

    it("should save a genre if it is valid", async () => {
      await exec("genre1");
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    let token = "";
    let genreId = "";

    const exec = (genreName) => {
      return request(server)
        .put("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send({ name: genreName });
    };

    beforeEach(() => {
      genreId = mongoose.Types.ObjectId().toHexString();
      token = new User().genrateAuthToken();
    });

    it("should return 404 if invalid id is passed ", async () => {
      genreId = "1";
      const res = await exec("genre1");
      expect(res.status).toBe(404);
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec("genre1");
      expect(res.status).toBe(401);
    });

    it("should return 400 if genre length is less than 3", async () => {
      const res = await exec("g1");
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre name is not passed", async () => {
      const res = await request(server)
        .put("/api/genres/" + genreId)
        .set("x-auth-token", token)
        .send({});
      expect(res.status).toBe(400);
    });

    it("should return 400 if genre already present is added again", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await exec("genre1");
      expect(res.status).toBe(400);
    });

    it("should return 404 if no genre exists for valid id ", async () => {
      const res = await exec("genre1");
      expect(res.status).toBe(404);
    });

    it("should return 200 if updated genre name is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      genreId = genre._id;
      const res = await exec("genre2");
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /:id", () => {
    let token = "";
    let genreId = "";

    const exec = () => {
      //removing await from it will not affect because we are awaiting it everytime we call it
      return request(server)
        .delete("/api/genres/" + genreId)
        .set("x-auth-token", token);
    };

    beforeEach(() => {
      genreId = mongoose.Types.ObjectId().toHexString();
      token = new User({ isAdmin: true }).genrateAuthToken(); //genrate auth token before each request
    });

    it("should return 404 if invalid id is passed ", async () => {
      genreId = "1";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 403 if client logged in is not admin", async () => {
      token = new User({ isAdmin: false }).genrateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if no genre exists for valid id ", async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should delete the genre if a genre exists for givenid and admin is  logged in", async () => {
      const genre = new Genre({ name: "genre1" }); //create a genre object
      await genre.save(); //monggose will save the genre in testdb
      genreId = genre._id;
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
