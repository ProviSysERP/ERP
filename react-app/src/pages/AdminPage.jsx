import { useEffect, useState } from "react";
import { useAuth } from "../components/useAuth";
import { useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../components/fetchWithRefresh";

export default function AdminPage() {
    const { idUser, loading } = useAuth();
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        if (!idUser) {
            navigate("/home");
            return;
        }

        
        const checkAdmin = async () => {
            const res = await fetchWithRefresh(`http://localhost:3000/usuarios/${idUser}/admin`);
            const data = await res.json();

            if (!data.admin) {
                navigate ("/home");
            } else {
                setIsAdmin(true);
            }
        };

        checkAdmin();
    }, [loading, idUser]);


    if (loading || isAdmin === null) return <p>Cargando...</p>;

    return (
        <div>
            <h1>Panel de administrador</h1>
            <p>Bienvenido administrador ✅</p>
        </div>
    );
}
