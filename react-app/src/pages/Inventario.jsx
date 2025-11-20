import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Alert, Button, CardMedia, CardContent, CardActions, Card, TextField } from '@mui/material';
import Header from '../components/Header.jsx';
import '../pages/Productos.css';
import { obtenerUsuario } from "../components/ObtenerUsuario.js";

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [idUsuario, setIdUsuario] = useState(null);
  const [updatingStock, setUpdatingStock] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const usuario = await obtenerUsuario();
      setIdUsuario(usuario.id_user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!idUsuario) return;

    const loadInventory = async () => {
      setIsLoading(true);

      try {
        const invRes = await fetch(`http://localhost:3000/inventario/${idUsuario}`);
        if (!invRes.ok) throw new Error("Error al cargar inventario");

        const inventario = await invRes.json();

        const productPromises = inventario.products.map(async (item) => {
          const prodRes = await fetch(`http://localhost:3000/productos/${item.id_product}`);
          if (!prodRes.ok) return null;

          const prod = await prodRes.json();
          return {
            ...prod,
            stock: item.stock,
            unit_price: item.unit_price,
            lastRestocked: item.lastRestocked
          };
        });

        const productosConInventario = (await Promise.all(productPromises)).filter(Boolean);

        setProducts(productosConInventario);
        setError(null);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, [idUsuario]);

  const handleStockChange = (id_product, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id_product === id_product ? { ...p, stock: Number(value) } : p
      )
    );
  };

  const saveStock = async (id_product, newStock) => {
    setUpdatingStock((prev) => ({ ...prev, [id_product]: true }));

    try {
      const res = await fetch(`http://localhost:3000/inventario/modifyStock/${id_product}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: idUsuario, newStock })
      });

      if (!res.ok) throw new Error("No se pudo actualizar el stock");

    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingStock((prev) => ({ ...prev, [id_product]: false }));
    }
  };

  const productosFiltrados = products.filter((p) => {
    const coincideBusqueda = p.name.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === "" ||
      (p.category && p.category.toLowerCase() === categoriaSeleccionada.toLowerCase());
    return coincideBusqueda && coincideCategoria;
  });

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Header />
      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: "340px" }}>
          Error: {error}
        </Alert>
      )}

      <Box sx={{ display: "flex" }}>
        <Box className="productos-sidebar">
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Buscar producto
          </Typography>

          <TextField
            fullWidth
            label="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Categorías
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {["Alimentos", "Bebidas", "Otros"].map((cat) => (
              <Button
                key={cat}
                variant={categoriaSeleccionada === cat.toLowerCase() ? "contained" : "outlined"}
                onClick={() =>
                  setCategoriaSeleccionada(
                    categoriaSeleccionada === cat.toLowerCase() ? "" : cat.toLowerCase()
                  )
                }
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Box>

        <Box sx={{ flex: 1, ml: "200px", p: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
            Inventario Actual
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((product) => (
                <Card key={product.id_product} sx={{ maxWidth: 300, minWidth: 300, height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={(product.images?.length ? product.images[0] : product.image) || '/placeholder.jpg'}
                    title={product.name}
                  />

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Precio: {product.price}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id_product === product.id_product
                                ? { ...p, stock: Math.max(0, p.stock - 1) }
                                : p
                            )
                          )
                        }
                        sx={{ minWidth: 40 }}
                      >
                        -
                      </Button>

                      <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                        {product.stock}
                      </Typography>

                      <Button
                        variant="outlined"
                        onClick={() =>
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id_product === product.id_product
                                ? { ...p, stock: p.stock + 1 }
                                  : p
                              )
                            )
                        }
                        sx={{ minWidth: 40 }}
                      >
                        +
                      </Button>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Precio Unitario: {product.unit_price}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Último Reabastecimiento:
                      {" "}
                      {new Date(product.lastRestocked).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        handleSaveStock(product.id_product, product.stock)
                      }
                    >
                      Guardar Cambios
                    </Button>

                    <Button
                      size="small"
                      component={Link}
                      to={`/producto/${product.id_product}`}
                      fullWidth
                    >
                      Más Info
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Alert severity="info">No hay productos disponibles</Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
