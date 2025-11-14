import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  Alert,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Button,
} from "@mui/material";
import "./CartaProveedores.css";

export default function CartaProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL = "http://localhost:3000";
  const PLACEHOLDER = "https://via.placeholder.com/400?text=Sin+imagen";

  const resolveImage = (img) => {
    if (!img) return PLACEHOLDER;
    if (typeof img !== "string") return PLACEHOLDER;
    const trimmed = img.trim();
    if (!trimmed) return PLACEHOLDER;
    if (trimmed.startsWith("http") || trimmed.startsWith("data:")) return trimmed;
    if (trimmed.startsWith("/")) return `${BASE_URL}${trimmed}`;
    return `${BASE_URL}/${trimmed}`;
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    fetch(`${BASE_URL}/proveedores`)
      .then((response) => {
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        return response.json();
      })
      .then((jsonData) => {
        // Asegurarse que sea array
        if (!Array.isArray(jsonData)) {
          setProveedores([]);
          setError("Formato de datos inválido");
          return;
        }
        setProveedores(jsonData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
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

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Button component={Link} to="/proveedores" variant="outlined" size="small">
          Ver lista completa
        </Button>
      </Box>

      {proveedores && proveedores.length > 0 ? (
        <ImageList
          variant="masonry"
          cols={3}
          gap={12}
          sx={{
            width: "100%",
            margin: 0,
          }}
        >
          {proveedores.map((prov) => {
            const key = prov.id_provider ?? prov.id ?? prov._id ?? prov.image ?? Math.random();
            const img = resolveImage(prov.image ?? prov.profile_picture);
            const title = prov.name ?? prov.title ?? "Proveedor";

            return (
              <ImageListItem key={key} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Link to={`/proveedor/${prov.id_provider}`} style={{ display: "block" }}>
                  <img
                    src={img}
                    alt={title}
                    loading="lazy"
                    style={{ width: "100%", display: "block", objectFit: "cover" }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                  <ImageListItemBar
                    title={title}
                    subtitle={prov.categories ? String(prov.categories) : ""}
                    position="below"
                  />
                </Link>
              </ImageListItem>
            );
          })}
        </ImageList>
      ) : (
        <Alert severity="info">No hay Proveedores disponibles</Alert>
      )}
    </Container>
  );
}