const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const { populate } = require("../models/userModel");

userRouter.get("/users", async (request, response, next) => {
  try {
    const res = await User.find({});
    response.json(res);
  } catch (error) {
    return next(error);
  }
});

userRouter.post("/users/byEmail", async (request, response, next) => {
  const { email } = request.body;

  try {
    const res = await User.find({ email: email });
    response.json(res);
  } catch (error) {
    return next(error);
  }
});

userRouter.get("/users/:_id", async (request, response, next) => {
  const { _id } = request.params;

  try {
    const res = await User.findById(_id);

    response.json(res);
  } catch (error) {
    return next(error);
  }
});

/* Login y Registrarse */
userRouter.post("/users/signup", async (req, res, next) => {
  const { username, email, password, avatar } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next("El registro ha fallado, inténtalo más tarde por favor.");
  }

  if (existingUser) {
    return next(
      "El usuario ya existe, inicia sesión en vez de registrarte por favor. - User repetido"
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(err);
  }

  const createdUser = new User({
    username,
    email,
    password: hashedPassword,
    avatar,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      "El usuario ya existe, inicia sesión en vez de registrarte por favor. - Problema al guardar"
    );
  }

  // Generando un token con jsonwebtoken
  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "secret_pass",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next("El registro ha fallado, inténtalo más tarde por favor.");
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  // res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
});

// Este login funciona, el problema es que encripto la contraseña y para iniciar sesión la contraseña es la que está ENCRIPTADA, no la original
userRouter.post("/users/login", async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email })
      .populate("likes")
      .populate({
        path: "likes",
        populate: {
          path: "author",
        },
      });
  } catch (err) {
    return next("El login ha fallado, inténtalo más tarde por favor.");
  }

  if (!existingUser) {
    return next("Datos incorrectos, no se pudo iniciar sesión.");
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next("Contraseña incorrecta!");
  }

  if (!isValidPassword) {
    return next("El login ha fallado, inténtalo más tarde por favor.");
  }

  // let token;
  // try {
  //   token = jwt.sign(
  //     { userId: existingUser.id, email: existingUser.email },
  //     "secret_pass",
  //     { expiresIn: "1h" }
  //   );
  // } catch (error) {
  //   return next("El login ha fallado, inténtalo más tarde por favor.");
  // }

  res.json(existingUser);
  // res.json({
  //   userId: existingUser.id,
  //   email: existingUser.email,
  //   token: token
  // });
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
    return next(error);
  }
});

userRouter.put("/users/addLike", async (request, response, next) => {
  const { body } = request;
  try {
    const res = await User.findOneAndUpdate(
      { _id: body.userId },
      { $addToSet: { likes: body.placeId } },
      { new: true }
    )
      .populate("likes")
      .populate({
        path: "likes",
        populate: {
          path: "author",
        },
      });

    response.json(res);
  } catch (error) {
    return next(error);
  }
});

userRouter.put("/users/deleteLike", async (request, response, next) => {
  const { body } = request;
  try {
    const res = await User.updateOne(
      { _id: body.userId },
      { $pull: { likes: body.placeId } }
    );
    response.json(res);
  } catch (error) {
    return next(error);
  }
});

userRouter.put("/users/addComment", async (request, response, next) => {
  const { userId, commentId } = request.body;

  try {
    const res = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { comments: commentId } }
    );
    response.json(res);
  } catch (error) {
    return next(error);
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
      return next(error);
    }
  }
);

module.exports = userRouter;
