const placeRouter = require("express").Router();
const Place = require("../models/placesModel");
const { check, validationResult } = require('express-validator');



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
placeRouter.post("/places/create",
[check('description').isLength({min:10})],
 async (request, response,next) => {

  const errors=validationResult(request);
  next(errors)
  const { body } = request;

  const newPlace = new Place({...body})

  try {
    const res= await newPlace.save()
    console.log(res,'BBB');
  } catch (error) {
    next(error)
    
  }
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
