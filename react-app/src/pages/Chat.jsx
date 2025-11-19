import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import { obtenerUsuario } from '../components/ObtenerUsuario.js';
import {
  Container,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Paper,
  Box,
} from '@mui/material';

export default function ChatSelector() {
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [otherUsers, setOtherUsers] = useState({});
  const [iDusuario, setIdUsuario] = useState();
  const [selectedChat, setSelectedChat] = useState(null);

  const loadChats = (usID) => {
    fetch(`http://localhost:3000/mensajes/${usID}`)
      .then((response) => {
        if (!response.ok) {
          console.log('Este usuario no tiene chats existentes.');
          setChats([]);
          return;
        }
        return response.json();
      })
      .then((data) => {
        setChats(data);
      })
      .catch((error) => console.error('Error al obtener mensajes:', error))
      .finally(() => setIsLoading(false));
  };

  // Get logged-in user
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const usuario = await obtenerUsuario();
      setIdUsuario(usuario.id_user);
      loadChats(usuario.id_user);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!iDusuario || chats.length === 0) return;

    chats.forEach((chat) => {
      const otherId = chat.user1 === iDusuario ? chat.user2 : chat.user1;

      if (!otherUsers[chat.id_conversation]) {
        fetch(`http://localhost:3000/usuarios/${otherId}`)
          .then((res) => {
            if (!res.ok) throw new Error('Usuario no encontrado');
            return res.json();
          })
          .then((data) => {
            setOtherUsers((prev) => ({
              ...prev,
              [chat.id_conversation]: data,
            }));
          })
          .catch((err) =>
            console.error('Error al obtener el otro usuario:', err)
          );
      }
    });
  }, [iDusuario, chats, otherUsers]);

  if (isLoading)
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );

  if (chats.length === 0)
    return (
      <Container sx={{ py: 4 }}>
        <Header />
        <Typography variant="h6">
          No tienes chats existentes. ¡Crea uno!
        </Typography>
      </Container>
    );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: 360,
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          minHeight: '100vh',
        }}
      >
        <Header />
        <List sx={{ flex: 1, overflowY: 'auto' }}>
          {chats.map((chat) => {
            const otherUser = otherUsers[chat.id_conversation];

            return (
              <ListItem
                button
                key={chat.id_conversation}
                selected={selectedChat?.id_conversation === chat.id_conversation}
                onClick={() => setSelectedChat(chat)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={otherUser?.profilePicture || ''}
                    alt={otherUser?.name || 'Usuario'}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={otherUser?.name || 'Cargando...'}
                  secondary={chat.lastMessage || ''}
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {selectedChat ? (
          <Typography variant="h6">
            Has seleccionado el chat con{' '}
            {otherUsers[selectedChat.id_conversation]?.name || 'Cargando...'}
          </Typography>
        ) : (
          <Typography variant="h6" color="text.secondary">
            Selecciona un chat para comenzar
          </Typography>
        )}
      </Box>
    </Box>
  );
}
