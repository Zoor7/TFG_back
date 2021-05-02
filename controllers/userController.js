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

//ADD-----------------------------------------------------------------------------------------------------
userRouter.put("/users/addPlace", (request, response) => {
  const { userId, placeId } = request.body;

  User.updateOne({_id:userId},{$push:{places:placeId}}).then((res) => {

    response.json(res);
  }).catch(err=>{
    response.status(400).json({error:"Ta mal"})
  })
});


userRouter.put("/users/addLike", (request, response) => {
  const { body } = request;

  User.updateOne({id:body.userId},{$push:{likes:body.placeId}}).then((res) => {
    response.json(res);
  });
});


userRouter.put("/users/addComment", (request, response) => {
  const { body } = request;

  User.updateOne({id:body.userId},{$push:{comments:body.commentId}}).then((res) => {
    response.json(res);
  });
});


module.exports = userRouter;
