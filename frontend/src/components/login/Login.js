import { Link } from 'react-router-dom';
import Formulario from './formulario/Formulario';
import './login.css';

function Login() {
  return (
    <div class="container">
      <div class="login-box">
        <h2>Inicia Sesión</h2>
        <Formulario />
        <p>
          <Link to={'/register'}>¿No tienes una cuenta? Registrate Aquí</Link>
        </p>
      </div>
      <div class="image-section">
        <div class="overlay">
          <p>
            Que comience la función<br></br>Ingresa para reservar tu asiento
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
