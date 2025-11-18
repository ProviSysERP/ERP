import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuario } from "../components/ObtenerUsuario.js";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verificarUsuario = async () => {
      const usuario = await obtenerUsuario();
      if (usuario) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        navigate("/login");
      }
      setLoading(false);
    };

    verificarUsuario();
  }, [navigate]);

  if (loading) return <div>Cargando...</div>;

  return isAuthenticated ? children : null;
}