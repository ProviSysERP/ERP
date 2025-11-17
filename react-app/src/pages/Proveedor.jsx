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

  return (
    <Container sx={{ py: 4 }}>
      <Button component={Link} to="/proveedores" variant="outlined" sx={{ mb: 3 }}>
        ← Volver al catálogo
      </Button>

      <Card sx={{ maxWidth: 600, mx: "auto", p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CardMedia
          component="img"
          image={proveedor.image || "https://via.placeholder.com/200"}
          alt={proveedor.companyName}
          sx={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            objectFit: "cover",
            mb: 2
          }}
        />
        <CardContent sx={{ width: "100%", textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            {proveedor.companyName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 0.5,
              mb: 2
            }}
          >
            {Array.isArray(proveedor.categories) &&
              proveedor.categories.map((cat, i) => (
                <Chip
                  key={i}
                  label={cat}
                  size="small"
                  color="primary"
                  sx={{ textTransform: "capitalize", fontSize: "1rem" }}
                />
              ))}
          </Box>
          <Typography variant="body1" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
            {proveedor.description || "Sin descripción disponible."}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Disponibilidad:</strong>{" "}
            {proveedor.availability
              ? `${proveedor.availability.open} - ${proveedor.availability.close}`
              : "Desconocida"}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Reseñas</Typography>
            {Array.isArray(proveedor.rating) && proveedor.rating.length > 0 ? (
              <ul style={{ paddingLeft: 18 }}>
                {proveedor.rating.map((r, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <Rating
                      name={`rating-${idx}`}
                      value={r.score}
                      readOnly={true}
                      precision={1}
                    />
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
        </CardContent>
      </Card>
    </Container>
  );
}