import { use, useEffect, useState } from 'react';
import Header from '../components/Header.jsx'
import { obtenerUsuario } from '../components/ObtenerUsuario.js'
import { Container, CircularProgress } from '@mui/material';



export default function Chat() {

    const [usID, setUsId] = useState();
    const [hasChats, setHasChats] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [chats, setChats] = useState([]);

    const load = (usID) => {
        console.log('Cargando chats para el usuario ID:', usID);
        fetch(`http://localhost:3000/mensajes/${usID}`)
        .then((response) => {
            if (!response.ok) {
                console.log('Este usuario no tiene chats existentes.');
                setHasChats(false);
                return;
            }
            return response.json();
        })
        .then((data) => {
            setChats(data);
            console.log(data);
        }
        ).catch((error) => console.error('Error al obtener mensajes:', error))
        .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        setIsLoading(true);
        const usuario = obtenerUsuario();
        console.log(usuario);
        setUsId(usuario.id_user);
        setTimeout(load(usID), 2000);

    }, []);

    if (isLoading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );


}