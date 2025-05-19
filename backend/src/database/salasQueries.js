module.exports = {
  insertarAsientos: "INSERT INTO asientos (fila, columna, salas_id) VALUES ?",
  salaExistente: "SELECT id FROM salas WHERE name = ? AND peliculas_id = ?",
  verificarPeliculaExiste: "SELECT id FROM peliculas WHERE id = ?",
  verificarSalaPelicula: "SELECT * FROM salas WHERE peliculas_id = ?",
  verificarSalaExiste: "SELECT id FROM salas WHERE id = ?",
  crearSala: `
          INSERT INTO salas (\`name\`, \`rows\`, \`columns\`, \`peliculas_id\`) 
          VALUES (?, ?, ?, ?)`,
  obtenerSalaConPelicula: `
          SELECT salas.*, peliculas.name AS pelicula_nombre FROM salas JOIN peliculas ON salas.peliculas_id = peliculas.id WHERE salas.peliculas_id = ?`,
  actualizarSala:
    "UPDATE salas SET `name` = ?, `rows` = ?, `columns` = ?, `peliculas_id` = ? WHERE id = ?",
  listarSalas:
    "SELECT salas.id, salas.`name`, salas.`rows`, salas.`columns`, salas.peliculas_id, peliculas.`name` AS pelicula_nombre FROM salas JOIN peliculas ON salas.peliculas_id = peliculas.id",
  eliminarSala: "DELETE FROM salas WHERE id = ?",
  obtenerSalaConNombreDePelicula: `SELECT salas.*, peliculas.name AS pelicula_nombre
       FROM salas
       JOIN peliculas ON salas.peliculas_id = peliculas.id
       WHERE salas.peliculas_id = ?`,
  verificarReservasEnSala: `
  SELECT COUNT(*) AS total
  FROM reservaciones r
  JOIN asientos a ON r.asientos_id = a.id
  WHERE a.salas_id = ? AND r.estado = 'reservado'`, 
};
