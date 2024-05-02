const router = require("express").Router();
const User = require("../models/User");

// route to get all users  (ADMIN FUNCTIONALITY ONLY)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("_id username email");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// route to create a new user (ADMIN FUNCTIONALITY ONLY)
router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json({
      success: "true",
      message: "User Created successfully",
      userID: savedUser._id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get a user by user id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "this User Does Not Exist" });
  }
});

// route to update a user by user id
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.userID === req.body.userID) {
      await user.updateOne({ $set: req.body });
      res
        .status(200)
        .json({ success: "true", message: "Updated successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only update your own profile",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "this User Does Not Exist" });
  }
});

// route to delete a user by user id (ADMIN FUNCTIONALITY ONLY)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.userID === req.body.userID) {
      await user.deleteOne();
      res
        .status(200)
        .json({ success: "true", message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only delete your own profile",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "this User Does Not Exist" });
  }
});

module.exports = router;
