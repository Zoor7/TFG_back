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


userRouter.post("/users/create", async (request, response,next) => {

  const { body } = request;

  const newUser = new User({...body})

  try {
    const res= await newUser.save()
    console.log(res,'BBB');
  } catch (error) {
    next(error)
    
  }
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
  const { userId,commentId } = request.body;

  User.findOneAndUpdate({id:userId},{$push:{comments:commentId}}).then((res) => {
    response.json(res);
  });
});


module.exports = userRouter;
