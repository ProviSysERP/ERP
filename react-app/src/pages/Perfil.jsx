import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Box
} from "@mui/material";

export default function Perfil() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(`Cargando perfil del usuario con ID ${id}...`);
    fetch(`http://localhost:3000/usuarios/${id}`)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Error al cargar el perfil: {error}</Alert>
      </Container>
    );

  if (!user)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Usuario no encontrado.</Alert>
      </Container>
    );

  return (
    <Container sx={{ py: 4 }}>
      <Button component={Link} to="/" variant="outlined" sx={{ mb: 3 }}>
        ← Volver
      </Button>

      <Card sx={{ maxWidth: 400, mx: "auto", p: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image={user.profile_picture || "https://via.placeholder.com/200"}
          alt={user.name}
          sx={{ borderRadius: 2 }}
        />
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {user.name}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            <strong>ID:</strong> {user.id_user}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            {user.provider || "No es de una empresa proveedora."}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}