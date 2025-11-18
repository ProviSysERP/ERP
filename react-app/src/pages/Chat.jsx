import { useEffect } from 'react';
import Header from '../components/Header.jsx'
import { obtenerUsuario } from '../components/ObtenerUsuario.js'



export default function Chat() {

    const usuario = obtenerUsuario();
    const [isLoading, setIsLoading] = useState(true);
    const usID = usuario.id_user;

    useEffect(() => {
        setIsLoading(true);
        
    }, []);



}