import { useState } from "react";
import "../../login/login.css"

function Formulario({onFormComplete}) {
  const [nombre, setNombre] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !userName || !password) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }

    if (password.length < 8) {
      setMensaje("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:4000/api/usuarios/registrarUsuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: nombre,
            userName,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje(data.mensaje);
        onFormComplete(true); // Llama a la función de callback para indicar que el formulario se ha completado
      } else {
        setMensaje(data.mensaje);
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setMensaje("Hubo un error: "+ error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nombre">Nombre</label>
      <input
        type="text"
        name="nombre"
        id="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <label htmlFor="user">Usuario</label>
      <input
        type="text"
        name="user"
        id="user"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />

      <label htmlFor="contrasena">Contraseña</label>
      <input
        type="password"
        name="contrasena"
        id="contrasena"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Crear Cuenta</button>

      {mensaje && <p>{mensaje}</p>}
    
    </form>
  );
}

export default Formulario;
