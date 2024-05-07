const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const registerSchema = require("../utils/validations/register");
const loginSchema = require("../utils/validations/login");
//const checkToken = require("./middlewares/checkTokens");
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

// const adminToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: maxAge,
//   });
// };

//REGISTER
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

  if (
    req.body.email === "admin@Postly.com" &&
    req.body.password === "rootroot"
  ) {
    // Send a success response indicating admin login
    return res.status(200).json({ success: true, isAdmin: true });
  }
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json("user not found");

    const valid_pass = await bcrypt.compare(req.body.password, user.password);

    if (!valid_pass)
      return res
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

// route to know if the user sending the request is authenticated according to the id field in the jwt sent in the cookie
router.get("/verify", async (req, res) => {
  const token = req.cookies.jwt;
  // const actualToken = req.headers.cookie.split("=")[1];
  // actualToken = actualToken.split(";")[0];
  // //console.log(actualToken.split(";")[0]);
  if (!token) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        if (err.message === "invalid signature") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt signature is required") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
        if (err.message === "jwt malformed") {
          return res.status(401).json({ error: "Invalid JWT signature" });
        }
      }
      throw err;
    }
    res.status(200).json({ success: "True" });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ success: "False" });
  }
});

// route to logout the user
router.get("/logout", (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  res.clearCookie("jwt");
  res.status(200).json({ success: "true" });
});

module.exports = router;
