function Formulario() {
  return (
    <form>
      <label for="usuario">Usuario</label>
      <input type="text" name="usuario" id="usuario" required />

      <label for="contrasena">Contraseña</label>
      <input type="password" name="contrasena" id="contrasena" required />
      <button type="submit">Acceder</button>
    </form>
  );
}

export default Formulario;
