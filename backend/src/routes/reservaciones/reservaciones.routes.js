const express = require("express");
const reservacionesRouter = express.Router();

const { verificarToken, verificarAdmin } = require("../../middlewares/auth");
const {
  crearReservacion,
  listarReservaciones,
} = require("../../controllers/reservaciones.controller");

// Definir la ruta
// solo usuarios autenticados pueden crear reservaciones
reservacionesRouter.post("/crearReservacion", verificarToken, crearReservacion);

// solo administradores pueden listar reservaciones
reservacionesRouter.get("/listarReservaciones", verificarToken, verificarAdmin, listarReservaciones);

module.exports = reservacionesRouter;
