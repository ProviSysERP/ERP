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
  InputAdornment,
  Paper,
} from "@mui/material";
import { Mail, Lock } from "lucide-react";

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
          email: formData.username,
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
        navigate("/home");
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
        width: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            overflow: "hidden",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              py: 4,
              px: 3,
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "white",
                mb: 1,
              }}
            >
              Bienvenido de Vuelta
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              Inicia sesión para acceder a tu cuenta
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {mensaje && (
              <Alert
                severity={mensaje.includes("Bienvenido") ? "success" : "error"}
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-message": {
                    fontSize: "0.95rem",
                  },
                }}
              >
                {mensaje}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                label="Correo electrónico"
                name="username"
                fullWidth
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} style={{ color: "#667eea", marginRight: "8px" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.1)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                    },
                  },
                }}
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
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} style={{ color: "#667eea", marginRight: "8px" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.1)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 3,
                  mb: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 2,
                  textTransform: "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 20px rgba(102, 126, 234, 0.3)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(135deg, #ccc 0%, #999 100%)",
                    boxShadow: "none",
                    transform: "none",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Inicia Sesión"
                )}
              </Button>

              <Box sx={{ textAlign: "center", pt: 1 }}>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  ¿No tienes cuenta?
                </Typography>
                <Button
                  onClick={() => navigate("/registrar")}
                  sx={{
                    color: "#667eea",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      backgroundColor: "rgba(102, 126, 234, 0.08)",
                    },
                  }}
                >
                  Regístrate aquí
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
