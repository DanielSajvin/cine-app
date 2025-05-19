module.exports = {
  verificarDisponibilidadAsiento: `
      SELECT * FROM reservaciones 
      WHERE asientos_id = ? AND fecha = ? AND estado = 'reservado'
    `,
  crearReservacion: `
      INSERT INTO reservaciones (fecha, estado, usuarios_id, asientos_id) 
      VALUES (?, 'reservado', ?, ?)
    `,

  listarReservaciones: `
    SELECT 
      r.id,
      r.fecha,
      r.estado,
      u.userName AS usuario,
      a.fila,
      a.columna,
      s.name AS sala,
      p.name AS pelicula
    FROM reservaciones r
    INNER JOIN usuarios u ON r.usuarios_id = u.id
    INNER JOIN asientos a ON r.asientos_id = a.id
    INNER JOIN salas s ON a.salas_id = s.id
    INNER JOIN peliculas p ON s.peliculas_id = p.id
    ORDER BY r.fecha DESC
  `,
  asientosOcupados: `
    SELECT asientos_id 
    FROM reservaciones 
    WHERE fecha = ? AND estado = 'reservado'
  `,
  obtenerAsientosReservadosPorSala: `
  SELECT a.fila, a.columna
  FROM reservaciones r
  JOIN asientos a ON r.asientos_id = a.id
  WHERE a.salas_id = ? AND r.estado = 'activo'
`,
};
