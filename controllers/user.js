
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

function isstringinvalid(string) {
    if (string == undefined || string.length === 0) {
      return true;
    } else {
      return false;
    }
}
const signup = async (req, res) => {
    try {
      const { name, email,phonenumber, password } = req.body;
      if (
        isstringinvalid(name) ||
        isstringinvalid(email) ||
        isstringinvalid(phonenumber) ||
        isstringinvalid(password)
      ) {
        return res
          .status(400)
          .json({ err: "Bad Parameters . Something is missing." });
      }
      // Check if user already exists with given email
      const user = await User.findOne({ email });
      if (user) {
          return res.status(409).json({ err: "Email already in use." });
      }
      const saltrounds = 10;
      bcrypt.hash(password, saltrounds, async (err, hash) => {
        console.log(err);
        await User.create({ name, email,phonenumber, password: hash });
        res.status(201).json({ message: "Successfully created new user" });
      });
    } catch (err) {
      res.status(500).json(err);
      console.log(err)
    }
  };
  const generateAccessToken = (id, name) => {
    return jwt.sign({ userId: id, name: name }, "secretkey");
  };


  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (isstringinvalid(email) || isstringinvalid(password)) {
        return res
          .status(400)
          .json({ message: "Email id or password is missing", success: false });
      }
      console.log(password);
      const user = await User.findAll({ where: { email } });
      if (user.length > 0) {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (err) {
            throw new Error("Something went wrong");
          }
          if (result === true) {
            res.status(200).json({
              success: true,
              message: "User logged in successfully",
              token: generateAccessToken(
                user[0].id,
                user[0].name,
                user[0].ispremiumuser
              ),
            });
          } else {
            return res
              .status(400)
              .json({ success: false, message: "Password is incorrect" });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User doesnot exist" });
      }
    } catch (err) {
      res.status(500).json({ message: err, success: false });
    }
  };

  module.exports = {signup,login}