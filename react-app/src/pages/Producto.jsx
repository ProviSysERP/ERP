import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from "../components/Header.jsx";
import { fetchWithRefresh } from "../components/fetchWithRefresh";


export default function Producto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = "http://localhost:3000";
  const PLACEHOLDER = "https://via.placeholder.com/800x600?text=Sin+imagen";

  const resolveImage = (img) => {
    if (!img) return PLACEHOLDER;
    if (img.startsWith("http") || img.startsWith("data:")) return img;
    return `${BASE_URL}${img.startsWith("/") ? img : "/" + img}`;
  };

  const settings = {
    dots: false,
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

  // Función para traer proveedor (simulada)
  const pullProviders = async (provId) => {
    try {
      const response = await fetchWithRefresh(`${BASE_URL}/proveedores/porProducto/${provId}`);
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error("Error al obtener proveedor:", err);
      return null;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetchWithRefresh(`${BASE_URL}/productos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then(async data => {
        setProduct(data);

        const provData = await pullProviders(data.id_provider);
        if (provData) setProvider(provData);
      })
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <Container sx={{ py: 6, display: "flex", justifyContent: "center" }}><CircularProgress /></Container>;
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Volver</Button>
        </Box>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="info">Producto no disponible.</Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>Volver</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: { xs: 3, md: 6 }, position:"fixed", bottom:0, top:0 }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* PRODUCTO */}
        <Card
          sx={{
            minWidth: 900,
            flex: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(3,18,26,0.08)",
            height: { xs: "auto", md: 450 },
            position: "relative",
            ".slick-prev, .slick-next": { zIndex: 10, width: 40, height: 40 },
            ".slick-prev": { left: 10 },
            ".slick-next": { right: 10 },
            ".slick-prev:before, .slick-next:before": { color: "black", fontSize: 32 },
          }}
        >
          {/* SLIDER */}
          <Box sx={{ width: { xs: "100%", md: "48%" }, height: "100vh", minWidth: 500, overflow: "hidden", bottom: 0 }}>
            <Slider {...settings}>
              {(product.images && product.images.length ? product.images : [product.image || PLACEHOLDER]).map((img, index) => (
                <CardMedia
                  key={index}
                  component="img"
                  image={resolveImage(img)}
                  alt={product.name}
                  sx={{ width: "100%", height: 410, objectFit: "cover", minHeight: 450 }}
                />
              ))}
            </Slider>
          </Box>

          {/* DETALLE PRODUCTO */}
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
                {product.category && (
                  <Chip
                    label={product.category.charAt(0).toUpperCase() + product.category.slice(1).toLowerCase()}
                    color="primary"
                  />
                )}
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{product.name}</Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>{product.subtitle || product.short_description || ""}</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>{product.description || "Sin descripción disponible."}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "secondary.main" }}>
                {product.price != null ? `€ ${product.price}` : "Precio no disponible"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={() => navigate("/pedidos")}>Ir a pedidos</Button>
              <Button variant="outlined" onClick={() => navigate(-1)}>Volver</Button>
            </Box>
          </CardContent>
        </Card>

        {/* PROVEEDOR */}
        {provider && (
          <Card sx={{ minHeight: 450, flex: 1, maxWidth: 300, minWidth: 260, borderRadius: 3, overflow: "hidden", boxShadow: "0 12px 40px rgba(3,18,26,0.12)" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, textAlign: "center", mb: 2 }}>Proveedor del Producto</Typography>
              {(Array.isArray(provider) ? provider : [provider]).map((p) => (
                <Card key={p.id_provider} sx={{ boxShadow: "none", mb: 2 }}>
                  <CardMedia
                    sx={{ height: 160, objectFit: "contain" }}
                    image={resolveImage(p.image)}
                    alt={p.companyName}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{p.companyName}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap", my: 1 }}>
                      {p.categories?.map((cat, i) => (
                        <Chip key={i} label={cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()} size="small" color="primary" />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
}
