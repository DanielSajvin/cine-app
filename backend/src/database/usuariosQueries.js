module.exports = {
  obtenerUsuarios: "SELECT id, userName, type, state FROM usuarios",
  registrarUsuario: "INSERT INTO usuarios (name, userName, password) VALUES (?, ?, ?)",
  obtenerUsuarioPorNombre: "SELECT * FROM usuarios WHERE userName = ?",
  obtenerTipoDeUsuario: "SELECT type FROM usuarios WHERE id = ?",
  cambiarRolDeUsuario: "UPDATE usuarios SET type = ? WHERE id = ?",
  deshabilitarUsuario: "UPDATE usuarios SET state = 0 WHERE id = ?",
};
