const auth = require("../../../middleware/auth");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  it("should populate the req.user with payload of a valid JWT", () => {
    const user = { _id: mongoose.Types.ObjectId().toHexString() };
    const token = new User(user).genrateAuthToken();
    const res = {};
    const req = {
      header: jest.fn().mockReturnValue(token) //header is set to a mock function which will return  token if called
    };
    const next = jest.fn(); //next is set to a mock function
    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
