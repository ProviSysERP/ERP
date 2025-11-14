import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Producto() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = "http://localhost:3000";
  const PLACEHOLDER = "https://via.placeholder.com/800x600?text=Sin+imagen";

  const resolveImage = (img) => {
    if (!img) return PLACEHOLDER;
    if (typeof img !== "string") return PLACEHOLDER;
    const trimmed = img.trim();
    if (!trimmed) return PLACEHOLDER;
    if (trimmed.startsWith("http") || trimmed.startsWith("data:")) return trimmed;
    if (trimmed.startsWith("/")) return `${BASE_URL}${trimmed}`;
    return `${BASE_URL}/${trimmed}`;
  };

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8500,
    pauseOnHover: true,
    adaptiveHeight: false,
  };

  useEffect(() => {
    if (!id) {
      setError("ID de producto no especificado");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Intentamos obtener un endpoint por id primero; si no existe, pedimos todos y buscamos
    const byIdUrl = `${BASE_URL}/productos/${id}`;
    fetch(byIdUrl)
      .then((res) => {
        if (res.ok) return res.json();
        // si no existe endpoint por id, pedimos lista
        if (res.status === 404) return fetch(`${BASE_URL}/productos`).then((r) => {
          if (!r.ok) throw new Error(`Error HTTP: ${r.status}`);
          return r.json();
        });
        throw new Error(`Error HTTP: ${res.status}`);
      })
      .then((data) => {
        // si data es array lo buscamos por id, si es objeto lo usamos directamente
        if (Array.isArray(data)) {
          const found = data.find(
            (p) => String(p.id_product ?? p.id ?? p._id) === String(id)
          );
          if (!found) throw new Error("Producto no encontrado");
          setProduct(found);
        } else if (data && typeof data === "object") {
          setProduct(data);
        } else {
          throw new Error("Respuesta de API inválida");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <Container sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Error: {error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/productos" variant="outlined">
            Volver a Productos
          </Button>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="info">Producto no disponible o no existente.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button component={RouterLink} to="/productos" variant="outlined">
            Volver a Productos
          </Button>
        </Box>
      </Container>
    );
  }

  const imageUrl =
    (product.images && product.images.length && product.images[0]) ||
    product.image ||
    product.profile_picture ||
    "";

return (
  <Container sx={{ py: { xs: 3, md: 6 } }}>
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(3,18,26,0.08)",
        height: { xs: "auto", md: 450 },
        position: "relative",
        ".slick-prev, .slick-next": {
          zIndex: 10,
          width: "40px",
          height: "40px",
        },
        ".slick-prev": {
          left: "10px",
        },
        ".slick-next": {
          right: "10px",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "48%" },
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Slider {...settings}>
          {product.images?.map((img, index) => (
            <Box key={index} sx={{ height: "100%" }}>
              <CardMedia
                component="img"
                image={resolveImage(img)}
                alt={product.name}
                sx={{
                  width: "100%",
                  alignContent: "center",
                  alignItems: "center",
                  height: "100%",
                  objectFit: "fill",
                  borderRadius:"10px"
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      <CardContent
        sx={{
          flex: 1,
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Chip label={`ID: ${product.id_product ?? product.id ?? product._id ?? "-"}`} />
            {product.category && <Chip label={product.category} color="primary" />}
          </Stack>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {product.name}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {product.subtitle || product.short_description || ""}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description || "Sin descripción disponible."}
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700, color: "secondary.main" }}>
            {product.price != null ? `€ ${product.price}` : "Precio no disponible"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" size="large">Añadir al carrito</Button>
          <Button component={RouterLink} to="/" variant="outlined">
            Volver
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Container>
);

}