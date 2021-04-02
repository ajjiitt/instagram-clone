const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const requirelogin = require("../middleware/requirelogin");
require("dotenv").config();

router.get("/allpost", requirelogin, (req, res) => {
  Post.find()
    .populate("postedBy", "name _id")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      // console.log(posts)
      res.json({ posts });
    })
    .catch((error) => {
      console.log("error allpost route");
    });
});

router.get('/getsubpost',requirelogin,(req,res)=>{

  // if postedBy in following
  Post.find({postedBy:{$in:req.user.following}})
  .populate("postedBy","_id name")
  .populate("comments.postedBy","_id name")
  .sort('-createdAt')
  .then(posts=>{
      res.json({posts})
  })
  .catch(err=>{
      console.log(err)
  })
})

router.post('/createpost',requirelogin,(req,res)=>{
  const {title,body,pic} = req.body 
  if(!title || !body || !pic){
    return  res.status(422).json({error:"Plase add all the fields"})
  }
  req.user.password = undefined
  const post = new Post({
      title,
      body,
      photo:pic,
      postedBy:req.user
  })
  post
  .populate("postedBy", "name _id")
  .save().then(result=>{
      res.json({post:result})
  })
  .catch(err=>{
      console.log(err)
  })
})

router.get("/mypost", requirelogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "name _id")
    .then((mypost) => {
      return res.json({ mypost });
    })
    .catch((error) => {
      console.log(error);
      return res.json({ error: "Something went wrong" });
    });
});

router.put("/like", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "name _id")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});
router.put("/unlike", requirelogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "name _id")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        // console.log(result)
        res.json(result);
      }
    });
});

router.put("/comment", requirelogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

router.delete("/deletepost/:postId", requirelogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
