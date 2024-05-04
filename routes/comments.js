const router = require("express").Router();
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");
// route to add comment to a specific post by a specific user
//const { validateComment, sanitizeComment } = require("./utils/validation");

router.post("/", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Validate and sanitize the request body
    // const { error, sanitizedComment } = validateComment(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    // Check if the userID matches the decoded token
    if (req.body.author !== userID) {
      console.log(userID);
      console.log(req.body.userID);
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const newComment = new Comment(req.body);
    const savedComment = await newComment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// route to get all comments of a specific post
router.get("/:postID", async (req, res) => {
  try {
    const comments = await Comment.find({ postID: req.params.postID });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to get all comments in the db
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// route to delete a specific comment with checking the author
router.delete("/:id", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (comment.author === req.body.userID) {
      await comment.deleteOne();
      res
        .status(200)
        .json({ success: "true", message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only delete your own comments",
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
