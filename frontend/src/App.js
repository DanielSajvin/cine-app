import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
// import NotFound from "./pages/NotFound";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import Home from "./components/home/Home";
import Formulario from "./components/login/formulario/Formulario";
import RutaPrivada from "./components/ruta-privada/RutaPrivada";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Formulario />} />
        <Route
          path="/home"
          element={
            <RutaPrivada>
              <Home />
            </RutaPrivada>
          }
        />

        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

{
  /* 
  <Router>
        <Routes>
       
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
    
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>*/
}
