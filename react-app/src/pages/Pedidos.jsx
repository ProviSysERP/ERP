import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Header from "../components/Header.jsx";
import {Avatar, Badge, Box, Button, Container,Dialog, DialogActions, DialogContent, DialogTitle, Divider, Drawer, IconButton, List, ListItem,
  ListItemAvatar, ListItemText, Paper, Snackbar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, Alert, Collapse,Grid} from "@mui/material";
import TableRowMUI from "@mui/material/TableRow";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { fetchWithRefresh } from "../components/fetchWithRefresh";


function createDataFromProduct(p) {
  return {
    id: p._id || p.id_product || null,
    name: p.name || "Sin nombre",
    provider: p.id_provider ?? p.provider ?? "N/D",
    price: typeof p.price === "number" ? p.price : parseFloat(p.price) || 0,
    description: p.description || "",
    images: p.images || [],
    category: p.category || "",
    statusProd: p.statusProd || "unknown",
    raw: p,
  };
}

function Row({ row, onAddToCart }) {
  const [open, setOpen] = useState(false);
  const thumbnail =
    (row.images && row.images[0] && (row.images[0].url || row.images[0].path)) ||
    null;

  return (
    <React.Fragment>
      <TableRowMUI sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              variant="rounded"
              src={thumbnail || undefined}
              alt={row.name}
            >
              {row.name?.[0] ?? "P"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{row.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {row.category}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell align="right">{row.provider}</TableCell>

        <TableCell align="right">{row.price?.toFixed(2)} €</TableCell>

        <TableCell align="right">
          <Typography variant="body2" color="text.secondary">
            {row.statusProd ?? "N/D"}
          </Typography>
        </TableCell>

        <TableCell align="right">
          <Tooltip title="Añadir al carrito">
            <IconButton
              onClick={() => onAddToCart(row)}
              aria-label={`añadir ${row.name} al carrito`}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRowMUI>

      <TableRowMUI>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Descripción
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {row.description || "Sin descripción."}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="body2">
                  <strong>Precio:</strong> {row.price?.toFixed(2)} €
                </Typography>
                <Typography variant="body2">
                  <strong>Proveedor:</strong> {row.provider}
                </Typography>
                <Typography variant="body2">
                  <strong>Estado:</strong> {row.statusProd}
                </Typography>
              </Stack>
            </Box>
          </Collapse>
        </TableCell>
      </TableRowMUI>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string.isRequired,
      provider: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    images: PropTypes.array,
    category: PropTypes.string,
    statusProd: PropTypes.string,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default function Pedidos() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]); 
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
  const [street, setStreet] = useState("");  
  const [city, setCity] = useState("");     
  const [stateRegion, setStateRegion] = useState("");
  const [postalCode, setPostalCode] = useState(""); 
  const [country, setCountry] = useState(""); 
  useEffect(() => {
    setIsLoading(true);
    fetchWithRefresh("http://localhost:3000/productos")
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        const formatted = (json || []).map((p) => createDataFromProduct(p));
        setProducts(formatted);
        setError(null);
      })
      .catch((err) => {
        console.error("Error al cargar productos:", err);
        setError(err.message || "Error al cargar productos");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const idx = prev.findIndex((it) => it.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      } else {
        return [...prev, { product, qty: 1 }];
      }
    });
    setCartOpen(true);
    setSnack({ open: true, message: `${product.name} añadido al carrito`, severity: "success" });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const handleChangeQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((it) =>
          it.product.id === productId ? { ...it, qty: Math.max(1, it.qty+ delta) }: it
        )
        .filter(Boolean)
    );
  };

  const cartCount = cart.reduce((s, it) => s + it.qty, 0);
  const cartTotal = cart.reduce((s, it) => s + it.qty * (it.product.price || 0), 0);

  const handleConfirmOpen = () => {
    if (cart.length === 0) {
      setSnack({ open: true, message: "El carrito está vacío", severity: "warning" });
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => setConfirmOpen(false);

  const handleClearCart = () => setCart([]);

  const handlePlaceOrder = () => {
    const orderProducts = cart.map((it) => ({
      id_product: it.product.id,
      name: it.product.name,
      quantity: it.qty,
      unit_price: it.product.price,
    }));

    const payload = {
      id_provider: cart.length ? cart[0].product.provider : null,
      id_user: 1, // Tendria que venir del usuario logeado pero no se con certeza si lo he conseguido
      products: orderProducts,
      total_price: Math.round(cartTotal * 100) / 100,
      address: {
            address: address || "",
            street: street || "",
            city: city || "",
            state: stateRegion || "",
            postalCode: postalCode || "",
            country: country || "",
      },
      status: "Pendiente",
      createdAt: new Date().toISOString(),
    };

  
    fetchWithRefresh("http://localhost:3000/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error al crear pedido: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSnack({ open: true, message: "Pedido creado correctamente", severity: "success" });
        setCart([]);
        setConfirmOpen(false);
        setCartOpen(false);
      })
      .catch((err) => {
        console.error(err);
        setSnack({ open: true, message: "Error al crear pedido", severity: "error" });
      });
  };

  if (isLoading) {
    return (
      <Container>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography variant="h5">Cargando productos...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography color="error" variant="h5">
            Error al cargar datos: {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Box sx={{ mt: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Pedidos / Productos</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              startIcon={<ShoppingCartCheckoutIcon />}
              onClick={handleConfirmOpen}
            >
              Confirmar pedido
            </Button>

            <IconButton color="primary" onClick={() => setCartOpen(true)} aria-label="abrir carrito">
              <Badge badgeContent={cartCount} color="secondary" showZero={false}>
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Stack>
        </Stack>

        <TableContainer component={Paper} sx={{ maxHeight: 360, overflow: "auto" }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow >
                <TableCell />
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Proveedor</TableCell>
                <TableCell align="right">Precio (€/ud)</TableCell>
                <TableCell align="right">Estado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody> 
              
              {products.map((p) => (
                 <Row key={p.id || p.name} row={p} onAddToCart={handleAddToCart} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Drawer del carrito Intene que sea como el de Jon pero no lo consegui */}
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Box sx={{ width: 380, p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Carrito</Typography>
            <Button onClick={handleClearCart} startIcon={<DeleteIcon />}>
              Vaciar
            </Button>
          </Stack>

          <Divider sx={{ my: 1 }} />
          {cart.length === 0 ? (
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                El carrito está vacío
                </Typography>
            </Box>
          ) : (
            <List>
              {cart.map((it) => (
                <React.Fragment key={it.product.id}>
                  <ListItem
                    secondaryAction={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton
                          size="small"
                          onClick={() => handleChangeQty(it.product.id, -1)}
                        >
                          <RemoveIcon />
                        </IconButton>
                        <Typography>{it.qty}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleChangeQty(it.product.id, +1)}
                        >
                          <AddIcon />
                        </IconButton>

                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleRemoveFromCart(it.product.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        src={
                          (it.product.images &&
                            it.product.images[0] &&
                            (it.product.images[0].url || it.product.images[0].path)) ||
                          undefined
                        }
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={it.product.name}
                      secondary={`${it.product.price?.toFixed(2)} € / ud`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Total: {cartTotal.toFixed(2)} €</Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                disabled={cart.length === 0}
                startIcon={<ShoppingCartCheckoutIcon />}
                onClick={handleConfirmOpen}
                fullWidth
              >
                Confirmar pedido
              </Button>
            </Stack>
          </Box>
        </Box>
      </Drawer>

      
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Confirmar pedido</DialogTitle>
        <DialogContent>
          <Box sx={{ minWidth: 360 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Total provisional: <strong>{cartTotal.toFixed(2)} €</strong>
            </Typography>

            <TextField
              label="Address"
              fullWidth
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Descripción completa (opcional si rellenas street)..."
            />

            <TextField
              label="Calle"
              fullWidth
              margin="normal"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Calle, número..."
            />

            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ciudad"
                  fullWidth
                  margin="normal"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ciudad"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Provincia / Estado"
                  fullWidth
                  margin="normal"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="Provincia / Estado"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Código Postal"
                  fullWidth
                  margin="normal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Código Postal"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="País"
                  fullWidth
                  margin="normal"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="País"
                />
              </Grid>
            </Grid>

            <TextField
              label="Notas (opcional)"
              fullWidth
              margin="normal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Llamar al llegar..."
            />

            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Resumen:</Typography>
              {cart.map((it) => (
                <Typography key={it.product.id} variant="body2">
                  {it.qty} × {it.product.name} — {(it.qty * it.product.price).toFixed(2)} €
                </Typography>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handlePlaceOrder}
            startIcon={<ShoppingCartCheckoutIcon />}
          >
            Enviar pedido
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>  
  );
}
