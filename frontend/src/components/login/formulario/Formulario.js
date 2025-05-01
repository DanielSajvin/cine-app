import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../login.css";

function Formulario() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = { userName, password };

    try {
      const res = await fetch(
        "http://localhost:4000/api/usuarios/loginUsuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMensaje("Inicio de sesión exitoso. Redirigiendo...");
        setTimeout(() => {
          navigate("/home"); // Redirige a la página de inicio después de 2 segundos PENDIENTE ESTA VISTA
        }, 1500);
      } else {
        setMensaje(data.mensaje);
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor. Inténtalo de nuevo.");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <div className="image-section">
        <div className="overlay">Bienvenido</div>
      </div>

      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Iniciar Sesión</button>
        </form>

        {mensaje && <p>{mensaje}</p>}

        <p>
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="login-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Formulario;
