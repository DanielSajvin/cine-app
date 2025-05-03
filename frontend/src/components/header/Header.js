import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ usuario, tipoUsuario }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar el token del localStorage
    navigate("/login"); // Redirigir al usuario a la página de inicio de sesión
  };
  console.log("Renderizando Header con: ", usuario, tipoUsuario); // Verifica los valores de usuario y tipoUsuario

  return (
    <header className="header">
      <div className="logo">
        <img src="/images/3365444_1701.jpg" alt="RetroMovie Logo" />
      </div>

      <div className="header-content">
        <h1 className="welcome-text">¡Bienvenido {usuario}!</h1>

        <div className="header-buttons">
          {tipoUsuario === "admin" && (
            <>
              <button className="header-btn">Crear Sala</button>
              <button className="header-btn">Modificar Sala</button>
              <button className="header-btn">Deshabilitar Usuario</button>
            </>
          )}
          <button className="header-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
