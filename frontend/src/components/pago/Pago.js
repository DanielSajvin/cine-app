// src/pages/Pago.jsx
import { QRCodeCanvas } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles/Pago.module.css";

const Pago = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Verifica que se hayan pasado los datos correctamente
  if (!location.state) {
    return (
      <div className={styles.pago}>
        Error: No hay información de la reservación.
      </div>
    );
  }

  const {
    pelicula,
    sala,
    salaId,
    asientos,
    precioPorAsiento = 30,
  } = location.state;
  const total = asientos.length * precioPorAsiento;

  const confirmarPago = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/pago/confirmarPago", {
        method: "PUT", // o POST, según lo que use tu backend
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ asientos, salaId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Pago confirmado. Reservación completada.");
        navigate("/home"); // redirige a donde quieras después del pago
      } else {
        alert(data.error || "Error al confirmar el pago");
      }
    } catch (error) {
      console.error("Error al confirmar pago:", error);
      alert("Error al procesar el pago.");
    }
  };

  return (
    <div className={styles.pago}>
      <h2>Pago de Reservación</h2>
      <p>
        <strong>Película:</strong> {pelicula}
      </p>
      <p>
        <strong>Sala:</strong> {sala}
      </p>
      <p>
        <strong>Asientos:</strong> {asientos.join(", ")}
      </p>
      <p>
        <strong>Total:</strong> Q{total}
      </p>
      <button className={styles.buttonPago} onClick={confirmarPago}>Confirmar Pago</button>
      <QRCodeCanvas
        value={`http://localhost:3000/pagoQR?pelicula=${encodeURIComponent(
          pelicula
        )}&sala=${encodeURIComponent(sala)}&asientos=${asientos.join(
          "-"
        )}&total=${total}`}
      />
      <p>Escanea este código QR para ver tu ticket</p>
    </div>
  );
};

export default Pago;
