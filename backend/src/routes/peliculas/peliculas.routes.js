const express = require("express");
const peliculaRouter = express.Router();

const { verificarToken, verificarAdmin } = require("../../middlewares/auth");

const {
  crearPelicula,
  buscarPeliculaPorNombre,
  actualizarPelicula,
  eliminarPelicula,
  listarPeliculas,
} = require("../../controllers/peliculas.controller");

peliculaRouter.use((req, res, next) => {
  next();
});

// Definir la ruta
peliculaRouter.post("/crearPelicula", verificarToken, verificarAdmin, crearPelicula);
peliculaRouter.get("/buscarPelicula", buscarPeliculaPorNombre);
peliculaRouter.put("/actualizarPelicula/:id", verificarToken, verificarAdmin, actualizarPelicula);
peliculaRouter.delete("/eliminarPelicula/:id", verificarToken, verificarAdmin, eliminarPelicula);
peliculaRouter.get("/listarPeliculas", listarPeliculas);

module.exports = peliculaRouter;
