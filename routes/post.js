const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const Post = require("../models/post");
const UserData = require("../models/UserData");
const Comment = require("../models/Comment");

// POST /post - Create a new post
router.post("/post", requireAuth, async (req, res) => {
  const { heading, description } = req.body;
  const author = req.user._id; // Extracted from requireAuth middleware

  try {
    const newPost = new Post({
      author,
      heading,
      description,
    });

    const savedPost = await newPost.save();

    // Push the created post ID to the user's posts array
    await UserData.findOneAndUpdate(
      { userId: author },
      { $push: { posts: savedPost._id } },
      { new: true }
    );

    res.status(201).send("Post created successfully");
  } catch (error) {
    res.status(400).send("Error creating post: " + error.message);
  }
});

router.get("/discussions", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName email") // Populate author details
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName email" }, // Populate author details of each comment
      });

    res.status(200).json(posts);
  } catch (error) {
    res.status(400).send("Error fetching posts: " + error.message);
  }
});

module.exports = router;
