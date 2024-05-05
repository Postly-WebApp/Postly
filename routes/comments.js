const router = require("express").Router();
const Comment = require("../models/Comment");
const jwt = require("jsonwebtoken");
// route to add comment to a specific post by a specific user
//const { validateComment, sanitizeComment } = require("./utils/validation");

// create a new comment
router.post("/", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "user not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;

    // Validate and sanitize the request body
    // const { error, sanitizedComment } = validateComment(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    // Check if the userID matches the decoded token
    // if (req.body.author !== userID) {
    //   console.log(userID);
    //   console.log(req.body.author);
    //   return res.status(403).json({
    //     error: "you only can add comments for you not someone else :)",
    //   });
    // }

    const newComment = new Comment({
      ...req.body,
      author: userID,
    });
    const savedComment = await newComment.save();
    res.status(200).json({
      success: "True",
      message: "Comment added successfully",
      commentID: savedComment._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "something went wrong" });
  }
});

// route to get all comments of a specific post
router.get("/:postID", async (req, res) => {
  try {
    const comments = await Comment.find({ postID: req.params.postID });
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }
    res.status(200).json(comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

// route to get all comments for a specific post
// router.get("/", async (req, res) => {
//   try {
//     const comments = await Comment.find();
//     res.status(200).json(comments);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// route to delete a specific comment with checking the author
router.delete("/:id", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "comment does not exist" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;
    if (comment.author.toString() === userID) {
      await comment.deleteOne();
      res
        .status(200)
        .json({ success: "true", message: "Deleted successfully" });
    } else {
      res.status(403).json({
        success: "false",
        message: "you can only delete your own comments :)",
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});

// route to update a specific comment
router.put("/:id", async (req, res) => {
  try {
    const token = req.cookies.jwt;
    console.log(token);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: "comment does not exist" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userID = decoded.id;
    if (comment.author.toString() !== userID) {
      return res.status(403).json({
        success: "false",
        message: "you can only update your own comments :)",
      });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        $set: { text: req.body.text },
      },
      { new: true }
    );
    res.status(200).json({
      success: "true",
      message: "Updated successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "something went wrong" });
  }
});
module.exports = router;

/*
  -------------------------------------      Reviewed and Done (FOR NOW)       -------------------------------------
  # DOCs
    -> create a new comment
        => reviewd
        => DONE
    -> get all comments for a specific post
        => reviewd
        => DONE
    -> delete a specific comment
        => reviewd
        => DONE
    -> update a specific comment
        => reviewd
*/
