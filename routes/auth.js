const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requirelogin = require("../middleware/requirelogin");
require("dotenv").config();

router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res
      .status(422)
      .json({ error: "all fields should be filled completely" });
  }
  User.findOne({ email })
    .then(async (savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User already exist" });
      }
      //   hashing password
      const salt = await bcrypt.genSalt();
      bcrypt.hash(password, salt).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        // saving user
        user
          .save()
          .then((result) => {
            return res.status(200).json({ message: "User saved successfully" });
          })
          .catch((error) => {
            return res
              .status(422)
              .json({ error: "Something went wrong while creating user" });
          });
      });
    })
    .catch((error) => {
      console.log("/routes/auth/signup user");
      console.log(error);
      return res.status(404).json({ error: "Something went wrong" });
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please enter all fields" });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "User dont exist" });
      }
      bcrypt
        .compare(password, savedUser.password)
        .then((doMatch) => {
          if (doMatch) {
            const token = jwt.sign(
              { _id: savedUser._id },
              process.env.SECRET_KEY
            );
            const { _id, name, email, followers, following } = savedUser;
            res.json({
              token,
              user: { _id, name, email, followers, following },
            });
          } else {
            return res.json({ message: "Invalid Username or Password" });
          }
        })
        .catch((error) => {
          console.log("/routes/auth/sigin user");
          console.log(error);
          return res.status(404).json({ error: "Something went wrong" });
        });
    })
    .catch((error) => {
      console.log("/routes/auth/sigin");
      console.log(error);
      return res.status(404).json({ error: "Something went wrong" });
    });
});

module.exports = router;
