import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './Proveedor.css';
import { Container, Typography, Card, CardMedia, Button, CircularProgress, Alert, Box, Chip, Rating, CardContent, CardActions } from "@mui/material";
import Header from '../components/Header.jsx'

export default function Proveedor() {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReseñas, setOpenReseñas] = useState(false);
  const [openProductos, setOpenProductos] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/proveedores/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Proveedor no encontrado");
        return res.json();
      })
      .then((data) => {
        setProveedor(data);
        setError(null);
        fetch("http://localhost:3000/productos")
          .then(res => res.json())
          .then(allProducts => {
            const provProducts = allProducts.filter(p => p.id_provider === data.id_provider);
            setProducts(provProducts);
          })
          .catch(err => console.error("Error al cargar productos del proveedor:", err));
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Error: {error}</Alert>
      </Container>
    );

  if (!proveedor)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Proveedor no encontrado.</Alert>
      </Container>
    );

  return (
    <Container sx={{ py: 4 }}>
        <Header/>
      <Button component={Link} to="/proveedores" variant="outlined" sx={{ mb: 3 }}>
        ← Volver al catálogo
      </Button>

      <Card
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          p: 3,
          display: "flex",
          gap: 4
        }}
      >
        {/*izquierda*/}
        <Box sx={{ width: "40%", textAlign: "center" }}>
          <CardMedia
            component="img"
            image={proveedor.image || "https://via.placeholder.com/200"}
            alt={proveedor.companyName}
            sx={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              objectFit: "cover",
              mx: "auto",
              mb: 2
            }}
          />

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {proveedor.companyName}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 1,
              mb: 2
            }}
          >
            {Array.isArray(proveedor.categories) &&
              proveedor.categories.map((cat, i) => (
                <Chip
                  key={i}
                  label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  color="primary"
                />
              ))}
          </Box>
        </Box>

        {/*derecha*/}
        <Box sx={{ width: "60%" }}>
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
            {proveedor.description || "Sin descripción disponible."}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Disponibilidad:</strong>{" "}
            {proveedor.availability
              ? `${proveedor.availability.open} - ${proveedor.availability.close}`
              : "Desconocida"}
          </Typography>
        </Box>
      </Card>

      {/*el mismo componente drawer de mui pero para los productos*/}      
      <Card
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          mt: 3,
          borderRadius: 2,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          maxHeight: openProductos ? 600 : 60
        }}
      >
        {/*componente minimizado haciendo click*/}
        <Box
          onClick={() => setOpenProductos(!openProductos)}
          sx={{
            p: 2,
            backgroundColor: "#f0f0f0",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h6">Productos del Proveedor</Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            {openProductos ? "↑" : "↓"}
          </Typography>
        </Box>

        {/*lo que se ve al expandirse los productos*/}
        <Box sx={{ p: 2, overflowY: "auto", height: openProductos ? "auto" : 0 }}>
          {products && products.length > 0 ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              {products.map((product) => (
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
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "#666" }}>
              Aún no hay productos de este proveedor.
            </Typography>
          )}
        </Box>
      </Card>

      {/*componente drawer de mui para las reseñas*/}
      <Card
        sx={{
          width: "100%",
          maxWidth: 1100,
          mx: "auto",
          mt: 3,
          borderRadius: 2,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          maxHeight: openReseñas ? 600 : 60
        }}
      >
        {/*componente minimizado haciendo click*/}
        <Box
          onClick={() => setOpenReseñas(!openReseñas)}
          sx={{
            p: 2,
            backgroundColor: "#f0f0f0",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h6">Reseñas de Usuarios</Typography>
          <Typography sx={{ fontSize: "1.2rem" }}>
            {openReseñas ? "↑" : "↓"}
          </Typography>
        </Box>

        {/*lo que se ve al expandirse las reseñas*/}
        <Box sx={{ p: 2, overflowY: "auto", height: openReseñas ? "auto" : 0 }}>
          {Array.isArray(proveedor.rating) && proveedor.rating.length > 0 ? (
            <ul style={{ paddingLeft: 18 }}>
              {proveedor.rating.map((r, idx) => (
                <li key={idx} style={{ marginBottom: 12 }}>
                  <Rating value={r.score} readOnly precision={1} />
                  <div style={{ fontWeight: "bold" }}>{r.author || "Anónimo"}</div>
                  <div>{r.comment}</div>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2" sx={{ color: "#666" }}>
              Aún no hay reseñas para este proveedor.
            </Typography>
          )}
        </Box>
      </Card>
    </Container>
  );
}