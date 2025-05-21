const requires = require("express");
const pagoRouter = requires.Router();

const { verificarToken } = require("../../middlewares/auth");

const {
  confirmarPago,
} = require("../../controllers/pago.controller");

// Definir la ruta 
pagoRouter.put("/confirmarPago", verificarToken, confirmarPago);

module.exports = pagoRouter;