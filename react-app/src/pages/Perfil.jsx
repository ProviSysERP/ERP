import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {Container,Typography,Card,CardContent,CardMedia,Button,CircularProgress,Alert,Chip,Box} from "@mui/material";
import Header from '../components/Header.jsx'

export default function Perfil() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const eliminarUsuario = async (userId) => {
    try {
      const confirmacion = window.confirm("¿Estás seguro de que quieres eliminar este usuario?");
      if (!confirmacion) return;

      const response = await fetch(`http://localhost:3000/usuarios/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error al eliminar el usuario (HTTP ${response.status})`);
      }

      alert("Usuario eliminado correctamente ✅");
      navigate("/contactos");
    } catch (err) {
      console.error("Error al eliminar el usuario:", err);
      alert("Hubo un error al eliminar el usuario.");
    }
  };

  const pullProviders = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3000/proveedores/porUser/${userId}`);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      console.log("Datos del proveedor obtenidos:", data);
      return data;
    } catch (err) {
      console.error("Error al obtener proveedor:", err);
      return null;
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3000/usuarios/${id}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setError(null);
        if (data.provider === true) {
          pullProviders(data.id_user).then((providerData) => {
            if (!providerData) {
              setError("Error al cargar datos del proveedor.");
              return;
            }
            setProvider(providerData);
          });
        }
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
      <Button component={Link} to="/contactos" variant="outlined" sx={{ mb: 3 }}>
        ← Volver
      </Button>

      <Button
        variant="contained"
        color="error"
        sx={{ mb: 3, ml: 2 }}
        onClick={() => eliminarUsuario(id)}
      >
        Eliminar Usuario
      </Button>

    <Box
  sx={{
    display: "flex",
    flexDirection: provider ? "row" : "column",
    justifyContent: provider ? "space-between" : "center",
    alignItems: "center",
    gap: 0,
    mt: 4,
    width: "100%"
  }}
>
      <Card sx={{ maxWidth: 400, minWidth: 400, mx: "auto", p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CardMedia
          component="img"
          image={user.profile_picture || "https://via.placeholder.com/200"}
          alt={user.name}
          sx={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            objectFit: "cover",
            mb: 2
          }}
        />
        <CardContent sx={{ width: "100%", textAlign: "center" }}>
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
            {user.provider
              ? "Este usuario pertenece a una proveedora."
              : "No es de una empresa proveedora."}
          </Typography>
        </CardContent>
      </Card>

{user.provider === true && provider && (
  <Card sx={{ mt: 4, p: 2 }}>
    <CardContent>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
        Pertenece a esta empresa proveedora
      </Typography>

      <Box
        sx={{
        }}
      >
      {(Array.isArray(provider) ? provider : [provider]).map((p) => (
        <Card key={p.id_provider} sx={{ maxWidth: 350, mx: "auto" }}>
          <CardMedia
            sx={{ height: 200 }}
            image={p.image || "https://via.placeholder.com/350x200?text=Proveedor"}
            title={p.companyName}
          />

          <CardContent>
            <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>
              {p.companyName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                gap: 0.5,
                my: 1
              }}
            >
              {Array.isArray(p.categories) &&
                p.categories.map((cat, i) => (
                  <Chip
                    key={i}
                    label={cat}
                    size="small"
                    color="primary"
                    sx={{ textTransform: "capitalize" }}
                  />
                ))}
            </Box>
          </CardContent>

          <Box sx={{ p: 2, pt: 0, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              component={Link}
              to={`/proveedor/${p.id_provider}`}
            >
              Más info
            </Button>
          </Box>
        </Card>
      ))}
    </Box>
    </CardContent>
  </Card>
  
)}
</Box>
    </Container>
  );
}