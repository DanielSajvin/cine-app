import { useState} from "react";
import { Link } from "react-router-dom";
import Formulario from "./formulario/Formulario";
import "../login/login.css";

function Register() {
  const [showLoginLink, setShowLoginLink] = useState(false);

  return (
    <main>
      <div className="container">
        <div className="image-section">
          <div className="overlay">
            <p>
              Que comience la función
              <br />
              Ingresa para reservar tu asiento
            </p>
          </div>
        </div>
        <div className="login-box">
          <h2>Regístrate Aquí</h2>
          <Formulario
            onFormComplete={(isComplete) => setShowLoginLink(isComplete)}
          />

          {showLoginLink && (
            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
                animation: "fadeIn 0.5s ease-in",
              }}
            >
              <p>¡Registro completo! Ahora puedes:</p>
              <Link to={"/login"} className="login-link">
              Iniciar sesión Aquí</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Register;
