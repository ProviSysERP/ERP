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
  Button,
  Chip,
} from "@mui/material";
import "./CartaProveedores.css";
import { fetchWithRefresh } from "../components/fetchWithRefresh";

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

  const formatCategories = (cats) => {
    if (!cats) return "";
    if (Array.isArray(cats)) {
      return cats
        .map((c) => {
          const s = String(c || "");
          return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
        })
        .join(", ");
    }
    return String(cats);
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const cargarProveedores = async () => {
      try {
        const res = await fetchWithRefresh(`${BASE_URL}/proveedores`);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Formato de datos inválido");
        setProveedores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    cargarProveedores();
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
          variant="standard"
          cols={3}
          gap={16}
          rowHeight={290}
          sx={{
            width: "100%",
            margin: 0,
          }}
        >
          {proveedores.map((prov) => {
            const key = prov.id_provider ?? prov.id ?? prov._id ?? prov.image ?? prov.name ?? Math.random();
            const img = resolveImage(prov.image ?? prov.profile_picture);
            const title = prov.name ?? prov.title ?? "Proveedor";

            return (
              <ImageListItem
                key={key}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 260,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Link to={`/proveedor/${prov.id_provider}`} style={{ display: "block", height: "100%", color: "inherit", textDecoration: "none" }}>
                  <img
                    src={img}
                    alt={title}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: 200,
                      display: "block",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />

                  <Box sx={{ p: 1, pb: 3 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        textAlign: "center",
                        mb: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={title}
                    >
                      {title}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5, flexWrap: "wrap" }}>
                      {Array.isArray(prov.categories) && prov.categories.length > 0 ? (
                        prov.categories.map((cat, i) => (
                          <Chip
                            key={i}
                            label={String(cat).charAt(0).toUpperCase() + String(cat).slice(1)}
                            size="small"
                            color="primary"
                            sx={{
                              textTransform: "capitalize",
                              fontSize: "0.85rem",
                              borderRadius: 10,
                              px: 1.2,
                              py: 0.3,
                              boxShadow: "none",
                            }}
                          />
                        ))
                      ) : typeof prov.categories === "string" && prov.categories ? (
                        <Chip
                          label={String(prov.categories)}
                          size="small"
                          color="primary"
                          sx={{ textTransform: "capitalize", fontSize: "0.80rem", borderRadius: 8, px: 0.9, py: 0.2 }}
                        />
                      ) : null}
                    </Box>
                  </Box>
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