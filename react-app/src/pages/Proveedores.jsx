import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pages/Proveedores.css";
import { Container, Typography, Box, CircularProgress, Alert, Button, Card, CardContent, CardMedia, Chip, TextField } from "@mui/material";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/proveedores")
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setProveedores(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.companyName.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (isLoading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Error al cargar proveedores: {error}</Alert>
      </Container>
    );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
        Catálogo de Proveedores
      </Typography>

      <Box sx={{ display: "flex", gap: 3 }}>
        {/*Columna de la izquierda*/}
        <Box sx={{ minWidth: 250 }}>
          <TextField
            fullWidth
            label="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ mb: 3 }}
          />
        </Box>

        {/*Panel de la derecha*/}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 3, flex: 1 }}>
          {proveedoresFiltrados.length > 0 ? (
            proveedoresFiltrados.map((p) => (
              <Card key={p.id_provider} sx={{ maxWidth: 350 }}>
                <CardMedia
                  sx={{ height: 200 }}
                  image={p.image || "https://via.placeholder.com/350x200?text=Proveedor"}
                  title={p.companyName}
                />
                <CardContent>
                  <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold" }}>
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
                          sx={{ textTransform: "capitalize", fontSize: "1rem" }}
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
            ))
          ) : (
            <Alert severity="info">No hay proveedores disponibles.</Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}