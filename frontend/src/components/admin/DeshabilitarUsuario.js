import styles from "./styles/DeshabilitarUsuario.module.css";
import Header from "../header/Header";
import Footer from "../header/Footer";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const DeshabilitarUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [users, setUsers] = useState([]);

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
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:4000/api/usuarios/listarUsuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data); // O el nombre del estado donde guardas los usuarios
      })
      .catch((error) => {
        console.error("Error al obtener la lista de usuarios:", error.message);
      });
  }, []);

  const deshabilitarUsuario = (id) => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:4000/api/usuarios/deshabilitarUsuario/${id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al deshabilitar usuario");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data.message);
        // Refrescar la lista de usuarios
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, state: 0 } : user
          )
        );
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  };

  return (
    <div className={styles.appContainer}>
      <Header usuario={usuario} tipoUsuario={tipoUsuario} />
      <div className={styles.containerLisarUsuario}>
        <h1>Listado de Usuarios</h1>
        <div className={styles.userList}>
          {users.map((user) => (
            <div className={styles.userCard} key={user.id}>
              <div className={styles.userInfo}>
                <h3>{user.name}</h3>
                <p>{user.userName}</p>
                <p className={styles.userRole}>{user.type}</p>
                <span
                  className={`status ${
                    user.state === 1 ? "active" : "inactive"
                  }`}
                >
                  {user.state === 1 ? "Activo" : "Inactivo"}
                </span>
              </div>
              <button className={styles.disableBtn} disabled={user.state !== 1} onClick={() => deshabilitarUsuario(user.id)}>
                {user.state === 1 ? "Deshabilitar" : "Deshabilitado"}
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
