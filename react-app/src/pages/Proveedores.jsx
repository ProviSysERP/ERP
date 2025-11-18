import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pages/Proveedores.css";
import Header from '../components/Header.jsx'
import { Typography, Box, Alert, Button, Card, CardContent, CardMedia, Chip, TextField, Container } from "@mui/material";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/proveedores")
      .then((res) => res.json())
      .then((data) => setProveedores(data))
      .catch((err) => console.error("Error cargando proveedores:", err));
  }, []);

  const proveedoresFiltrados = proveedores.filter((p) => {
    const coincideBusqueda = p.companyName.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === "" ||
      p.categories.some((cat) => cat.toLowerCase() === categoriaSeleccionada.toLowerCase());
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <Container>
     <Header/> 
      <Box sx={{ display: "flex" }}>
        <Box className="proveedores-sidebar">
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Buscar proveedor
          </Typography>

          <TextField
            fullWidth
            label="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Categorías
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {["Alimentos", "Bebidas", "Otros"].map((cat) => (
              <Button
                key={cat}
                variant={categoriaSeleccionada === cat.toLowerCase() ? "contained" : "outlined"}
                onClick={() =>
                  setCategoriaSeleccionada(
                    categoriaSeleccionada === cat.toLowerCase() ? "" : cat.toLowerCase()
                  )
                }
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1, ml: "260px", p: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
            Catálogo de Proveedores
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
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
                    <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0.5, my: 1 }}>
                      {Array.isArray(p.categories) &&
                        p.categories.map((cat, i) => (
                          <Chip
                            key={i}
                            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                            size="small"
                            color="primary"
                            sx={{ textTransform: "capitalize", fontSize: "1rem" }}
                          />
                        ))}
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" component={Link} to={`/proveedor/${p.id_provider}`}>
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
      </Box>
</Container>
  );
}