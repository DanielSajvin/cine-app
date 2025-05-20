const pool = require("../config/db");
const queries = require("../database/salasQueries");

const crearSala = async (req, res) => {
  let { name, rows, columns, peliculas_id } = req.body;

  // validaciones
  if (!name || !rows || !columns || !peliculas_id) {
    return res
      .status(400)
      .json({ mensaje: "Todos los campos son obligatorios" });
  }
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message:
        "El nombre de la sala es obligatorio y debe ser un nombre válido",
    });
  }
  if (!rows || isNaN(rows) || rows <= 0) {
    return res
      .status(400)
      .json({ message: "El número de filas debe ser mayor que 0." });
  }
  if (!columns || isNaN(columns) || columns <= 0) {
    return res
      .status(400)
      .json({ message: "El número de columnas debe ser mayor que 0." });
  }
  if (!peliculas_id || isNaN(peliculas_id)) {
    return res.status(400).json({
      message: "El ID de la película es obligatorio y debe ser un número.",
    });
  }

  try {
    // verificar que la película existe
    const [pelicula] = await pool.query(queries.verificarPeliculaExiste, [
      peliculas_id,
    ]);
    if (pelicula.length === 0) {
      return res
        .status(404)
        .json({ message: "La película específicada no existe" });
    }

    const [salaExistente] = await pool.query(queries.salaExistente, [
      name,
      peliculas_id,
    ]);

    if (salaExistente.length > 0) {
      return res.status(409).json({
        message: "Ya existe una sala con este nombre para esta película.",
      });
    }

    // crear la sala
    const [result] = await pool.query(queries.crearSala, [
      name,
      rows,
      columns,
      peliculas_id,
    ]);
    const salaId = result.insertId;

    // Generar los asientos para la sala
    const asientos = [];
    for (let i = 0; i < rows; i++) {
      const filaLetra = String.fromCharCode(65 + i); // 65 = 'A', 66 = 'B', etc.
      for (let columna = 1; columna <= columns; columna++) {
        asientos.push([filaLetra, columna, salaId]);
      }
    }

    // insertar los asientos en la base de datos
    await pool.query(queries.insertarAsientos, [asientos]);

    // obtener la sala recién creada, incluyendo el nombre de la película
    const [sala] = await pool.query(queries.obtenerSalaConPelicula, [
      result.insertId,
    ]);

    res
      .status(201)
      .json({ message: "Sala creada existosamente", sala: sala[0] });
  } catch (error) {
    console.log("Error al crear la sala: ", error);
    res.status(500).json({ message: "Error al crear la sala", error });
  }
};

const listarSalas = async (req, res) => {
  try {
    const [salas] = await pool.query(queries.listarSalas);
    res.json({ salas });
  } catch (error) {
    console.log("Error al listar las salas: ", error);
    res.status(500).json({ message: "Error al listar las salas", error });
  }
};

const actualizarSala = async (req, res) => {
  const { id } = req.params; // id de la sala
  const { name, rows, columns, peliculas_id } = req.body;

  // validaciones
  // Verificar si hay reservaciones activas para la sala
  const [reservas] = await pool.query(queries.verificarReservasEnSala, [id]);
  if (reservas[0].total > 0) {
    return res.status(400).json({
      message:
        "No se puede actualizar la sala porque ya tiene reservaciones activas.",
    });
  }

  if (!name || !rows || !columns || !peliculas_id) {
    return res
      .status(400)
      .json({ mensaje: "Todos los campos son obligatorios" });
  }
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message:
        "El nombre de la sala es obligatorio y debe ser un nombre válido",
    });
  }
  if (!rows || isNaN(rows) || rows <= 0) {
    return res
      .status(400)
      .json({ message: "El número de filas debe ser mayor que 0." });
  }
  if (!columns || isNaN(columns) || columns <= 0) {
    return res
      .status(400)
      .json({ message: "El número de columnas debe ser mayor que 0." });
  }
  if (!peliculas_id || isNaN(peliculas_id)) {
    return res.status(400).json({
      message: "El ID de la película es obligatorio y debe ser un número.",
    });
  }

  try {
    // verificar que la sala existe
    const [sala] = await pool.query(queries.verificarSalaExiste, [id]);
    if (sala.length === 0) {
      return res
        .status(404)
        .json({ message: "La sala específicada no existe" });
    }

    // verificar que la película existe, antes de actualizar
    const [pelicula] = await pool.query(queries.verificarPeliculaExiste, [
      peliculas_id,
    ]);
    if (pelicula.length === 0) {
      return res
        .status(404)
        .json({ message: "La película específicada no existe" });
    }

    // actualizar la sala
    await pool.query(queries.actualizarSala, [
      name,
      rows,
      columns,
      peliculas_id,
      id,
    ]);

    // obtener la sala actualizada, incluyendo el nombre de la película
    const [salaActualizada] = await pool.query(queries.obtenerSalaConPelicula, [
      id,
    ]);

    res.json({
      message: "Sala actualizada existosamente",
      sala: salaActualizada[0],
    });
  } catch (error) {
    console.log("Error al actualizar la sala: ", error);
    res.status(500).json({ message: "Error al actualizar la sala", error });
  }
};

const eliminarSala = async (req, res) => {
  const { id } = req.params; // id de la sala

  // validar que el id se un número válido
  if (!id || isNaN(id)) {
    return res.status(400).json({
      message: "El ID de la sala es obligatorio y debe ser un número válido.",
    });
  }

  try {
    // verificar que la sala existe, antes de eliminarla
    const [sala] = await pool.query(queries.verificarSalaExiste, [id]);
    if (sala.length === 0) {
      return res
        .status(404)
        .json({ message: "La sala específicada no existe" });
    }

    // eliminar la sala
    await pool.query(queries.eliminarSala, [id]);

    res.json({ message: "Sala eliminada existosamente" });
  } catch (error) {
    console.log("Error al eliminar la sala: ", error);
    res.status(500).json({ message: "Error al eliminar la sala", error });
  }
};

const obtenerSalaConPelicula = async (req, res) => {
  const { id } = req.params; // id es el de la película

  try {
    // Verificar si hay una sala asociada a esa película
    const [sala] = await pool.query(queries.verificarSalaPelicula, [id]);

    if (sala.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontró una sala asociada a esta película." });
    }

    // Obtener la sala junto con el nombre de la película
    const [salaConPelicula] = await pool.query(
      queries.obtenerSalaConNombreDePelicula,
      [id]
    );

    res.json({ sala: salaConPelicula[0] });
  } catch (error) {
    console.log("Error al obtener la sala: ", error);
    res.status(500).json({ message: "Error al obtener la sala", error });
  }
};

module.exports = {
  crearSala,
  listarSalas,
  actualizarSala,
  eliminarSala,
  obtenerSalaConPelicula,
};
