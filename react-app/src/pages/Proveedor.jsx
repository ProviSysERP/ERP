import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Alert, Box, Chip, Rating } from "@mui/material";
import Header from '../components/Header.jsx'

export default function Proveedor() {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

      {/* CARD ANCHA */}
      <Card
        sx={{
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
          p: 3,
          display: "flex",
          gap: 4,
          alignItems: "flex-start"
        }}
      >
        {/* COLUMNA IZQUIERDA */}
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

          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {proveedor.companyName}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {Array.isArray(proveedor.categories) &&
              proveedor.categories.map((cat, i) => (
                <Chip
                  key={i}
                  label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  size="small"
                  color="primary"
                  sx={{ fontSize: "1rem" }}
                />
              ))}
          </Box>

          <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
            {proveedor.description || "Sin descripción disponible."}
          </Typography>

          <Typography variant="body1">
            <strong>Disponibilidad:</strong>{" "}
            {proveedor.availability
              ? `${proveedor.availability.open} - ${proveedor.availability.close}`
              : "Desconocida"}
          </Typography>
        </Box>

        {/* COLUMNA DERECHA (RESEÑAS) */}
        <Box sx={{ width: "60%" }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
            Reseñas de usuarios
          </Typography>

          {Array.isArray(proveedor.rating) && proveedor.rating.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {proveedor.rating.map((r, idx) => (
                <li key={idx} style={{ marginBottom: 16 }}>
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