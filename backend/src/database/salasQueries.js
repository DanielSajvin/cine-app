module.exports = {
  verificarPeliculaExiste: "SELECT id FROM peliculas WHERE id = ?",
  verificarSalaExiste: "SELECT id FROM salas WHERE id = ?",
  crearSala: `
          INSERT INTO salas (\`name\`, \`rows\`, \`columns\`, \`peliculas_id\`) 
          VALUES (?, ?, ?, ?)`,
  obtenerSalaConPelicula: `
          SELECT salas.id, salas.\`name\`, salas.\`rows\`, salas.\`columns\`, 
                 salas.peliculas_id, peliculas.\`name\` AS pelicula_nombre 
          FROM salas 
          JOIN peliculas ON salas.peliculas_id = peliculas.id 
          WHERE salas.id = ?`,
  actualizarSala:
    "UPDATE salas SET `name` = ?, `rows` = ?, `columns` = ?, `peliculas_id` = ? WHERE id = ?",
  listarSalas:
    "SELECT salas.id, salas.`name`, salas.`rows`, salas.`columns`, salas.peliculas_id, peliculas.`name` AS pelicula_nombre FROM salas JOIN peliculas ON salas.peliculas_id = peliculas.id",
  eliminarSala: "DELETE FROM salas WHERE id = ?",
  verificarReservasEnSala: `
  SELECT COUNT(*) AS total
  FROM reservaciones r
  JOIN asientos a ON r.asientos_id = a.id
  WHERE a.salas_id = ? AND r.estado = 'reservado'
`,
};
