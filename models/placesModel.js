const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  description: { type: String, required: true, minLength: 10, maxLength: 300 },
  image_url: { type: String, required: true },
  location: {
    latitude: Number,
    longitude: Number,
  },
  web: String,
  type: { type: String, required: true },
});

placeSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
