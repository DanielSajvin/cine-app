const expreess = require("express");
const reservacionesRouter = express.Router();

const { verficarToken } = require("../../middlewares/auth");
const {
  crearReservacion,
} = require("../../controllers/reservaciones.controller");

// Definir la ruta

// solo usuarios autenticados pueden crear reservaciones
reservacionesRouter.post("/crearReservacion", verficarToken, crearReservacion); // c

module.exports = reservacionesRouter;