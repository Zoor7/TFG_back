const userRouter = require("express").Router();
const User = require("../models/userModel");

userRouter.get("/users", (request, response) => {
  User.find({}).then((res) => {
    response.json(res);
  });
});

userRouter.get("/users/:_id", (request, response) => {
  const { _id } = request.params;

  User.findById(_id).then((res) => {
    response.json(res);
  });
});

userRouter.post("/users/create", (request, response) => {
  const { body } = request;

  User.insertMany([body]).then((res) => {
    response.json(res);
  });
});

module.exports = userRouter;
