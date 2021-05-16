const userRouter = require("express").Router();
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const fileUpload = require('../utils/file-upload');
const User = require("../models/userModel");

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
userRouter.post('/signup', fileUpload.single('avatar'), async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next('Inputs inválidos, por favor comprueba la información del registro.'
    );
  }

  const { username, email, passwordHash } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next('El registro ha fallado, inténtalo más tarde por favor.');
  }

  if (existingUser) {
    return next('El usuario ya existe, inicia sesión en vez de registrarte por favor.');
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(passwordHash, 12);
  } catch (err) {
    return next('No se puede crear el usuario, inténtelo más tarde por favor.');
  }

  const createdUser = new User({
    username,
    email,
    passwordHash: hashedPassword,
    likes: [],
    comments: [],
    places: [],
    // avatar: req.file.path, //Esto será para cuando pongamos la imagen del avatar
  });

  try {
    await createdUser.save();
    console.log(createdUser);
  } catch (err) {
    return next('El registro ha fallado, inténtalo más tarde por favor.');
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
});


// Este login funciona, el problema es que encripto la contraseña y para iniciar sesión la contraseña es la que está ENCRIPTADA, no la original
userRouter.post('/login', async (req, res, next) => {
  const { email, passwordHash } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next('El login ha fallado, inténtalo más tarde por favor.');
  }

  if (!existingUser) {
    return next('Datos incorrectos, no se pudo iniciar sesión.');
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(passwordHash, existingUser.passwordHash);
  } catch (error) {
    return next('Contraseña incorrecta!');
  }


  if (!isValidPassword) {
    return next('El login ha fallado, inténtalo más tarde por favor.');
  }


  res.json({
    message: 'Login con éxito!',
    user: existingUser.toObject({ getters: true })
  });
});

/* ----- */



userRouter.post("/users/create", async (request, response, next) => {
  const { body } = request;

  const newUser = new User({ ...body });

  try {
    const res = await newUser.save();
    response.json(res);
  } catch (error) {
    return next(error);
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
    return next(error);
  }
});

userRouter.put("/users/addLike", async (request, response, next) => {
  const { body } = request;
  try {
    const res = await User.updateOne(
      { _id: body.userId },
      { $push: { likes: body.placeId } }
    );
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
