const express = require("express");
const reservacionesRouter = express.Router();

const { verificarToken, verificarAdmin } = require("../../middlewares/auth");
const {
  crearReservacion,
  listarReservaciones,
  obtenerAsientosOcupados,
  obtenerAsientosReservadosPorSala,
} = require("../../controllers/reservaciones.controller");

// Definir la ruta
// solo usuarios autenticados pueden crear reservaciones
reservacionesRouter.post("/crearReservacion", verificarToken, crearReservacion);

reservacionesRouter.get(
  "/obtenerAsientosOcupados/:fecha",
  verificarToken,
  obtenerAsientosOcupados
);

reservacionesRouter.get(
  "/asientosReservados/:idSala",
  verificarToken,
  obtenerAsientosReservadosPorSala
);

// solo administradores pueden listar reservaciones
reservacionesRouter.get(
  "/listarReservaciones",
  verificarToken,
  verificarAdmin,
  listarReservaciones
);

module.exports = reservacionesRouter;
