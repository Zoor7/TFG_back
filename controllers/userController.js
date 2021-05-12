const userRouter = require("express").Router();
const User = require("../models/userModel");

userRouter.get("/users", async (request, response, next) => {
  try {
    const res = await User.find({});
    response.json(res);
  } catch (error) {
    next(error);
  }
});
userRouter.post("/users/byEmail", async (request, response, next) => {
  const { email } = request.body;

  try {
    const res = await User.find({ email: email });
    response.json(res);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/users/:_id", async (request, response, next) => {
  const { _id } = request.params;

  try {
    const res = await User.findById(_id);
    response.json(res);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/users/create", async (request, response, next) => {
  const { body } = request;

  const newUser = new User({ ...body });

  try {
    const res = await newUser.save();
    response.json(res);
  } catch (error) {
    next(error);
  }
});

//ADD-----------------------------------------------------------------------------------------------------
userRouter.put("/users/addPlace", async (request, response, next) => {
  const { userId, placeId } = request.body;

  try {
    const res = await User.updateOne(
      { _id: userId },
      { $push: { places: placeId } }
    );
    response.json(res);
  } catch (error) {
    next(error);
  }
});

userRouter.put("/users/addLike", async (request, response, next) => {
  const { body } = request;
  try {
    const res = await User.updateOne(
      { id: body.userId },
      { $push: { likes: body.placeId } }
    );
  } catch (error) {
    next(error);
  }
});

userRouter.put("/users/addComment", async (request, response, next) => {
  const { userId, commentId } = request.body;

  try {
    const res = await User.findOneAndUpdate(
      { id: userId },
      { $push: { comments: commentId } }
    );
    response.json(res);
  } catch (error) {
    next(error);
  }
});

//DELETEEEE

userRouter.put(
  "/users/deleteComments/:_id",
  async (request, response, next) => {
    const { _id } = request.params;
    try {
      const result = await User.updateOne({ _id }, { $set: { comments: [] } });
      if (!result) {
        return next({ error: "No hay ningún lugar con ese ID" });
      }
      response.send(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
