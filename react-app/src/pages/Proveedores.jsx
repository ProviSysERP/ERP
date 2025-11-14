import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../pages/Proveedores.css";
import { Box, Typography, Card, CardContent, CardActions, Button, TextField, List, ListItem, ListItemButton } from "@mui/material";

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
    const coincideBusqueda =
      p.companyName.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === "" ||
      p.categories.includes(categoriaSeleccionada.toLowerCase());

    return coincideBusqueda && coincideCategoria;
  });

  return (
    <Box className="proveedores-layout">
      {/*Panel de la izquierda*/}
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

        <List>
          {["Alimento", "Bebida", "Otros"].map((cat) => (
            <ListItem key={cat} disablePadding>
              <ListItemButton
                selected={categoriaSeleccionada === cat.toLowerCase()}
                onClick={() =>
                  setCategoriaSeleccionada(
                    categoriaSeleccionada === cat.toLowerCase()
                      ? ""
                      : cat.toLowerCase()
                  )
                }
              >
                {cat}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Lista de proveedores
        </Typography>

        <List className="proveedores-lista">
          {proveedores.map((p) => (
            <ListItem key={p.id_provider} disablePadding>
              <ListItemButton>
                {p.companyName}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/*Panel de la derecha*/}
      <Box className="proveedores-resultados">
        <Typography variant="h4" className="proveedores-title">
          Proveedores
        </Typography>

        <Box className="proveedores-grid">
          {proveedoresFiltrados.map((prov) => (
            <Card key={prov.id_provider} className="proveedor-card">
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                  {prov.companyName}
                </Typography>

                <Box className="categorias-box">
                  {prov.categories.map((c, index) => (
                    <span key={index} className="categoria-tag">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </span>
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <Button
                  component={Link}
                  to={`/proveedor/${prov.id_provider}`}
                  variant="contained"
                  className="proveedor-btn"
                >
                  Más Info
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}