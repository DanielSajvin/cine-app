import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Header from "../header/Header";
import Footer from "../header/Footer";
import "./styles/Home.css";

const Home = () => {
  // Datos simulados como si vinieran de la base de datos
  const usuario = "Carlos";
  const peliculas = [
    {
      titulo: "Guardianes de la Galaxia",
      descripcion:
        "Cuenta la historia de un grupo de forajidos intergalácticos que se unen para salvar el universo",
      imagen: "ruta/guardianes.jpg",
    },
    {
      titulo: "Shrek",
      descripcion:
        "Historia de un ogro verde que junto a su amigo burro, rescatan a una princesa.",
      imagen: "ruta/shrek.jpg",
    },
    {
      titulo: "Rápidos y Furiosos",
      descripcion:
        "Es una película de acción de 2001 dirigida por Rob Cohen y protagonizada por Paul Walker y Vin Diesel",
      imagen: "ruta/rapidos.jpg",
    },
  ];

  return (
    <div className="app-container">
      <Header usuario={usuario} />

      <main className="peliculas-container">
        {peliculas.map((peli, index) => (
          <div className="pelicula-card" key={index}>
            <img
              src={peli.imagen}
              alt={peli.titulo}
              className="pelicula-imagen"
            />
            <h3>{peli.titulo}</h3>
            <p>{peli.descripcion}</p>
            <button className="reservar-btn">Reservar Asiento</button>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default Home;
