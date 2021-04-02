const mongoose = require("mongoose");
const { isEmail } = require("validator");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [isEmail],
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }],
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/omen123/image/upload/v1617388397/pcoplxipnaalpwhhefuv.png",
  },
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
