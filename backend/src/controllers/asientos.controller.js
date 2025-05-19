const pool = require("../config/db");
const queries = require("../database/asientosQueries");

const obtenerAsientosPorSala = async (req, res) => {
  const { sala_id } = req.params;
  if (!sala_id)
    return res.status(400).json({ message: "El ID de la sala es obligatorio" });

  try {
    const [asientos] = await pool.query(queries.obtenerAsientosPorSala, [
      sala_id,
    ]);
    res.json({ asientos });
  } catch (error) {
    console.error("Error al obtener los asientos:", error);
    res.status(500).json({ message: "Error al obtener los asientos", error });
  }
};

module.exports = { obtenerAsientosPorSala };
