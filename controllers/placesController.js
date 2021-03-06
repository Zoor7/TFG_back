const placeRouter = require("express").Router();
const Place = require("../models/placesModel");

//GETTERS ---------------------------------
placeRouter.get("/places", async (request, response, next) => {
  try {
    const result = await Place.find({})
      .populate("author")
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .sort({ createdAt: -1 });
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
    const res = await (await newPlace.save()).populate("author").execPopulate();
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
  const { body } = request;
  try {
    const res = await Place.updateOne(
      { _id: body.placeId },
      { $addToSet: { likes: body.userId } }
    );
    response.json(res);
  } catch (error) {
    return next(error);
  }
});

placeRouter.put("/places/deleteLike", async (request, response, next) => {
  const { body } = request;
  try {
    const res = await Place.updateOne(
      { _id: body.placeId },
      { $pull: { likes: body.userId } }
    );
    response.json(res);
  } catch (error) {
    return next(error);
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
      .populate("comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
      .sort({ createdAt: -1 });
    if (!result) {
      return next({ error: "No hay ningún lugar con ese ID" });
    }
    response.send(result);
  } catch (error) {
    next(error);
  }
});

//////////////GEOSPATIAL QUERIES

placeRouter.post(
  "/places/findPlacesByRadius",
  async (request, response, next) => {
    const { kms, coordinates } = request.body;

    try {
      const res = await Place.find({
        location: {
          $geoWithin: {
            $centerSphere: [[coordinates[0], coordinates[1]], kms / 6378.1],
          },
        },
      });
      response.json(res);
    } catch (error) {
       next(error);
    }
  }
);

module.exports = placeRouter;
