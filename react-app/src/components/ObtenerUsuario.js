export const obtenerUsuario = async () => {
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
    console.error("Error obteniendo usuario:", err);
    return null;
  }
};