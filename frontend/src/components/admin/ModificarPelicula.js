import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../header/Footer";
import { jwtDecode } from "jwt-decode";
import styles from "./styles/ModificarPelicula.module.css";

const ModificarPelicula = () => {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [peliculas, setPeliculas] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    duracion: "",
    poster: "",
  });

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

    // cargar peliculas desde el backend (base de datos)
    fetch("http://localhost:4000/api/pelicula/listarPeliculas")
      .then((res) => res.json())
      .then((data) => {
        setPeliculas(data);
      })
      .catch((error) => {
        console.error("Error al cargar las películas:", error);
      });
  }, []);

  const handleSeleccionar = (pelicula) => {
    setFormData({
      id: pelicula.id,
      nombre: pelicula.name,
      descripcion: pelicula.description,
      duracion: pelicula.duration,
      poster: pelicula.poster,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Muy importante prevenir recarga
    const token = localStorage.getItem("token");

    fetch(
      `http://localhost:4000/api/pelicula/actualizarPelicula/${formData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.nombre,
          description: formData.descripcion,
          duration: formData.duracion,
          poster: formData.poster,
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("No autorizado o error del servidor");
        }
        return res.json();
      })
      .then((data) => {
        alert("Película actualizada correctamente");
        return fetch("http://localhost:4000/api/pelicula/listarPeliculas");
      })
      .then((res) => res.json())
      .then((data) => {
        setPeliculas(data);
        handleReset();
      })
      .catch((error) => {
        console.error("Error al actualizar la película:", error);
        alert("Hubo un error al actualizar la película: " + error.message);
      });
  };

  const handleReset = () => {
    setFormData({
      id: "",
      nombre: "",
      descripcion: "",
      duracion: "",
      poster: "",
    });
  };

  return (
    <div className={styles["appContainerModificarPelicula"]}>
      <Header usuario={usuario} tipoUsuario={tipoUsuario} />
      <main className={styles["actualizarPelicula-main"]}>
        <h1 className={styles["actualizarPelicula-title"]}>
          Administrar Películas
        </h1>

        <div className={styles["actualizarPelicula-box"]}>
          <div className={styles["actualizarPelicula-selectorHeader"]}>
            <h2 className={styles["actualizarPelicula-subtitle"]}>
              Seleccionar Película
            </h2>
          </div>
          <div className={styles["actualizarPelicula-tableContainer"]}>
            <table className={styles["actualizarPelicula-table"]}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Poster</th>
                  <th>Nombre</th>
                  <th>Duración</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {peliculas.map((pelicula) => (
                  <tr key={pelicula.id}>
                    <td>{pelicula.id}</td>
                    <td>
                      <img
                        src={pelicula.poster}
                        alt="Poster"
                        className={styles["actualizarPelicula-poster"]}
                      />
                    </td>
                    <td>{pelicula.name}</td>
                    <td>{pelicula.duration} min</td>
                    <td>
                      <button
                        className={styles["actualizarPelicula-btn"]}
                        onClick={() => handleSeleccionar(pelicula)}
                      >
                        Seleccionar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles["actualizarPelicula-box"]}>
          <h2 className={styles["actualizarPelicula-subtitle"]}>
            Editar Película
          </h2>
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className={styles["actualizarPelicula-formGroup"]}>
              <label
                className={styles["actualizarPelicula-label"]}
                htmlFor="id"
              >
                ID:
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                className={styles["actualizarPelicula-input"]}
                readOnly
              />
            </div>

            <div className={styles["actualizarPelicula-formGroup"]}>
              <label
                className={styles["actualizarPelicula-label"]}
                htmlFor="nombre"
              >
                Nombre:
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className={styles["actualizarPelicula-input"]}
              />
            </div>

            <div className={styles["actualizarPelicula-formGroup"]}>
              <label
                className={styles["actualizarPelicula-label"]}
                htmlFor="descripcion"
              >
                Descripción:
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                rows="4"
                value={formData.descripcion}
                onChange={handleChange}
                required
                className={styles["actualizarPelicula-textarea"]}
              />
            </div>

            <div className={styles["actualizarPelicula-formGroup"]}>
              <label
                className={styles["actualizarPelicula-label"]}
                htmlFor="duracion"
              >
                Duración (minutos):
              </label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                min="1"
                value={formData.duracion}
                onChange={handleChange}
                required
                className={styles["actualizarPelicula-input"]}
              />
            </div>

            <div className={styles["actualizarPelicula-formGroup"]}>
              <label
                className={styles["actualizarPelicula-label"]}
                htmlFor="poster"
              >
                URL del Poster:
              </label>
              <input
                type="url"
                id="poster"
                name="poster"
                value={formData.poster}
                onChange={handleChange}
                required
                className={styles["actualizarPelicula-input"]}
              />
              <div className={styles["actualizarPelicula-imagePreview"]}>
                {formData.poster && (
                  <img
                    src={formData.poster}
                    alt="Vista previa"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>
            </div>

            <div className={styles["actualizarPelicula-actions"]}>
              <button
                type="submit"
                className={`${styles["actualizarPelicula-btn"]} ${styles["actualizarPelicula-submit"]}`}
              >
                Actualizar Película
              </button>
              <button
                type="reset"
                className={`${styles["actualizarPelicula-btn"]} ${styles["actualizarPelicula-cancel"]}`}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ModificarPelicula;
