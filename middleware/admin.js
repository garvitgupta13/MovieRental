module.exports = function (req, res, next) {
  //401 -> Unauthorized i.e user try to acess protected route but dont supply valid jwtToken
  //403 -> Forbidden i.e you are not allowed to acess this resource
  if (!req.user.isAdmin) return res.status(403).send("Access Denied");
  next();
};
