import { useState, useEffect } from "react";

function Formulario({ onFormComplete }) {
  const [formData, setFormData] = useState({
    nombre: "",
    user: "",
    contrasena: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Verifica si todos los campos tienen contenido
  useEffect(() => {
    const isComplete = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    onFormComplete(isComplete);
  }, [formData, onFormComplete]);

  return (
    <form>
      <label htmlFor="nombre">Nombre</label>
      <input
        type="text"
        name="nombre"
        id="nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      <label htmlFor="user">Usuario</label>
      <input
        type="text"
        name="user"
        id="user"
        value={formData.user}
        onChange={handleChange}
        required
      />

      <label htmlFor="contrasena">Contraseña</label>
      <input
        type="password"
        name="contrasena"
        id="contrasena"
        value={formData.contrasena}
        onChange={handleChange}
        required
      />

      <button type="submit">Crear Cuenta</button>
    </form>
  );
}

export default Formulario;
