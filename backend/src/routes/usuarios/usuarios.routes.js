const express = require("express");
const usuariosRouter = express.Router();

const { obtenerUsuarios } = require("../../controllers/usuarios.controller");

// Definir la ruta
usuariosRouter.get("/listarUsuarios", obtenerUsuarios);

module.exports = usuariosRouter;
