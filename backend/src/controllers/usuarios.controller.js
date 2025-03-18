const pool = require("../config/db");
const queries = require("../database/usuariosQueries");

const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(queries.obtenerUsuarios);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

module.exports = { obtenerUsuarios }
