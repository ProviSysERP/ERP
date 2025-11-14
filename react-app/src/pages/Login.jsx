import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from "@mui/material";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!formData.username || !formData.password) {
      setMensaje("Por favor, rellena todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { access_token, token_type } = data;

        // Guardar tokens
        localStorage.setItem("token", access_token);
        localStorage.setItem("token_type", token_type);

        setMensaje("¡Bienvenido!");
        navigate("/");
      } else {
        setMensaje("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
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
              Iniciar sesión
            </Typography>

            {mensaje && (
              <Alert
                severity={mensaje.includes("Bienvenido") ? "success" : "error"}
                sx={{ mb: 2 }}
              >
                {mensaje}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Nombre de usuario"
                name="username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.username}
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
                  "Entrar"
                )}
              </Button>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                ¿No tienes cuenta?{" "}
                <Button
                  variant="text"
                  sx={{ color: "#1976d2", textTransform: "none" }}
                  onClick={() => navigate("/registrar")}
                >
                  Regístrate
                </Button>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
