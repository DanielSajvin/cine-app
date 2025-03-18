module.exports = {
    crearPelicula: "INSERT INTO peliculas (name, description, duration, poster) VALUES (?, ?, ?, ?)",
    buscarPeliculaPorNombre: "SELECT * FROM peliculas WHERE TRIM(LOWER(name)) = TRIM(LOWER(?))",
    actualizarPelicula: "UPDATE peliculas SET name = ?, description = ?, duration = ?, poster = ? WHERE id = ?",
    eliminarPelicula: "DELETE FROM peliculas WHERE id = ?",
    listarPeliculas: "SELECT * FROM peliculas",
  };