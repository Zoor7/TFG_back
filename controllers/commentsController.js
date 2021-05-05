const commentRouter = require("express").Router();
const Comment = require("../models/commentModel");

commentRouter.get("/comments", (request, response) => {
  Comment.find({ isResponse: false }).then((res) => {
    response.json(res);
  });
});
commentRouter.get("/comments/:_id", (request, response) => {
  const { _id } = request.params;
  Comment.findById(_id).then((res) => {
    response.json(res);
  });
});
commentRouter.post("/comments/create", async (request, response, next) => {
  const { body } = request;

  const newComment = new Comment({ ...body });

  try {
    const res = await newComment.save();
    response.send(res);
  } catch (error) {
    next(error);
  }
});

module.exports = commentRouter;
