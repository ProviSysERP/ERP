import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './Proveedor.css';
import { Container, Typography, Card, CardMedia, Button, CircularProgress, Alert, Box, Chip, Rating, CardContent, CardActions, TextField, Stack } from "@mui/material";
import Header from '../components/Header.jsx'
import { fetchWithRefresh } from "../components/fetchWithRefresh";


export default function Proveedor() {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openReseñas, setOpenReseñas] = useState(false);
  const [openProductos, setOpenProductos] = useState(false);
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null); // nombre del usuario logueado
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [nuevaPuntuacion, setNuevaPuntuacion] = useState(0);
  const [loadingPost, setLoadingPost] = useState(false);

  // Mapa para traducir días de semana a español
  const diasSemana = {
    Mon: "Lunes",
    Tue: "Martes",
    Wed: "Miércoles",
    Thu: "Jueves",
    Fri: "Viernes",
    Sat: "Sábado",
    Sun: "Domingo"
  };

  useEffect(() => {
    fetchWithRefresh("http://localhost:3000/usuarios/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.id_user) {
          setUserId(data.id_user);
          setUserName(data.name || "Anónimo");
        }
      })
      .catch(() => setUserId(null));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchWithRefresh(`http://localhost:3000/proveedores/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Proveedor no encontrado");
        return res.json();
      })
      .then((data) => {
        setProveedor(data);
        setError(null);
        fetchWithRefresh("http://localhost:3000/productos")
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

  const enviarReseña = () => {
    if (!nuevoComentario || !nuevaPuntuacion || !userId) return;

    setLoadingPost(true);
    fetchWithRefresh(`http://localhost:3000/proveedores/${proveedor.id_provider}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        score: nuevaPuntuacion,
        comment: nuevoComentario
      })
    })
      .then(res => res.json())
      .then(data => {
        setProveedor(prev => ({
          ...prev,
          rating: [
            ...(prev.rating || []).filter(r => r.userId !== userId),
            { ...data, author: userName, userId }
          ]
        }));
        setNuevoComentario("");
        setNuevaPuntuacion(0);
      })
      .catch(err => console.error("Error al agregar reseña:", err))
      .finally(() => setLoadingPost(false));
  };

  const eliminarReseña = async (reviewUserId) => {
    try {
      const confirmacion = window.confirm("¿Deseas eliminar esta reseña?");
      if (!confirmacion) return;

      const response = await fetchWithRefresh(
        `http://localhost:3000/proveedores/${proveedor.id_provider}/rating/${reviewUserId}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error(`Error al eliminar la reseña (HTTP ${response.status})`);

      setProveedor(prev => ({
        ...prev,
        rating: prev.rating.filter(r => r.userId !== reviewUserId)
      }));
    } catch (err) {
      console.error("Error al eliminar reseña:", err);
      alert("No se pudo eliminar la reseña.");
    }
  };

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

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Días disponibles:</strong>{" "}
            {proveedor.availability && proveedor.availability.days
              ? proveedor.availability.days.map(d => diasSemana[d]).join(", ")
              : "Sin datos"}
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
        <Box sx={{ p: 2, height: openReseñas ? "auto" : 0, maxHeight: 450, overflowY: "auto" }}>
          
          {userId && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Añadir una reseña:</Typography>
              <Stack spacing={1}>
                <Rating
                  name="new-rating"
                  value={nuevaPuntuacion}
                  precision={1}
                  onChange={(event, newValue) => setNuevaPuntuacion(newValue)}
                />
                <TextField
                  fullWidth
                  multiline
                  minirows={1}
                  placeholder="Escribe tu comentario..."
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  slotProps={{
                    sx: {
                      "& .MuiInputBase-input": {
                      padding: "2px 8px",
                      lineHeight: "1.4",
                    },
                      "&::before": { border: "none" },
                      "&::after": { border: "none" },
                    },
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={enviarReseña}
                    disabled={loadingPost || nuevaPuntuacion === 0 || !nuevoComentario}
                  >
                    {loadingPost ? "Enviando..." : "Enviar"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}

          {Array.isArray(proveedor.rating) && proveedor.rating.length > 0 ? (
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none", }}>
              {proveedor.rating.map((r, idx) => (
                <Box
                  component="li"
                  key={idx}
                  sx={{ mb: 1, p: 1, borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography sx={{ fontWeight: "bold" }}>{r.author || "Anónimo"}</Typography>
                      <Rating value={r.score} readOnly precision={1} size="small"/>
                    </Box>
                    <Typography>{r.comment}</Typography>
                  </Box>

                  {r.userId === userId && (
                    <Button
                      size="small"
                      color="error"
                      onClick={() => eliminarReseña(r.userId)}
                    >
                      Eliminar
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
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