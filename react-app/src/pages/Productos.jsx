import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Alert, Button, CardMedia, CardContent, CardActions, Card  }  from '@mui/material';

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Cargando productos...");
    setIsLoading(true);

    fetch("http://localhost:3000/productos")
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

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }
    return (
        <Container sx={{ py: 4 }}>
        {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
            Error: {error}
            </Alert>
        )}

        <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
            Productos
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {products && products.length > 0 ? (
            products.map((product) => (
                <Card key={product.id_product} sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image={(product.images && product.images.length && product.images[0]) || product.image || '/placeholder.jpg'}
                    title={product.name}
                />
                <CardContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    <strong>ID:</strong> {product.id_product}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <strong>Precio:</strong> {product.price}
                    </Typography>
                </CardContent>
                <CardActions>
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
        </Container>
    );
}
