const router = require("express").Router();
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");
// create a new post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      postID: savePost._id,
    });
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// update a specific post
router.put("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (req.body.userID === post.userID.toString()) {
      await post.updateOne({ $set: req.body });
      res
        .status(200)
        .json({ success: "true", message: "Updated successfully" });
    } else {
      console.log(req.body.userID);
      console.log(post.userID);
      res.status(403).json({
        success: "false",
        message: "you can only update your own posts",
      });
    }
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// delete a specific post
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    if (req.body.userID === post.userID.toString()) {
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
    res.status(500).json({ message: "something went wrong" });
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
    res.status(500).json({ message: "something went wrong" });
  }
});

//get all posts of a specific user
router.get("/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ userID: req.params.id });
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

// route to search for posts by matching description
router.get("/search/:searchTerm", async (req, res) => {
  try {
    const posts = await Post.find({
      desc: { $regex: req.params.searchTerm, $options: "i" },
    });
    // console.log(posts);
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
/*
  -------------------------------------      Reviewed and Done (FOR NOW)       -------------------------------------
  # DOCs
    -> create a new post
        => DONE
    -> update a specific post
        => DONE
    -> delete a specific post
        => DONE
    -> get all posts
        => DONE
    -> get all posts of a specific user
        => DONE
    -> search for posts
        => DONE
*/
