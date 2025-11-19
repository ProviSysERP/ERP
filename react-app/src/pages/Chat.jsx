import { use, useEffect, useState } from 'react';
import Header from '../components/Header.jsx'
import { obtenerUsuario } from '../components/ObtenerUsuario.js'
import { Container, CircularProgress } from '@mui/material';



export default function Chat() {

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
            setHasChats(true);
            console.log(data);
        }
        ).catch((error) => console.error('Error al obtener mensajes:', error))
        .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {

        const usuario = await obtenerUsuario();
        console.log(usuario);

        load(usuario.id_user)
        };

        fetchData();
    }, []);

    if (isLoading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );

    if(!hasChats) {
        return (
            <Container sx={{ py: 4 }}>
                <Header/>
                <h2>No tienes chats existentes. ¡Crea uno!</h2>
            </Container>
        );
    }

    if(hasChats) {
        return (
            <Container sx={{ py: 4 }}>
                <Header/>
                <h2>Tus Chats</h2>
            </Container>
        );
    }

}