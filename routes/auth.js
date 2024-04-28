const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const registerSchema = require("../validations/register");
const loginSchema = require("../validations/login");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};
router.post("/register", async (req, res) => {
  const data = req.body;
  console.log(data);
  const { error } = registerSchema.validate(data);
  if (error) return res.status(400).json({ message: error.details[0].message });

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
    res.status(200).json({ success: "True", userID: newUser._id });
    //console.log(cookie);
  } catch (err) {
    res.status(404).json({ success: "False", userID: "" });
    console.log(err);
  }
  //res.send("User Added");
});
//LOGIN
router.post("/login", async (req, res) => {
  const data = req.body;
  const { error } = loginSchema.validate(data);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(404).json("user not found");

    const valid_pass = await bcrypt.compare(req.body.password, user.password);

    !valid_pass &&
      res
        .status(400)
        .json({ success: "False", message: "incorrect email or password" });

    const token = createToken(user.id);

    const cookie = res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(200).json({ success: "true", userID: user._id });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
