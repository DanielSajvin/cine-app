const pool = require("../config/db");
const queries = require("../database/peliculasQueries");

const crearPelicula = async (req, res) => {
  const { name, description, duration, poster } = req.body;

  // validar que el nombre sea un string no vacío
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message:
        "El nombre de la película es obligatorio y debe ser un texto válido.",
    });
  }

  // validar la duración, que sea un entero y mayor a cero
  if (isNaN(duration) || duration <= 0) {
    return res.status(400).json({
      message: "La duración debe ser un número mayor que 0.",
    });
  }

  // validar la descripción, que sea un string no vacío
  if (typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({
      message: "La descripción es obligatoria y debe ser un texto válido.",
    });
  }

  try {
    // ejecutar la consulta utilizando el pool importado, para no crear uno nuevo
    const [result] = await pool.query(queries.crearPelicula, [
      name,
      description,
      duration,
      poster,
    ]);

    // la consulta se ejecutó correctamente, entonces enviar la respuesta con el resultado
    res.status(201).json({
      message: "Película creada exitosamente",
      result,
    });
  } catch (error) {
    console.log("Error en el catch:", error);
    res.status(500).json({
      message: "Erro al crear la pelicula: ",
      error,
    });
  }
};

const buscarPeliculaPorNombre = async (req, res) => {
  const { name } = req.query;

  // validar que el nombre sea un string no vacío
  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ message: "El nombre es obligatorio}" });
  }

  try {
    // ejecutar la consulta con pool importado
    const [result] = await pool.query(queries.buscarPeliculaPorNombre, [name]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No se encontró la película" });
    }
    res.json(result); // enviar las películas encontradas
  } catch (error) {
    res.status(500).json({ message: "Error al buscar la película", error });
  }
};

const actualizarPelicula = async (req, res) => {
  let { id } = req.params; // se toma el id desde la URL
  id = parseInt(id); // convertir a entero
  let { name, description, duration, poster } = req.body;

  // Validar que el id sea un número válido
  if (!id || isNaN(id)) {
    return res
      .status(400)
      .json({
        message:
          "El id de la película es obligatorio y debe ser un número válido.",
      });
  }

  // validar que el nombre sea un string no vacío
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      message:
        "El nombre de la película es obligatorio y debe ser un texto válido.",
    });
  }

  // validar la duración, que sea un entero y mayor a cero
  if (isNaN(duration) || duration <= 0) {
    return res.status(400).json({
      message: "La duración debe ser un número mayor que 0.",
    });
  }

  // validar la descripción, que sea un string no vacío
  if (typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({
      message: "La descripción es obligatoria y debe ser un texto válido.",
    });
  }

  try {
    // ejecutar la consulta utilizando el pool importado, para no crear uno nuevo
    const [result] = await pool.query(queries.actualizarPelicula, [
      name,
      description,
      duration,
      poster,
      id,
    ]);

    // Verificar si se actualizó alguna película
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    // la consulta se ejecutó correctamente, entonces enviar la respuesta con el resultado
    res.status(201).json({
      message: "Película actualizada exitosamente",
      result,
    });
  } catch (error) {
    console.log("Error en la actualización:", error);
    res.status(500).json({
      message: "Erro al actualizar la pelicula: ",
      error,
    });
  }
};

const eliminarPelicula = async (req, res) => {
  let { id } = req.params; // se toma el id desde la URL
  id = parseInt(id); // convertir a entero

  // Validar que el id sea un número válido
  if (!id || isNaN(id)) {
    return res
      .status(400)
      .json({
        message:
          "El id de la película es obligatorio y debe ser un número válido.",
      });
  }

  try {
    // ejecutar la consulta utilizando el pool importado, para no crear uno nuevo
    const [result] = await pool.query(queries.eliminarPelicula, [id]);

    // Verificar si se eliminó alguna película
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    // la consulta se ejecutó correctamente, entonces enviar la respuesta con el resultado
    res.status(201).json({
      message: "Película eliminada exitosamente",
      result,
    });
  } catch (error) {
    console.log("Error en la eliminación:", error);
    res.status(500).json({
      message: "Error al eliminar la pelicula: ",
      error,
    });
  }
}

const listarPeliculas = async (req, res) => {
  try {
    const [result] = await pool.query(queries.listarPeliculas);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al listar las peliculas", error });
  }
};

module.exports = { crearPelicula, buscarPeliculaPorNombre, actualizarPelicula, eliminarPelicula, listarPeliculas };
