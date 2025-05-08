import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../header/Header";
import Footer from "../header/Footer";
import styles from "../admin/styles/CrearPelicula.module.css";

const FormularioPelicula = () => {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [imagenURL, setImagenURL] = useState("");

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

  return (
    <div className={styles.formularioWrapper}>
      <Header usuario={usuario} tipoUsuario={tipoUsuario}/>
      <div className={styles.formularioContainer}>
        <h1 className={styles.tituloFormulario}>Crear Película</h1>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Título</label>
          <input type="text" className={styles.formInput} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Director</label>
          <input type="text" className={styles.formInput} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Año</label>
          <input type="number" className={styles.formInput} />
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
            <img src={imagenURL} alt="Vista previa" className={styles.previewImage} />
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Descripción</label>
          <textarea className={styles.formTextarea}></textarea>
        </div>

        <div className={styles.formActions}>
          <button className={`${styles.button} ${styles.submitBtn}`}>Guardar</button>
          <button className={`${styles.button} ${styles.cancelBtn}`}>Cancelar</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FormularioPelicula;
