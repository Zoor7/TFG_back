const placeRouter = require("express").Router();
const Place = require("../models/placesModel");

//GETTERS ---------------------------------
placeRouter.get("/places", async (request, response, next) => {
  try {
    const result = await Place.find({}).populate("author").populate("comments");
    response.send(result);
  } catch (error) {
    next(error);
  }
});

placeRouter.get("/places/:_id", async (request, response, next) => {
  const { _id } = request.params;

  try {
    const result = await Place.findById(_id);
    if (!result) {
      return next({ error: "No hay ningún lugar con ese ID" });
    }
    response.send(result);
  } catch (error) {
    next(error);
  }
});

//CREATE-----------------------------------
placeRouter.post("/places/create", async (request, response, next) => {
  const { body } = request;
  const newPlace = new Place({ ...body });

  try {
    const res = await newPlace.save();
    response.send(res);
  } catch (error) {
    next(error);
  }
});

//DELETE----------------------------------
placeRouter.delete("/places/delete/:_id", async (request, response, next) => {
  const { _id } = request.params;

  try {
    const result = await Place.deleteOne({ _id: _id });
    if (!result) {
      return next({ error: "No hay ningún lugar con ese ID" });
    }
    response.send(result);
  } catch (error) {
    next(error);
  }
});
placeRouter.delete("/places/delete", async (request, response, next) => {
  try {
    const result = await Place.deleteMany({});
    if (!result) {
      return next({ error: "No hay ningún lugar con ese ID" });
    }
    response.send(result);
  } catch (error) {
    next(error);
  }
});

placeRouter.put(
  "/places/deleteComments/:_id",
  async (request, response, next) => {
    const { _id } = request.params;
    try {
      const result = await Place.updateOne({ _id }, { $set: { comments: [] } });
      if (!result) {
        return next({ error: "No hay ningún lugar con ese ID" });
      }
      response.send(result);
    } catch (error) {
      next(error);
    }
  }
);

//UPDATE---------------------------------------------------------------------

placeRouter.put("/places/addLike", async (request, response, next) => {
  const { userId, placeId } = request.body;

  try {
    const result = await Place.updateOne(
      { _id: placeId },
      { $push: { likes: userId } },
      { new: true }
    ).sort();
    if (!result) {
      return next({ error: "No hay ningún lugar con ese ID" });
    }
    response.send(result);
  } catch (error) {
    next(error);
  }
});

placeRouter.put("/places/addComment", async (request, response, next) => {
  const { commentId, placeId } = request.body;

  try {
    const result = await Place.findOneAndUpdate(
      { _id: placeId },
      { $push: { comments: commentId } },
      { new: true }
    )
      .populate("author")
      .populate("comments");
    if (!result) {
      return next({ error: "No hay ningún lugar con ese ID" });
    }
    response.send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = placeRouter;
