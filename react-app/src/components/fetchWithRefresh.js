export async function fetchWithRefresh(url, options = {}) {
  let token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No hay access token en localStorage");
    return { ok: false, error: "unauthorized" };
  }

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);
  console.log("💡 Petición inicial a", url, "status:", response.status);

  if (response.status === 401) {
    console.log("⚠️ Access token inválido o expirado, intentando refresh...");

    const refreshResponse = await fetch("http://localhost:3000/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!refreshResponse.ok) {
      console.log("❌ No se pudo refrescar el token. Cerrando sesión...");
      localStorage.removeItem("token");
      return { ok: false, error: "unauthorized" };
    }

    const data = await refreshResponse.json();
    console.log("✅ Token refrescado correctamente", data.access_token);
    localStorage.setItem("token", data.access_token);

    options.headers.Authorization = `Bearer ${data.access_token}`;
    response = await fetch(url, options);
    console.log("💡 Reintento de la request a", url, "status:", response.status);
  }

  return response;
}