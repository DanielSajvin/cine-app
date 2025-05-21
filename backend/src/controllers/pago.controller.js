const pool = require("../config/db");
const queries = require("../database/pagoQueries");

const confirmarPago = async (req, res) => {
  const { asientos, salaId } = req.body;
  const userId = req.user.userId;

  console.log("→ Asientos recibidos:", asientos);
  console.log("→ Sala ID:", salaId);
  console.log("→ Usuario ID:", userId);

  try {
    for (let asiento of asientos) {
      const [fila, ...colRest] = asiento;
      const columna = parseInt(colRest.join(""));
      const filaNormalizada = fila.toUpperCase();

      const [asientoResult] = await pool.query(queries.obtenerIdDelAsiento, [
        filaNormalizada,
        columna,
        salaId,
      ]);

      if (asientoResult.length === 0) continue;

      const asientoId = asientoResult[0].id;

      await pool.query(queries.reservarAsiento, [userId, asientoId]);
    }

    res.json({ message: "Pago confirmado. Reservaciones actualizadas." });
  } catch (error) {
    console.error("Error al confirmar pago:", error);
    res.status(500).json({ error: "Error al confirmar el pago." });
  }
};

module.exports = { confirmarPago };
