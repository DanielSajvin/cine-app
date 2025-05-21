import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../header/Header";
import Footer from "../header/Footer";
import styles from "./SalaVista.module.css";

const SalaVista = () => {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const { idPelicula } = useParams(); // Obtiene el id de la película desde la URL
  const [sala, setSala] = useState(null);
  const [loading, setLoading] = useState(true);

  // estados para asientos seleccionados y ocupados
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const navigate = useNavigate();

  // Verifica si el token existe y decodifica el token para obtener el nombre de usuario y tipo de usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsuario(decodedToken.userName); // Almacena el nombre de usuario en el estado
        setTipoUsuario(decodedToken.type); // Almacena el tipo de usuario en el estado
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  // obtener sala asociada a la pelicula
  useEffect(() => {
    const fetchSalaYAsientos = async () => {
      try {
        const salaRes = await fetch(
          `http://localhost:4000/api/salas/obtenerSalaConPelicula/${idPelicula}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const salaData = await salaRes.json();
        setSala(salaData.sala);

        // Obtener asientos reservados con el ID de la sala
        const asientosRes = await fetch(
          `http://localhost:4000/api/reservaciones/asientosReservados/${salaData.sala.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const dataAsientos = await asientosRes.json();
        // Convierte { fila: "A", columna: 1 } => "A1"
        const idsReservados = dataAsientos.asientosReservados.map(
          (a) => `${a.fila}${a.columna}`
        );
        setOccupiedSeats(idsReservados);
      } catch (error) {
        console.error("Error al obtener sala o asientos reservados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaYAsientos();
  }, [idPelicula]);

  const generarLetras = (num) => {
    const letras = [];
    for (let i = 0; i < num; i++) {
      letras.push(String.fromCharCode(65 + i)); // A, B, C, ...
    }
    return letras;
  };

  if (loading || !sala) {
    return <div>Cargando sala...</div>;
  }

  const filas = generarLetras(sala.rows);
  const columnas = Array.from({ length: sala.columns }, (_, i) => i + 1);

  // manejar selección de asientos
  const toggleSeat = (seatId) => {
    if (occupiedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleReservarAsientos = async () => {
    if (selectedSeats.length === 0) {
      alert("Selecciona al menos un asiento");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:4000/api/reservaciones/crearReservacion",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            asientos: selectedSeats,
            salaId: sala.id,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        const detallesPago = {
          pelicula: sala.pelicula_nombre,
          sala: sala.name,
          asientos: selectedSeats,
          salaId: sala.id, // ✅ Incluye salaId aquí dentro
          total: selectedSeats.length * 25, // precio fijo por asiento
        };
        // Redirige a la vista de pago, pasando datos por estado
        navigate("/pago", { state: detallesPago });

        // Limpia selección localmente
        setSelectedSeats([]);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al reservar asientos:", error);
      alert("Error en la conexión al servidor");
    }
  };

  return (
    <div className={styles.bodySala}>
      <Header usuario={usuario} tipoUsuario={tipoUsuario} />
      <div className={styles.appContainer}>
        <div className={styles.container}>
          <h1>{sala.pelicula_nombre} - Selección de Asientos</h1>

          <div className={styles.screen}>PANTALLA PRINCIPAL</div>

          <div className={styles.seatsContainer}>
            {filas.map((row) => (
              <div className={styles.seatRow} key={row}>
                <div className={styles.rowLabel}>{row}</div>
                {columnas.map((col) => {
                  const seatId = `${row}${col}`;
                  let status = "free";
                  if (occupiedSeats.includes(seatId)) status = "occupied";
                  else if (selectedSeats.includes(seatId)) status = "selected";

                  return (
                    <div
                      key={seatId}
                      id={seatId}
                      data-status={status}
                      className={`${styles.seat} ${styles[status]}`}
                      onClick={() => toggleSeat(seatId)}
                    >
                      {col}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={styles.cinemaInfo}>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={`${styles.seat} ${styles.free}`}></div>
                <span>Disponible</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.seat} ${styles.occupied}`}></div>
                <span>Ocupado</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.seat} ${styles.selected}`}></div>
                <span>Seleccionado</span>
              </div>
            </div>
          </div>

          <button
            className={styles.reserveBtn}
            onClick={handleReservarAsientos}
          >
            Reservar Asientos
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SalaVista;
