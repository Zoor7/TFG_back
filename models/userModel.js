const mongoose = require("mongoose");
const { isEmail } = require("validator");
const uniqueValidator = require('mongoose-unique-validator');



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "no es mail"],
  },
  passwordHash: {
    type: String,
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  places: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
    },
  ],
  avatar: String,
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
