import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Box,
  Chip
} from "@mui/material";

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

      <Card sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image={proveedor.image || "https://via.placeholder.com/400x200"}
          alt={proveedor.companyName}
          sx={{ borderRadius: 2 }}
        />
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {proveedor.companyName}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
            {Array.isArray(proveedor.categories) &&
              proveedor.categories.map((cat, i) => <Chip key={i} label={cat} size="small" color="primary" />)}
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
                    <strong>{r.author || "Anónimo"}</strong> —{" "}
                    <span style={{ color: "#666" }}>{r.stars ?? ""}★</span>
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