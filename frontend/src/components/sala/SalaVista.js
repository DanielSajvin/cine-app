import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
    fetch(
      `http://localhost:4000/api/salas/obtenerSalaConPelicula/${idPelicula}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setSala(data.sala);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la sala:", error);
        setLoading(false);
      });
  }, [idPelicula]);

  if (loading) return <p>Cargando sala...</p>;
  if (!sala) return <p>No se encontró la sala para esta película.</p>;

  const generarLetras = (num) => {
    const letras = [];
    for (let i = 0; i < num; i++) {
      letras.push(String.fromCharCode(65 + i)); // A, B, C, ...
    }
    return letras;
  };

  const filas = generarLetras(sala.rows);
  const columnas = Array.from({ length: sala.columns }, (_, i) => i + 1);

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
                  const status = "free"; // luego lo puedes hacer dinámico
                  return (
                    <div
                      key={seatId}
                      id={seatId}
                      data-status={status}
                      className={`${styles.seat} ${styles[status]}`}
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

          <button className={styles.reserveBtn}>Reservar Asientos</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SalaVista;
