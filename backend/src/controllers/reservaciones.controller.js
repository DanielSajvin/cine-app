const pool = require("../config/db");
const queries = require("../database/reservacionesQueries");
const jwt = require("jsonwebtoken");

const crearReservacion = async (req, res) => {
  const { asientos, salaId } = req.body;

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;
    const fecha = new Date();
    const estado = "pendiente";

    // Crear reservación para cada asiento
    for (let asiento of asientos) {
      const [fila, ...colRest] = asiento;
      const columna = parseInt(colRest.join(""));

      // Normaliza fila a mayúscula si así están en la BD
      const filaNormalizada = fila.toUpperCase();

      // Obtener el id del asiento desde la base de datos
      console.log("Buscando asiento:", { fila, columna, salaId });
      const [asientoResult] = await pool.query(queries.obtenerIdDelAsiento, [
        filaNormalizada,
        columna,
        salaId,
      ]);

      if (asientoResult.length === 0) {
        return res
          .status(400)
          .json({ error: `Asiento ${asiento} no encontrado.` });
      }

      const asientoId = asientoResult[0].id;

      // Insertar reservación
      await pool.query(queries.insertarReservacion, [
        fecha,
        estado,
        userId,
        asientoId,
      ]);
    }

    res.json({ message: "Reservación creada correctamente" });
  } catch (error) {
    console.error("Error al crear reservación:", error);
    res.status(500).json({ error: "Error al crear la reservación" });
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
