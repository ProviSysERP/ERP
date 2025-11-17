import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Alert, Box, Chip, Rating } from "@mui/material";

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

  const cardWidth = 350;
  return (
    <Container sx={{ py: 4 }}>
      <Button component={Link} to="/proveedores" variant="outlined" sx={{ mb: 3 }}>
        ← Volver al catálogo
      </Button>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap", width: "100%" }}>

        {/*Carta principal*/}
        <Card sx={{ width: cardWidth, minHeight: 500, p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CardMedia
            component="img"
            image={proveedor.image || "https://via.placeholder.com/200"}
            alt={proveedor.companyName}
            sx={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
              mb: 2
            }}
          />
          <CardContent sx={{ width: "100%", textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
              {proveedor.companyName}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
              {Array.isArray(proveedor.categories) &&
                proveedor.categories.map((cat, i) => (
                  <Chip
                    key={i}
                    label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                    size="small"
                    color="primary"
                    sx={{ fontSize: "1rem", textTransform: "capitalize" }}
                  />
                ))}
            </Box>
            <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
              {proveedor.description || "Sin descripción disponible."}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Disponibilidad:</strong>{" "}
              {proveedor.availability
                ? `${proveedor.availability.open} - ${proveedor.availability.close}`
                : "Desconocida"}
            </Typography>
          </CardContent>
        </Card>

        {/*Carta reseñas*/}
        <Card sx={{ width: cardWidth, minHeight: 500, p: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>Reseñas de usuarios</Typography>
            {Array.isArray(proveedor.rating) && proveedor.rating.length > 0 ? (
              <ul style={{ paddingLeft: 18 }}>
                {proveedor.rating.map((r, idx) => (
                  <li key={idx} style={{ marginBottom: 12 }}>
                    <Rating name={`rating-${idx}`} value={r.score} readOnly precision={1} />
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
          </CardContent>
        </Card>

      </Box>
    </Container>
  );
}