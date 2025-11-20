export async function fetchWithRefresh(url, options = {}) {
  let token = localStorage.getItem("token");

  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, options);

  if (response.status === 401) {

    const refreshResponse = await fetch("http://localhost:3000/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      const newToken = data.access_token;
      localStorage.setItem("token", newToken);


      options.headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, options);
    } else {
      console.warn("❌ No se pudo refrescar el token. Cerrando sesión…");
      localStorage.removeItem("token");
      return { error: "unauthorized" };
    }
  }

  return response;
}