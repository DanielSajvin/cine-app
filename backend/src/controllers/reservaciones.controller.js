const pool = require("../config/db");
const queries = require("../database/reservacionesQueries");

const crearReservacion = async (req, res) => {
  const { fecha, asientos_id } = req.body;
  const usuarioId = req.usuario.id; // obtenido desde el token JWT

  // Validar que no falte nada
  if (!fecha || !asientos_id) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios." });
  }

  // Validar fecha dentro de los próximos 8 días
  const hoy = new Date();
  const fechaLimite = new Date(hoy);
  fechaLimite.setDate(hoy.getDate() + 8);
  const fechaReservacion = new Date(fecha);

  if (isNaN(fechaReservacion.getTime())) {
    return res.status(400).json({ message: "La fecha no es válida." });
  }

  if (fechaReservacion < hoy || fechaReservacion > fechaLimite) {
    return res.status(400).json({
      message:
        "La reservación solo puede hacerse dentro de los próximos 8 días.",
    });
  }

  try {
    // Verificar si el asiento ya está reservado en esa fecha
    const [resultado] = await pool.query(
      queries.verificarDisponibilidadAsiento,
      [asientos_id, fecha]
    );

    if (resultado.length > 0) {
      return res.status(400).json({
        message: "Este asiento ya está reservado para la fecha seleccionada.",
      });
    }

    // Crear la reservación
    await pool.query(queries.crearReservacion, [fecha, usuarioId, asientos_id]);

    res.status(201).json({ message: "Reservación realizada con éxito." });
  } catch (error) {
    console.error("Error al crear la reservación:", error);
    res.status(500).json({ message: "Error al crear la reservación", error });
  }
};

const listarReservaciones = async (req, res) => {};

const actulizarReservacion = async (req, res) => {};

module.exports = { crearReservacion };
