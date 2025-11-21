import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Alert, Button, CardMedia, CardContent, CardActions, Card, TextField } from '@mui/material';
import Header from '../components/Header.jsx';
import '../pages/Productos.css';
import { fetchWithRefresh } from "../components/fetchWithRefresh";


export default function Productos() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  

  useEffect(() => {
    console.log("Cargando productos...");
    setIsLoading(true);

    fetchWithRefresh("http://localhost:3000/productos")
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((jsonData) => {
        console.log("Datos recibidos:", jsonData);
        setProducts(jsonData);
        setError(null);
      })
      .catch((error) => {
        console.error("Error al cargar producto:", error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const productosFiltrados = products.filter((p) => {
    const coincideBusqueda = p.name.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === "" ||
      (p.category && p.category.toLowerCase() === categoriaSeleccionada.toLowerCase());
    return coincideBusqueda && coincideCategoria;
  });

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Header />
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
      )}

      <Box sx={{ display: "flex" }}>
        <Box className="productos-sidebar">
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Buscar producto
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
            Productos
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {productosFiltrados && productosFiltrados.length > 0 ? (
              productosFiltrados.map((product) => (
                <Card key={product.id_product} sx={{ maxWidth: 345, height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={(product.images && product.images.length && product.images[0]) || product.image || '/placeholder.jpg'}
                    title={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <strong>Precio:</strong> {product.price}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ mt: "auto"}}>
                    <Button size="small">Compartir</Button>
                    <Button
                      size="small"
                      component={Link}
                      to={`/producto/${product.id_product}`}
                    >
                      Más Info
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Alert severity="info">No hay productos disponibles</Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}