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
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchWithRefresh } from "../components/fetchWithRefresh";


export default function ChatApp() {
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [otherUsers, setOtherUsers] = useState({});
  const [iDusuario, setIdUsuario] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const messagesEndRef = useRef(null);

  const openMenu = Boolean(anchorEl);
  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const loadChats = async (usID) => {
    try {
      const response = await fetchWithRefresh(`http://localhost:3000/mensajes/${usID}`);
      if (!response.ok) {
        setChats([]);
        return;
      }
      const data = await response.json();
      setChats(data);
    } catch (err) {
      console.error(err);
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async (user) => {
    handleCloseMenu();
    const existing = chats.find(
      (c) =>
        (c.user1 === iDusuario && c.user2 === user.id_user) ||
        (c.user2 === iDusuario && c.user1 === user.id_user)
    );
    if (existing) return setSelectedChat(existing);

    // Create new chat
    try {
      const res = await fetchWithRefresh('http://localhost:3000/mensajes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user1: iDusuario, user2: user.id_user }),
      });
      const newChat = await res.json();
      setChats((prev) => [...prev, newChat]);
      setSelectedChat(newChat);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await fetchWithRefresh(`http://localhost:3000/mensajes/${chatId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar el chat');
        setChats((prev) => prev.filter((chat) => chat.id_conversation !== chatId));
        setSelectedChat(null);
    } catch (err) {
      console.error(err);
    }
    };

  useEffect(() => {
    const fetchUser = async () => {
      const usuario = await obtenerUsuario();
      setIdUsuario(usuario.id_user);
      await loadChats(usuario.id_user);
      const res = await fetchWithRefresh('http://localhost:3000/usuarios');
      const users = await res.json();
      setAllUsers(users.filter(u => u.id_user !== usuario.id_user));
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!iDusuario || chats.length === 0) return;
    chats.forEach((chat) => {
      const otherId = chat.user1 === iDusuario ? chat.user2 : chat.user1;
      if (!otherUsers[chat.id_conversation]) {
        fetchWithRefresh(`http://localhost:3000/usuarios/${otherId}`)
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

  const handleSendMessage = async () => {
  if (!messageInput.trim() || !selectedChat) return;

  const newMessage = {
    from_user: iDusuario,
    content: messageInput,
  };

  try {
    const response = await fetchWithRefresh(
      `http://localhost:3000/mensajes/newMessage/${selectedChat.id_conversation}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      }
    );

    if (!response.ok) throw new Error('Error al enviar el mensaje');

    const updatedChat = await response.json();

    setChats((prev) =>
      prev.map((chat) =>
        chat.id_conversation === selectedChat.id_conversation
          ? updatedChat
          : chat
      )
    );

    setSelectedChat(updatedChat);
    setMessageInput('');
  } catch (err) {
    console.error(err);
  }
};

  if (chats.length === 0)
    return (
      <Container sx={{ py: 4 }}>
        <Header />
        <Typography variant="h6">
          No tienes chats existentes. ¡Crea uno!
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant= 'outlined'
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ m: 1, position: 'fixed', bottom: 16, right: 8, outlineWidth: "10px", outlineColor: "#1976d2" }}
        >
          Nuevo Chat
        </Button>
            <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            >
            {allUsers.map((user) => (
                <MenuItem
                key={user.id_user}
                onClick={() => {
                handleNewChat(user);
                setAnchorEl(null);
            }}
                >
                <ListItemAvatar>
                <Avatar src={user.profile_picture || ''} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                </MenuItem>
            ))}
        </Menu>
      </Container>
    );

  return (
    <Box sx={{ display: 'flex'}}>
      {/* Sidebar */}
      <Paper
        sx={{
          width: 360,
          flexShrink: 0,
          borderRight: '1px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: "100vh",
          top: 0,
          left: 0,
          minWidth: 360,
        }}
      >
        <Header />
        <List sx={{ flex: 32, overflowY: 'auto' }}>
          {chats.map((chat) => {
            const otherUser = otherUsers[chat.id_conversation];
            return (
              <ListItem
                button
                key={chat.id_conversation}
                selected={selectedChat?.id_conversation === chat.id_conversation}
                onClick={() =>
                  setSelectedChat(chats.find((c) => c.id_conversation === chat.id_conversation))
                }
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
          height: '91.2vh',
          position: "fixed",
          bottom: 0,
          width: "1000px"
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
              {(selectedChat.messages || []).map((msg, idx) => (
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
                      bgcolor: msg.from_user === iDusuario ? '#0099d1ff' : '#ffffffff',
                    }}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', textAlign: 'right' }}
                    >
                      {new Date(msg.createdAt).toLocaleString()}
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
              Ningún chat seleccionado.
            </Typography>
          </Box>
        )}
      </Box>

    <Button sx={{
        position: 'fixed',
        bottom: 80,
        right: 10,
        outlineWidth: "10px",
    }} 
    variant="outlined" startIcon={<DeleteIcon />} onClick={() => {
        const confirmed = window.confirm("¿Seguro que quieres borrar este chat?");
        if (confirmed) deleteChat(selectedChat.id_conversation);
    }}
    >
        Borrar Chat</Button>

      <Button
          startIcon={<AddIcon />}
          variant= 'outlined'
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ m: 1, position: 'fixed', bottom: 16, right: 8, outlineWidth: "10px", outlineColor: "#1976d2" }}
        >
          Nuevo Chat
        </Button>

        <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={() => setAnchorEl(null)}
    >
    {allUsers.map((user) => (
        <MenuItem
        key={user.id_user}
        onClick={() => {
        handleNewChat(user);
        setAnchorEl(null);
    }}
        >
        <ListItemAvatar>
            <Avatar src={user.profile_picture || ''} />
        </ListItemAvatar>
        <ListItemText primary={user.name} />
        </MenuItem>
    ))}
</Menu>
    </Box>
  );
}
