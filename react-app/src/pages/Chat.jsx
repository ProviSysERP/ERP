import { useEffect, useState, useRef } from 'react';
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
  TextField,
  IconButton,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function ChatApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [otherUsers, setOtherUsers] = useState({});
  const [iDusuario, setIdUsuario] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const loadChats = (usID) => {
    fetch(`http://localhost:3000/mensajes/${usID}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => setChats(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const usuario = await obtenerUsuario();
      setIdUsuario(usuario.id_user);
      loadChats(usuario.id_user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!iDusuario || chats.length === 0) return;
    chats.forEach((chat) => {
      const otherId = chat.user1 === iDusuario ? chat.user2 : chat.user1;
      if (!otherUsers[chat.id_conversation]) {
        fetch(`http://localhost:3000/usuarios/${otherId}`)
          .then((res) => res.json())
          .then((data) =>
            setOtherUsers((prev) => ({
              ...prev,
              [chat.id_conversation]: data,
            }))
          )
          .catch((err) => console.error(err));
      }
    });
  }, [iDusuario, chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;
    const newMessage = {
      from_user: iDusuario,
      content: messageInput,
      timestamp: new Date().toISOString(),
    };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id_conversation === selectedChat.id_conversation
          ? { ...chat, mensajes: [...(chat.mensajes || []), newMessage] }
          : chat
      )
    );
    setMessageInput('');
  };

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
        sx={{
          width: 360,
          flexShrink: 0,
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          top: 0,
          left: 0,
          minWidth: 360,
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
                    src={otherUser?.profile_picture || ''}
                    alt={otherUser?.name || 'Usuario'}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={otherUser?.name || 'Cargando...'}
                  secondary={
                    chat.mensajes?.[chat.mensajes.length - 1]?.content || ''
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>

      {/* Chat window */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 21,
          backgroundColor: '#f0f0f0',
        }}
      >
        {selectedChat ? (
          <>
            {/* Chat header */}
            <Paper elevation={1} sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
              <Typography variant="h6">
                {otherUsers[selectedChat.id_conversation]?.name || 'Cargando...'}
              </Typography>
            </Paper>

            {/* Messages */}
            <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
              {(selectedChat.mensajes || []).map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    justifyContent:
                      msg.from_user === iDusuario ? 'flex-end' : 'flex-start',
                    mb: 1,
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: msg.from_user === iDusuario ? '#dcf8c6' : '#fff',
                    }}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', textAlign: 'right' }}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box
              sx={{
                display: 'flex',
                p: 1,
                borderTop: '1px solid #ddd',
                bgcolor: '#fff',
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Escribe un mensaje..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton color="primary" onClick={handleSendMessage}>
                <SendIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Selecciona un chat para comenzar
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
