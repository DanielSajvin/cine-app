// src/components/admin/CrearSala.js
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../header/Header";
import Footer from "../header/Footer";
import styles from "./styles/CrearPelicula.module.css"; // Reutilizamos los estilos del formulario de película

const CrearSala = () => {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    rows: "",
    columns: "",
    peliculas_id: "",
  });

  const [peliculas, setPeliculas] = useState([]);

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

  useEffect(() => {
    // Cargamos las películas para que el usuario pueda seleccionar una
    fetch("http://localhost:4000/api/pelicula/listarPeliculas")
      .then((res) => res.json())
      .then((data) => setPeliculas(data))
      .catch((err) =>
        console.error("Error al cargar las películas para la sala:", err)
      );
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Convertimos valores a número donde aplica
    const payload = {
      ...formData,
      rows: Number(formData.rows),
      columns: Number(formData.columns),
      peliculas_id: Number(formData.peliculas_id),
    };

    try {
      const response = await fetch(
        "http://localhost:4000/api/salas/crearSala",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.message || "No se pudo crear la sala"}`);
        return;
      }

      alert("Sala creada exitosamente ✅");
      console.log("Sala creada:", data.sala);
      handleReset(); // Limpiar el formulario
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Ocurrió un error al crear la sala.");
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      rows: "",
      columns: "",
      peliculas_id: "",
    });
  };

  return (
    <div className={styles.appContainer}>
      <Header usuario={usuario} tipoUsuario={tipoUsuario} />
      <main className={styles.formularioContainer}>
        <h1 className={styles.tituloFormulario}>Crear Sala</h1>
        <form onSubmit={handleSubmit} onReset={handleReset}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Nombre de la Sala:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rows" className={styles.formLabel}>
              Número de Filas:
            </label>
            <input
              type="number"
              id="rows"
              name="rows"
              value={formData.rows}
              onChange={handleChange}
              required
              min="1"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="columns" className={styles.formLabel}>
              Número de Columnas:
            </label>
            <input
              type="number"
              id="columns"
              name="columns"
              value={formData.columns}
              onChange={handleChange}
              required
              min="1"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="peliculas_id" className={styles.formLabel}>
              Película Asociada:
            </label>
            <select
              id="peliculas_id"
              name="peliculas_id"
              value={formData.peliculas_id}
              onChange={handleChange}
              required
              className={styles.formInput}
            >
              <option value="">Seleccione una película</option>
              {peliculas.map((pelicula) => (
                <option key={pelicula.id} value={pelicula.id}>
                  {pelicula.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitBtn}`}
            >
              Crear Sala
            </button>
            <button
              type="reset"
              className={`${styles.button} ${styles.cancelBtn}`}
            >
              Limpiar
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CrearSala;
