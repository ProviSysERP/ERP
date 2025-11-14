import { useState } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profile_picture: "",
    password: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Manejo de inputs ---
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- Enviar formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    try {
      const r = await fetch("http://localhost:3000/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await r.json();

      if (!r.ok) {
        setMensaje(data.error || "Error al registrarse");
        setLoading(false);
        return;
      }

      setMensaje("Usuario creado correctamente ✔");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err);
      setMensaje("Error al conectar con el servidor");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #e3f2fd, #f5f5f5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            p: 3,
            boxShadow: 4,
            borderRadius: 3,
            backgroundColor: "white",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              sx={{ mb: 3, fontWeight: "bold" }}
            >
              Crear cuenta
            </Typography>

            {mensaje && (
              <Alert
                severity={
                  mensaje.includes("correctamente") ? "success" : "error"
                }
                sx={{ mb: 2 }}
              >
                {mensaje}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Nombre"
                name="name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />

              <TextField
                label="URL de foto de perfil"
                name="profile_picture"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.profile_picture}
                onChange={handleChange}
              />

              <TextField
                label="Contraseña"
                name="password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2, py: 1 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Registrarse"
                )}
              </Button>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                ¿Ya tienes cuenta?{" "}
                <Button
                  variant="text"
                  sx={{ color: "#1976d2", textTransform: "none" }}
                  onClick={() => navigate("/login")}
                >
                  Inicia sesión
                </Button>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}