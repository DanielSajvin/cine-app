import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// import NotFound from "./pages/NotFound";
import Login from "./components/login/Login";
//import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Normales */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {/* Rutas de registro */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
