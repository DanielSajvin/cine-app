import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export function RutasProtegidas({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await api.get("/ruta-protegida"); // Puedes crear una ruta simple de verificación
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      verifyToken();
    }
  }, [navigate]);

  return children;
}
