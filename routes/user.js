const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const requirelogin = require("../middleware/requirelogin");
require("dotenv").config();

router.get("/user/:id", requirelogin, (req, res) => {
  User.findById({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((error, posts) => {
          if (error) {
            return res.status(422).json({ error: "Something went wrong" });
          }
          res.json({ user, posts });
        });
    })
    .catch(() => {
      return res.status(404).json({ error: "user not found" });
    });
});

module.exports = router;
