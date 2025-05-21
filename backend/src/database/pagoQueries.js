module.exports = {
  obtenerIdDelAsiento: `
  SELECT id FROM asientos 
  WHERE fila = ? AND columna = ? AND salas_id = ?
`,
  reservarAsiento: `
        UPDATE reservaciones
        SET estado = 'reservado'
        WHERE usuarios_id = ? AND asientos_id = ? AND estado = 'pendiente'
      `,
};
