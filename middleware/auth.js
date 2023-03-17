const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    const user = jwt.verify(token, "secretkey");
    console.log("userID>>>", user.userId);
    User.findByPk(user.userId).then((user) => {
      // req.user = user;
      req.user = {
        id: user.id,
        name: user.name // Add the user's name to the req.user object
      };
      next();
    });
  } catch (err) {
    console.log("token error");
    console.log(err);
    return res.status(401).json({ success: false });;;;;
  }
};
module.exports = {
  authenticate,
};