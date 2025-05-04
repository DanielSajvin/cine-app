import "./styles/DeshabilitarUsuario.css";
import Header from "../header/Header";
import Footer from "../header/Footer";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const DeshabilitarUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
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

  // Datos de usuarios estáticos de ejemplo
  const users = [
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@example.com",
      rol: "Administrador",
      activo: true,
    },
    {
      id: 2,
      nombre: "María García",
      email: "maria.garcia@example.com",
      rol: "Editor",
      activo: true,
    },
    {
      id: 3,
      nombre: "Carlos López",
      email: "carlos.lopez@example.com",
      rol: "Usuario",
      activo: false,
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      email: "ana.martinez@example.com",
      rol: "Editor",
      activo: true,
    },
  ];

  return (
    <div className="app-container">
      <Header usuario={usuario} tipoUsuario={tipoUsuario} />
      <div className="container">
        <h1>Listado de Usuarios</h1>
        <div className="user-list">
          {users.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-info">
                <div>
                  <h3>{user.nombre}</h3>
                  <p>{user.email}</p>
                  <p className="user-role">{user.rol}</p>
                  <span
                    className={`status ${user.activo ? "active" : "inactive"}`}
                  >
                    {user.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>
              <button className="disable-btn" disabled={!user.activo}>
                {user.activo ? "Deshabilitar" : "Deshabilitado"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeshabilitarUsuario;
