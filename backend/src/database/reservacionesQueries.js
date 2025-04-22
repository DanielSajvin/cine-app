module.exports = {
  verificarDisponibilidadAsiento: `
      SELECT * FROM reservaciones 
      WHERE asientos_id = ? AND fecha = ? AND estado = 'reservado'
    `,
  crearReservacion: `
      INSERT INTO reservaciones (fecha, estado, usuarios_id, asientos_id) 
      VALUES (?, 'reservado', ?, ?)
    `,
};
