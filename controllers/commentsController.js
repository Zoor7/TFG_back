const commentRouter = require("express").Router();
const Comment = require("../models/commentModel");

commentRouter.get("/comments", async(request, response) => {

  const res = await Comment.find({ isResponse: false })
  response.json(res)

});
commentRouter.get("/comments/:_id",async (request, response,next) => {
  const { _id } = request.params;
  try {
    const res = await Comment.findById(_id)
    response.json(res)
  } catch (error) {
    next(error)
  }
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

//DELETE

commentRouter.delete("/comments", async(request, response) => {

  const res = await Comment.deleteMany()
  response.json(res)
});



module.exports = commentRouter;
