const express = require("express");
const empaquetado = express.Router();

const peliculaRouter = require("./peliculas/peliculas.routes");
const usuariosRouter = require("./usuarios/usuarios.routes");

empaquetado.use("/pelicula", peliculaRouter);
empaquetado.use("/usuarios", usuariosRouter)


module.exports = empaquetado;
