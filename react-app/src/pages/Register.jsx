import { useState } from "react";
import {
  Box,
  Container,
  Card,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    profile_picture: "",
    phone: "",
    email: "",
    notifications: false,
    address: 
      {
        street: "",
        city: "",
        state: "",
        postalcode: "",
        country: ""
      }
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["street", "city", "state", "postalcode", "country"].includes(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value
        }
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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

      setTimeout(() => navigate("/login"), 1500);

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
              Crear Cuenta
            </Typography>
            <Typography variant="body2" sx={{ color: "#555" }}>
              Únete y comienza tu viaje con nosotros
            </Typography>
          </Box>

          {mensaje && (
            <Alert
              severity={mensaje.includes("correctamente") ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {mensaje}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Nombre completo"
              name="name"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              label="Correo electrónico"
              name="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
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
              required
            />
            <TextField
              label="Número de teléfono"
              name="phone"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: "white" }} /> : "Registrarse"}
            </Button>
          </form>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Typography variant="body2" sx={{ color: "#555" }}>
              ¿Ya tienes cuenta?
            </Typography>
            <Button
              onClick={() => navigate("/login")}
              sx={{ color: "#1e3a8a", textTransform: "none" }}
            >
              Inicia sesión aquí
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}