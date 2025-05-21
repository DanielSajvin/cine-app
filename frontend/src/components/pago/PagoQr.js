import { useLocation, useNavigate } from "react-router-dom";
import styles from "./styles/PagoQr.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";

const PagoQR = () => {
  const location = useLocation();
  const navigate = useNavigate(); // <- 🔧 Estaba faltando
  const pdfRef = useRef(); // <- 🔧 Estaba faltando

  const query = new URLSearchParams(location.search);
  const pelicula = query.get("pelicula");
  const sala = query.get("sala");
  const asientos = query.get("asientos")?.split("-");
  const total = query.get("total");

  // 🔧 Definimos correctamente la función generarPDF
  const generarPDF = async () => {
    const input = pdfRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Ticket_${pelicula}.pdf`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Ticket de Reservación</h2>
      </div>

      <div className={styles.ticket} ref={pdfRef}>
        <div className={styles.details}>
          <p>
            <strong>Película:</strong> {pelicula}
          </p>
          <p>
            <strong>Sala:</strong> {sala}
          </p>
          <p>
            <strong>Asientos:</strong> {asientos?.join(", ")}
          </p>
          <p>
            <strong>Total pagado:</strong> Q{total}
          </p>
          <p>
            <strong>Fecha de emisión:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className={styles.qrContainer}>
          <p>Gracias por tu compra 🎉</p>
        </div>
      </div>

      <button className={styles.volverBtn} onClick={() => navigate("/home")}>
        Volver al inicio
      </button>

      <button className={styles.pdfBtn} onClick={generarPDF}>
        Descargar Ticket en PDF
      </button>
    </div>
  );
};

export default PagoQR;
