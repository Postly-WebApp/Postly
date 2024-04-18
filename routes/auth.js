const router = require("express").Router();

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
router.post("/register", async (req, res) => {
  const data = req.body;

  const user = await new User({
    username: data.username,
    email: data.email,
    password: data.password,
  });
  try {
    const newUser = await user.save();
    const token = createToken(newUser._id);
    const cookie = res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ userID: newUser._id });
    console.log(cookie);
  } catch (err) {
    console.log(err);
  }
  //res.send("User Added");
});
module.exports = router;
