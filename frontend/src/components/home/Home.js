import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "../header/Header";
import Footer from "../header/Footer";
import "./styles/Home.css";

const Home = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState(null); // Estado para almacenar el tipo de usuario
  const navigate = useNavigate();

  // Verifica si el token existe y decodifica el token para obtener el nombre de usuario y tipo de usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token){
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

  useEffect(() => {
    fetch("http://localhost:4000/api/pelicula/listarPeliculas")
      .then((res) => res.json())
      .then((data) => {
        setPeliculas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las peliculas:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      {usuario && tipoUsuario && (
        <Header usuario={usuario} tipoUsuario={tipoUsuario} />
      )}

      <main className="peliculas-container">
        {loading ? (
          <p>Cargando películas...</p>
        ) : (
          peliculas.map((peli, index) => (
            <div className="pelicula-card" key={index}>
              <img
                src={peli.poster} // Usamos la URL de la imagen que viene desde la BD
                alt={peli.name}
                className="pelicula-imagen"
              />
              <h3>{peli.name}</h3>
              <p>{peli.description}</p>
              <button className="reservar-btn" onClick={() => navigate(`/sala/${peli.id}`)}>Reservar Asiento</button>
            </div>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
