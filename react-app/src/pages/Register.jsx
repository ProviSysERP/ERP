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
  CircularProgress,
  Grid,
  Divider,
  Paper,
  InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, MapPin, User, ImageIcon } from "lucide-react";

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
              py: 3,
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
              Crear Cuenta
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
              }}
            >
              Únete y comienza tu viaje con nosotros
            </Typography>
          </Box>

          <CardContent sx={{ p: 4 }}>
            {mensaje && (
              <Alert
                severity={mensaje.includes("correctamente") ? "success" : "error"}
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
              {/* Información Personal */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <User size={20} style={{ color: "#667eea" }} />
                Información Personal
              </Typography>

              <TextField
                label="Nombre completo"
                name="name"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={18} style={{ color: "#667eea", marginRight: "8px" }} />
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
                label="Correo electrónico"
                name="email"
                type="email"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
                variant="outlined"
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
                required
                variant="outlined"
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

              <TextField
                label="Número de teléfono"
                name="phone"
                fullWidth
                margin="normal"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone size={18} style={{ color: "#667eea", marginRight: "8px" }} />
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
                label="URL de foto de perfil"
                name="profile_picture"
                fullWidth
                margin="normal"
                value={formData.profile_picture}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ImageIcon size={18} style={{ color: "#667eea", marginRight: "8px" }} />
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

              {/* Divider */}
              <Divider sx={{ my: 3 }} />

              {/* Dirección */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: "#1a1a1a",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <MapPin size={20} style={{ color: "#667eea" }} />
                Dirección
              </Typography>

              <TextField
                label="Calle"
                name="street"
                fullWidth
                margin="normal"
                value={formData.address.street}
                onChange={handleChange}
                variant="outlined"
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

              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ciudad"
                    name="city"
                    fullWidth
                    value={formData.address.city}
                    onChange={handleChange}
                    variant="outlined"
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Provincia / Estado"
                    name="state"
                    fullWidth
                    value={formData.address.state}
                    onChange={handleChange}
                    variant="outlined"
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
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Código Postal"
                    name="postalcode"
                    fullWidth
                    value={formData.address.postalcode}
                    onChange={handleChange}
                    variant="outlined"
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="País"
                    name="country"
                    fullWidth
                    value={formData.address.country}
                    onChange={handleChange}
                    variant="outlined"
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
                </Grid>
              </Grid>

              {/* Divider */}
              <Divider sx={{ my: 3 }} />

              {/* Checkbox */}
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: "#f8f9ff",
                  border: "1px solid #e0e7ff",
                  borderRadius: 2,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="notifications"
                      checked={formData.notifications}
                      onChange={handleChange}
                      sx={{
                        color: "#667eea",
                        "&.Mui-checked": {
                          color: "#667eea",
                        },
                      }}
                    />
                  }
                  label="Quiero recibir notificaciones y actualizaciones"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "0.95rem",
                      color: "#333",
                    },
                  }}
                />
              </Paper>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  mt: 2,
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
                  "Registrarse"
                )}
              </Button>

              {/* Login Link */}
              <Box sx={{ textAlign: "center", pt: 2 }}>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  ¿Ya tienes cuenta?
                </Typography>
                <Button
                  onClick={() => navigate("/login")}
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
                  Inicia sesión aquí
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}