const express = require("express");
const asientosRouter = express.Router();

const { verificarToken } = require("../../middlewares/auth");

const {
  obtenerAsientosPorSala,
} = require("../../controllers/asientos.controller");

// Definir la ruta
asientosRouter.get(
  "/porSala/:sala_id",
  verificarToken,
  obtenerAsientosPorSala
);

module.exports = asientosRouter;
