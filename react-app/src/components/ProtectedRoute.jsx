import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Función para verificar token y obtener usuario
const obtenerUsuario = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch("http://localhost:3000/usuarios/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

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
        navigate("/login");
      }
      setLoading(false);
    };

    verificarUsuario();
  }, [navigate]);

  if (loading) return <div>Cargando...</div>;

  return isAuthenticated ? children : null;
}