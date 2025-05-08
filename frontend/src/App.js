import "./App.css";
import React from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import Formulario from "./components/login/formulario/Formulario";
import RutaPrivada from "./components/ruta-privada/RutaPrivada";
import DeshabilitarUsuario from "./components/admin/DeshabilitarUsuario";
import CrearSala from "./components/admin/CrearSala";
import ModificarSala from "./components/admin/ModificarSala";
import CrearPelicula from "./components/admin/CrearPelicula";
import ModificarPelicula from "./components/admin/ModificarPelicula";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Formulario />} />

        <Route
          path="/home"
          element={
            <RutaPrivada>
              <Home />
            </RutaPrivada>
          }
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/deshabilitar-usuario"
          element={
            <RutaPrivada>
              <DeshabilitarUsuario />
            </RutaPrivada>
          }
        />
        <Route
          path="/crear-sala"
          element={
            <RutaPrivada>
              <CrearSala />
            </RutaPrivada>
          }
        />
        <Route
          path="/modificar-sala"
          element={
            <RutaPrivada>
              <ModificarSala />
            </RutaPrivada>
          }
        />
        <Route
          path="/crear-pelicula"
          element={
            <RutaPrivada>
              <CrearPelicula />
            </RutaPrivada>
          }
        />
        <Route
          path="/modificar-pelicula"
          element={
            <RutaPrivada>
              <ModificarPelicula />
            </RutaPrivada>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
