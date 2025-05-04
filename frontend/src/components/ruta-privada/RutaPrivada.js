import React from "react";
import { Navigate } from "react-router-dom";

const RutaPrivada = ({ children, rolRequerido }) => {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si se requiere un rol específico y el usuario no cumple con este, redirigir a /home
  if (rolRequerido && (!usuario || usuario.type !== rolRequerido)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RutaPrivada;
