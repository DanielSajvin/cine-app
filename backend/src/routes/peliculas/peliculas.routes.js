const express = require("express");
const peliculaRouter = express.Router();

const {
  crearPelicula,
  buscarPeliculaPorNombre,
  actualizarPelicula,
  eliminarPelicula,
  listarPeliculas,
} = require("../../controllers/peliculas.controller");

peliculaRouter.use((req, res, next) => {
  console.log("revisar si si es admin  y esta auth");
  next();
})

// Definir la ruta
peliculaRouter.post("/crearPelicula", crearPelicula);
peliculaRouter.get("/buscarPelicula", buscarPeliculaPorNombre);
peliculaRouter.put("/actualizarPelicula/:id", actualizarPelicula);
peliculaRouter.delete("/eliminarPelicula/:id", eliminarPelicula);
peliculaRouter.get("/listarPeliculas", listarPeliculas);

module.exports = peliculaRouter;
