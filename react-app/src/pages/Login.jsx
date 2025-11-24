import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Mail, Lock } from "lucide-react";
import { useAuthContext } from "../components/authContext";


export default function Login() {
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (!formData.email || !formData.password) {
      setMensaje("Por favor, rellena todos los campos");
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.ok) {
      setMensaje("¡Bienvenido!");
      navigate("/home");
    } else {
      setMensaje(result.error);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f4f6fc",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ borderRadius: 2, p: 3, boxShadow: 1, backgroundColor: "#ffffff" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1e3a8a" }}>
              Bienvenido de vuelta
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Inicia sesión para acceder a tu cuenta
            </Typography>
          </Box>

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
              label="Correo electrónico"
              name="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              required
            />
            <TextField
              label="Contraseña"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Inicia Sesión"}
            </Button>
          </form>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#555" }}>
              ¿No tienes cuenta?
            </Typography>
            <Button
              onClick={() => navigate("/registrar")}
              sx={{ color: "#1e3a8a", textTransform: "none" }}
            >
              Regístrate aquí
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
