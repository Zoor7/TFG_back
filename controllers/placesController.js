const placeRouter = require("express").Router();
const Place = require("../models/placesModel");


//GETTERS ---------------------------------
placeRouter.get("/places", (request, response) => {
  Place.find({}).populate('author').populate('comments.author').then((res) => {
    console.log(res);
    response.json(res);
  });
});

placeRouter.get("/places/:_id", (request, response) => {
  const { _id } = request.params;

  Place.findById(_id).then((res) => {
    response.json(res);
  });
});

//CREATE-----------------------------------
placeRouter.post("/places/create", (request, response) => {
  const { body } = request;

  Place.create(body).then((res) => {
    response.json(res);
  });
});


//DELETE----------------------------------
placeRouter.delete("/places/delete/:_id", (request, response) => {
  const { _id } = request.params;

  Place.deleteOne(_id).then((res) => {
    response.json(res);
  });
});


//UPDATE---------------------------------------------------------------------

placeRouter.put("/places/addLike", (request, response) => {
  const { userId,placeId } = request.body;

  Place.updateOne({_id:placeId},{$push:{likes:userId}}).then((res) => {
    response.json(res);
  });
});

placeRouter.put("/places/addComment", (request, response) => {
  const { comment,placeId } = request.body;

  Place.findOneAndUpdate({_id:placeId},{$push:{comments:comment}},{new:true}).then((res) => {
    response.json(res);
  });
});

module.exports = placeRouter;
