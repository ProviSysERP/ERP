import { useState, useEffect } from "react";
import { fetchWithRefresh } from "./fetchWithRefresh";
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [idUser, setIdUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarSesion = async () => {
      setLoading(true);
      try {
        const res = await fetchWithRefresh("http://localhost:3000/usuarios/me");
        if (!res.ok) {
                console.log("❌ No se pudo verificar sesión, cerrando sesión");
          logout();
          return;
        }
        const data = await res.json();
            console.log("✅ Usuario obtenido:", data);
        setIdUser(data.id_user);
      } catch (err) {
        console.error("💥 Error verificando sesión:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) return { ok: false, error: "Credenciales incorrectas" };

      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      const meRes = await fetchWithRefresh("http://localhost:3000/usuarios/me");
      if (!meRes.ok) return { ok: false, error: "Error al obtener usuario" };

      const usuario = await meRes.json();
      setIdUser(usuario.id_user);

      return { ok: true };
    } catch (err) {
      console.error("Error en login:", err);
      return { ok: false, error: "Error del servidor" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIdUser(null);
    navigate("/login");
  };

  return { idUser, loading, login, logout };
}