const router = require("express").Router();
const User = require("../models/User");

// route to get all users  (ADMIN FUNCTIONALITY ONLY)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("_id username email");
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
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
    res.status(500).json({ message: "something went wrong" });
  }
});

// route to get a user by user id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// Update email
router.put("/email/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.userID.toString() === req.body.userID) {
      // Check if the new email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      await user.updateOne({ $set: { email: req.body.email } });
      res
        .status(200)
        .json({ success: true, message: "Email updated successfully" });
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "You can only update your own profile",
        });
    }
  } catch (err) {
    res.status(500).json({ message: "This User Does Not Exist" });
  }
});

// Update username
router.put("/username/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.userID.toString() === req.body.userID) {
      // Check if the new username already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      await user.updateOne({ $set: { username: req.body.username } });
      res
        .status(200)
        .json({ success: true, message: "Username updated successfully" });
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "You can only update your own profile",
        });
    }
  } catch (err) {
    res.status(500).json({ message: "This User Does Not Exist" });
  }
});

// Update password
router.put("/password/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.userID.toString() === req.body.userID) {
      // Update the password
      await user.updateOne({ $set: { password: req.body.password } });
      res
        .status(200)
        .json({ success: true, message: "Password updated successfully" });
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "You can only update your own profile",
        });
    }
  } catch (err) {
    res.status(500).json({ message: "This User Does Not Exist" });
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
/*
  -------------------------------------      Reviewed and Done (FOR NOW)       -------------------------------------
  # DOCs
    -> create a new user
        => reviewd
        => DONE
    -> update username
    -> update email
    -> update password
    -> delete a specific user
    -> get all users
        => reviewd
        => DONE
    -> get a specific user
        => reviewd
        => DONE
*/
