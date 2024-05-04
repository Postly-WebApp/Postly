const router = require("express").Router();
const Post = require("../models/Post");

// create a new post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a specific post
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (req.body.userID === post.userID) {
      await post.updateOne({ $set: req.body });
      res
        .status(200)
        .json({ success: "true", message: "Updated successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only update your own posts",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a specific post
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (req.body.userID === post.userID) {
      await post.deleteOne();
      res
        .status(200)
        .json({ success: "true", message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only delete your own posts",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all posts of a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ userID: req.params.id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
