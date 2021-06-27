//This middleware handles the rejected promise
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};

//This returns the express route handler function

//This middleware is replaced by express-async-error module.

//This is how we used it
/*const asyncMiddleware=require("../middleware/async");

router.get(
  "/",
  auth,
  asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);*/
