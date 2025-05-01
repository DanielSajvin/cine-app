import React from "react";

const Header = ({ usuario }) => {
  return (
    <header className="header">
      <div className="logo">
        <img src="../home/images/255.png" alt="RetroMovie Logo" />

      </div>
      <h1>¡Bienvenido {usuario}!</h1>
      <div className="header-buttons">
        <button className="header-btn">Crear Sala</button>
        <button className="header-btn">Modificar Sala</button>
        <button className="header-btn">Deshabilitar Usuario</button>
        <button className="header-btn">Cerrar Sesión</button>
      </div>
    </header>
  );
};

export default Header;
