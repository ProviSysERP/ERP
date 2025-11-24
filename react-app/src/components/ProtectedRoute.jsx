import { Navigate } from "react-router-dom";
import { useAuthContext } from "./authContext.jsx";

export default function ProtectedRoute({ children }) {
  const { idUser, loading } = useAuthContext();

  if (loading) return <div>Cargando...</div>;
  if (!idUser) return <Navigate to="/login" />; // <-- redirige si no hay id

  return children;
}