import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Alert, Button, CardMedia, CardContent, CardActions, Card  }  from '@mui/material';

export default function Novedades() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Cargando usuarios...");
    setIsLoading(true);

    fetch("http://localhost:3000/usuarios")
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        console.log("Datos recibidos:", jsonData);
        setUsers(jsonData);
        setError(null);
      })
      .catch((error) => {
        console.error("Error al cargar usuarios:", error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Usuarios desde Base de Datos
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {users && users.length > 0 ? (
          users.map((user) => (
            <Card key={user.id_user} sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 200 }}
                image={user.profile_picture}
                title={user.name}
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  <strong>ID:</strong> {user.id_user}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  {user.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <strong>Email:</strong> {user.email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Compartir</Button>
                <Button
                  size="small"
                  component={Link}
                  to={`/perfil/${user.id_user}`}
                >
                  Más Info
                </Button>
              </CardActions>
            </Card>
          ))
        ) : (
          <Alert severity="info">No hay usuarios disponibles</Alert>
        )}
      </Box>
    </Container>
  );
}