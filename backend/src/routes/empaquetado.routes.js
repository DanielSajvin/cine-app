const express = require("express");
const empaquetado = express.Router();

const peliculaRouter = require("./peliculas/peliculas.routes");
const usuariosRouter = require("./usuarios/usuarios.routes");
const salasRouter = require("./salas/salas.routes");
const reservacionesRouter = require("./reservaciones/reservaciones.routes")
const asientosRouter = require("./asientos/asientos.routes");
const pagoRouter = require("./pago/pago.routes");

empaquetado.use("/pelicula", peliculaRouter);
empaquetado.use("/usuarios", usuariosRouter);
empaquetado.use("/salas", salasRouter);
empaquetado.use("/reservaciones", reservacionesRouter);
empaquetado.use("/asientos", asientosRouter);
empaquetado.use("/pago", pagoRouter);

module.exports = empaquetado;
