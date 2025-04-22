const express = require("express");
const salasRouter = express.Router();

const { verificarToken, verificarAdmin } = require("../../middlewares/auth");

const {
  crearSala,
  actualizarSala,
  listarSalas,
  eliminarSala,
} = require("../../controllers/salas.controller");

// Definir la ruta
salasRouter.post("/crearSala", verificarToken, verificarAdmin, crearSala); // c
salasRouter.get("/listarSalas", verificarToken, verificarAdmin, listarSalas); // r
salasRouter.put("/actualizarSala/:id", verificarToken, verificarAdmin, actualizarSala); // u
salasRouter.delete("/eliminarSala/:id", verificarToken, verificarAdmin, eliminarSala); // d 

module.exports = salasRouter;
