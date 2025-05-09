import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../header/Header";
import Footer from "../header/Footer";
import styles from "../admin/styles/CrearPelicula.module.css";

const FormularioPelicula = () => {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  const [titulo, setTitulo] = useState("");
  const [duration, setDuration] = useState("");
  const [imagenURL, setImagenURL] = useState("");
  const [description, setDescripcion] = useState("");

  // Verifica si el token existe y decodifica el token para obtener el nombre de usuario y tipo de usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUsuario(decodedToken.userName); // Almacena el nombre de usuario en el estado
        setTipoUsuario(decodedToken.type); // Almacena el tipo de usuario en el estado
        console.log("Tipo de usuario:", decodedToken.type); // Muestra el tipo de usuario en la consola
        console.log("Nombre de usuario:", decodedToken.userName); // Muestra el nombre de usuario en la consola
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    }
  }, []);

  // enviar datos al servidor(backend)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validaciones básicas antes de enviar los datos
    if (
      !titulo.trim() ||
      !description.trim() ||
      !duration.trim() ||
      !imagenURL.trim()
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const peliculaData = {
      name: titulo,
      description: description,
      duration: parseInt(duration),
      poster: imagenURL,
    };

    try {
      const response = await fetch(
        "http://localhost:4000/api/pelicula/crearPelicula",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(peliculaData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Película creada con éxito.");
        // limpiar los campos del formulario
        setTitulo("");
        setDescripcion("");
        setDuration("");
        setImagenURL("");
      } else {
        alert("Error al crear la película: " + result.message);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Ocurrió un error al crear la película.");
    }
  };

  return (
    <div className={styles.formularioWrapper}>
      <Header usuario={usuario} tipoUsuario={tipoUsuario} />
      <div className={styles.formularioContainer}>
        <h1 className={styles.tituloFormulario}>Crear Película</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nombre de la Película</label>
            <input
              type="text"
              className={styles.formInput}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Descripción</label>
            <textarea
              className={styles.formTextarea}
              value={description}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Duración</label>
            <input
              type="number"
              className={styles.formInput}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>URL de Imagen</label>
            <input
              type="url"
              className={styles.formInput}
              value={imagenURL}
              onChange={(e) => setImagenURL(e.target.value)}
            />
          </div>

          {imagenURL && (
            <div className={styles.imagePreview}>
              <img
                src={imagenURL}
                alt="Vista previa"
                className={styles.previewImage}
              />
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="submit"
              className={`${styles.button} ${styles.submitBtn}`}
            >
              Guardar
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.cancelBtn}`}
              onClick={() => {
                setTitulo("");
                setImagenURL("");
                setDescripcion("");
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FormularioPelicula;
