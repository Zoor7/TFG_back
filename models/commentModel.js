const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
    },
    responses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    author_username: String,
    isResponse: Boolean,
  },
  { timestamps: true }
);

commentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
