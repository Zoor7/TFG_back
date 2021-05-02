const commentRouter = require("express").Router();
const Comment = require("../models/commentModel");

commentRouter.get("/comments", (request, response) => {
  Comment.find({isResponse:false}).then((res) => {
    response.json(res);
  });
});
commentRouter.get("/comments/:_id", (request, response) => {
  const { _id } = request.params;
  Comment.findById(_id).then((res) => {
    response.json(res);
  });
});
commentRouter.post("/comments/create", (request, response) => {
  const { body } = request;

  Comment.insertMany(body).then((res) => {
    console.log(res);
    response.json(res);
  });
});

module.exports = commentRouter;
