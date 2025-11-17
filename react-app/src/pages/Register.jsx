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
  Checkbox,
  FormControlLabel,
  CircularProgress
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
        background: "linear-gradient(to bottom right, #e3f2fd, #f5f5f5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container maxWidth="xs">
        <Card sx={{ p: 3, boxShadow: 4, borderRadius: 3, backgroundColor: "white" }}>
          <CardContent>
            <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: "bold" }}>
              Crear cuenta
            </Typography>

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
                label="Nombre"
                name="name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
              />

              <TextField
                label="Contraseña"
                name="password"
                type="password"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
              />

              <TextField
                label="URL de foto de perfil"
                name="profile_picture"
                fullWidth
                margin="normal"
                value={formData.profile_picture}
                onChange={handleChange}
              />

              <TextField
                label="Número de teléfono"
                name="phone"
                fullWidth
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
              />

              <TextField
                label="Correo electrónico"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />

              {/* DIRECCIÓN */}
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                Dirección
              </Typography>

              <TextField
                label="Calle"
                name="street"
                fullWidth
                margin="normal"
                value={formData.address.street}
                onChange={handleChange}
              />

              <TextField
                label="Ciudad"
                name="city"
                fullWidth
                margin="normal"
                value={formData.address.city}
                onChange={handleChange}
              />

              <TextField
                label="Provincia / Estado"
                name="state"
                fullWidth
                margin="normal"
                value={formData.address.state}
                onChange={handleChange}
              />

              <TextField
                label="Código Postal"
                name="postalcode"
                type="number"
                fullWidth
                margin="normal"
                value={formData.address.postalcode}
                onChange={handleChange}
              />

              <TextField
                label="País"
                name="country"
                fullWidth
                margin="normal"
                value={formData.address.country}
                onChange={handleChange}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    name="notifications"
                    checked={formData.notifications}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Quiero recibir notificaciones"
                sx={{ mt: 1 }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ mt: 2, py: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : "Registrarse"}
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                ¿Ya tienes cuenta?{" "}
                <Button sx={{ textTransform: "none" }} onClick={() => navigate("/login")}>
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