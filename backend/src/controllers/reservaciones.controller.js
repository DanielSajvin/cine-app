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

const listarReservaciones = async (req, res) => {
  try {
    const [reservaciones] = await pool.query(queries.listarReservaciones);
    res.json(reservaciones);
  } catch (error) {
    console.error("Error al listar reservaciones:", error);
    res.status(500).json({ message: "Error al obtener reservaciones", error });
  }
};

const obtenerAsientosOcupados = async (req, res) => {
  const { idPelicula } = req.params;
  const { fecha } = req.query;

  if (!fecha) {
    return res.status(400).json({ message: "La fecha es obligatoria." });
  }

  try {
    // Obtener la sala asociada a la película
    const [salaResult] = await pool.query(
      "SELECT id FROM salas WHERE peliculas_id = ?",
      [idPelicula]
    );

    if (salaResult.length === 0) {
      return res
        .status(404)
        .json({ message: "Sala no encontrada para esta película." });
    }

    const salaId = salaResult[0].id;

    // Obtener los asientos de esa sala que están reservados en la fecha dada
    const [asientosOcupados] = await pool.query(
      `
      SELECT r.asientos_id FROM reservaciones r
      JOIN asientos a ON r.asientos_id = a.id
      WHERE a.salas_id = ? AND r.fecha = ?
      `,
      [salaId, fecha]
    );

    res.json({ asientos: asientosOcupados });
  } catch (error) {
    console.error("Error al obtener asientos ocupados:", error);
    res
      .status(500)
      .json({ message: "Error al obtener asientos ocupados", error });
  }
};

const obtenerAsientosReservadosPorSala = async (req, res) => {
  const { idSala } = req.params;

  if (!idSala || isNaN(idSala)) {
    return res.status(400).json({ message: "ID de sala inválido." });
  }

  try {
    const [asientos] = await pool.query(
      queries.obtenerAsientosReservadosPorSala,
      [idSala]
    );

    res.status(200).json({ asientosReservados: asientos });
  } catch (error) {
    console.error("Error al obtener asientos reservados:", error);
    res.status(500).json({
      message: "Ocurrió un error al obtener los asientos reservados.",
    });
  }
};

module.exports = {
  crearReservacion,
  listarReservaciones,
  obtenerAsientosOcupados,
  obtenerAsientosReservadosPorSala,
};
