// routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { requireAuth } = require("../middleware/auth");
const Comment = require("../models/comment");
const Post = require("../models/post");

router.post("/addComment", requireAuth, async (req, res) => {
  const { postId, text } = req.body;
  const userId = req.user._id; // Assuming req.user contains the authenticated user

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).send("Invalid post ID");
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const comment = new Comment({
      author: userId,
      text,
      post: { id: postId },
    });

    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    res.status(201).send("Comment added successfully");
  } catch (error) {
    res.status(500).send("Error adding comment: " + error.message);
  }
});

module.exports = router;
