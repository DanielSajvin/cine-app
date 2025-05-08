const express = require("express");
const usuariosRouter = express.Router();

const { verificarToken, verificarAdmin } = require("../../middlewares/auth");

const {
  obtenerUsuarios,
  registrarUsuario,
  loginUsuario,
  cambiarRolUsuario,
  deshabilitarUsuario,
} = require("../../controllers/usuarios.controller");

// Definir la ruta
usuariosRouter.get("/listarUsuarios", verificarToken, verificarAdmin, obtenerUsuarios);
usuariosRouter.post("/registrarUsuario", registrarUsuario);
usuariosRouter.post("/loginUsuario", loginUsuario);
usuariosRouter.put("/cambiarRolUsuario/:userId",verificarToken, verificarAdmin, cambiarRolUsuario);
usuariosRouter.put("/deshabilitarUsuario/:userId", verificarToken, verificarAdmin, deshabilitarUsuario);

module.exports = usuariosRouter;
