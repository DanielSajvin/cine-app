const pool = require("../config/db");
const queries = require("../database/usuariosQueries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(queries.obtenerUsuarios);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

const registrarUsuario = async (req, res) => {
  let { name, userName, password } = req.body;

  // validaciones
  if (!name || !userName || !password) {
    return res
      .status(400)
      .json({ mensaje: "Todos los campos son obligatorios" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ mensaje: "La contraseña debe tener al menos 8 caracteres" });
  }

  try {
    // verificar si el usuario ya existe
    const [userExists] = await pool.query(queries.obtenerUsuarioPorNombre, [
      userName,
    ]);
    if (userExists.length > 0) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // generar hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // registrar usuario
    await pool.query(queries.registrarUsuario, [
      name,
      userName,
      hashedPassword,
    ]);

    res.status(201).json({ mensaje: "Usuario Registrado Exitosamente" });
  } catch (error) {
    console.log("Error en el registro: ", error);
    res.status(500).json({ mensaje: "Error al registrar usuario", error });
  }
};

const loginUsuario = async (req, res) => {
  const { userName, password } = req.body;

  // validaciones
  if (!userName || !password) {
    return res
      .status(400)
      .json({ mensaje: "Usuario y contraseña son obligatorios" });
  }

  try {
    // buscar el usuario en la BD
    const [user] = await pool.query(queries.obtenerUsuarioPorNombre, [
      userName,
    ]);

    if (user.length === 0) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const usuario = user[0];

    // comparar la contraseña ingresada con la encriptada en BD
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }

    // generar el JWT
    const token = jwt.sign(
      { userId: usuario.id, userName: usuario.userName, type: usuario.type },
      process.env.SECRET_KEY, // clave secreta
      { expiresIn: "1h" } // expira en 1 hora
    );

    res.json({ mensaje: "Inicio de sesión exitoso", token });
  } catch (error) {
    console.log("Error en el login: ", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};

const cambiarRolUsuario = async (req, res) => {
  const { userId } = req.params; // para recibir el id del usuario a cambiar
  const { nuevoRol } = req.body;

  console.log(req.user);

  // Validar que el rol sea 'cliente' o 'admin'
  if (nuevoRol !== "cliente" && nuevoRol !== "admin") {
    return res
      .status(400)
      .json({ message: "El rol debe ser 'cliente' o 'admin'." });
  }

  try {
    const [result] = await pool.query(queries.cambiarRolDeUsuario, [
      nuevoRol,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({ message: `Rol cambiado a ${nuevoRol} exitosamente.` });
  } catch (error) {
    console.error("Error al cambiar rol:", error);
    res.status(500).json({ message: "Error al cambiar el rol", error });
  }
};

const deshabilitarUsuario = async (req, res) => {
  const { userId } = req.params;

  try {
    const [result] = await pool.query(queries.deshabilitarUsuario, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json({ message: "Usuario deshabilitado exitosamente." });
  } catch (error) {
    console.error("Error al deshabilitar usuario:", error);
    res.status(500).json({ message: "Error al deshabilitar el usuario", error });
  }
};

module.exports = {
  obtenerUsuarios,
  registrarUsuario,
  loginUsuario,
  cambiarRolUsuario,
  deshabilitarUsuario,
};
