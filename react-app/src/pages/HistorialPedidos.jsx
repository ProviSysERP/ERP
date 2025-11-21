// OrdersDashboard.jsx — versión completa con MUI
// Incluye: GET/POST/PUT/DELETE, paginación, búsqueda, filtros, modal detalle/edición, crear pedido,
// Snackbar de éxito/error, exportar a PDF (jspdf), tema claro/oscuro (toggle), responsive
import Header from '../components/Header.jsx'
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Paper,
  Grid,
  Snackbar,
  Alert,
  TablePagination,
  useMediaQuery,
  AppBar,
  Toolbar,
  Switch
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Download, Search, PlusCircle, Trash2, Edit2, Moon, Sun } from "lucide-react";
import jsPDF from "jspdf";
import { fetchWithRefresh } from "../components/fetchWithRefresh";

export default function HistorialPedidos() {
  
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detailOrder, setDetailOrder] = useState(null); // for detail/edit modal
  const [createOpen, setCreateOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  
  const emptyForm = {
    id_delivery: "",
    id_provider: "",
    id_user: "",
    products: [{ id_product: "", quantity: "", unit_price: "" }],
    total_price: "",
    address: { street: "", city: "", state: "", postalCode: "", country: "" },
    status: "En transito",
  };
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchOrders() {
    try {
      setLoading(true);
      const res = await fetchWithRefresh("http://localhost:3000/pedidos");
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", message: "Error al cargar pedidos" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  
  const filtered = useMemo(() => {
    const s = String(search || "").toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        !s ||
        String(o.id_delivery).toLowerCase().includes(s) ||
        (o.address && o.address.city && o.address.city.toLowerCase().includes(s));
      const matchesStatus = !statusFilter || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); };

  // CRUD
  const handleDelete = async (id_delivery) => {
    if (!confirm("¿Eliminar pedido?")) return;
    try {
      const res = await fetchWithRefresh(`http://localhost:3000/pedidos/${id_delivery}`, { method: "DELETE" });
      if (res.status === 204 || res.ok) {
        setOrders((prev) => prev.filter((p) => p.id_delivery !== id_delivery));
        setSnack({ open: true, severity: "success", message: "Pedido eliminado" });
      } else {
        const err = await res.json();
        setSnack({ open: true, severity: "error", message: err.error || "Error al eliminar" });
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: "error", message: "Error de red" });
    }
  };

  const openCreate = () => { setForm(emptyForm); setIsEditing(false); setCreateOpen(true); };

  const openEdit = (order) => {
    // map numbers to strings for inputs
    const mapped = {
      ...order,
      id_delivery: order.id_delivery,
      id_provider: order.id_provider,
      id_user: order.id_user,
      products: (order.products || []).map(p => ({ ...p })),
      total_price: order.total_price || 0,
      address: order.address || emptyForm.address,
      status: order.status || 'En transito'
    };
    setForm(mapped);
    setIsEditing(true);
    setCreateOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    // basic validation
    if (!form.id_delivery || !form.id_user || !Array.isArray(form.products) || form.products.length === 0) {
      setSnack({ open: true, severity: 'error', message: 'id_delivery, id_user y al menos 1 producto son obligatorios' });
      return;
    }

    const payload = {
      ...form,
      id_delivery: Number(form.id_delivery),
      id_provider: Number(form.id_provider || 0),
      id_user: Number(form.id_user),
      products: form.products.map(p => ({ id_product: Number(p.id_product), quantity: Number(p.quantity), unit_price: Number(p.unit_price) })),
      total_price: Number(form.total_price || 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        // update by id_delivery
        const res = await fetchWithRefresh(`http://localhost:3000/pedidos/${form.id_delivery}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'update failed'); }
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id_delivery === updated.id_delivery ? updated : o));
        setSnack({ open: true, severity: 'success', message: 'Pedido actualizado' });
      } else {
        const res = await fetchWithRefresh('http://localhost:3000/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.status !== 201 && !res.ok) { const err = await res.json(); throw new Error(err.error || 'create failed'); }
        const created = await res.json();

        await fetchOrders();
        setSnack({ open: true, severity: 'success', message: 'Pedido creado' });
      }
      setCreateOpen(false);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: 'error', message: String(err.message || 'Error') });
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Pedidos', 10, 12);
    let y = 20;
    filtered.slice(0, 200).forEach((o) => {
      doc.text(`ID: ${o.id_delivery} | Usuario: ${o.id_user} | Total: $${o.total_price} | Status: ${o.status}`, 10, y);
      y += 8;
      if (y > 280) { doc.addPage(); y = 20; }
    });
    doc.save('pedidos.pdf');
  };

  const addProductRow = () => setForm(f => ({ ...f, products: [...(f.products||[]), { id_product: '', quantity: '', unit_price: '' }] }));
  const removeProductRow = (i) => setForm(f => ({ ...f, products: f.products.filter((_,idx)=>idx!==i) }));
  const updateProductField = (i, field, value) => setForm(f => ({ ...f, products: f.products.map((p,idx)=> idx===i ? { ...p, [field]: value } : p) }));

  
  const chipColor = (status) => {
    switch (status) {
      case 'En transito': return 'info';
      case 'Entregado': return 'success';
      case 'Cancelado': return 'error';
      default: return 'default';
    }
  };

 
  const visible = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
   
    <ThemeProvider theme={theme}>
      <Header/>
      <Paper sx={{ minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h6">Pedidos</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton color="inherit" onClick={handleDownloadPDF}><Download /></IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box p={isSm ? 2 : 4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Panel de pedidos</Typography>
          </Box>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField fullWidth label="Buscar por ID o ciudad" size="small" value={search} onChange={(e)=>{ setSearch(e.target.value); setPage(0); }} InputProps={{ startAdornment: <Search size={18} /> }} />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Estado</InputLabel>
                    <Select value={statusFilter} label="Estado" onChange={(e)=>{ setStatusFilter(e.target.value); setPage(0); }}>
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="En transito">En tránsito</MenuItem>
                      <MenuItem value="Entregado">Entregado</MenuItem>
                      <MenuItem value="Cancelado">Cancelado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Rows</InputLabel>
                    <Select value={rowsPerPage} label="Rows" onChange={(e)=>{ handleChangeRowsPerPage(e); }}>
                      <MenuItem value={5}>5</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography sx={{ color: 'text.secondary' }}>{filtered.length} resultados</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Delivery</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Usuario</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6}>Cargando...</TableCell></TableRow>
                  ) : visible.length === 0 ? (
                    <TableRow><TableCell colSpan={6}>No hay pedidos</TableCell></TableRow>
                  ) : visible.map((o) => (
                    <TableRow key={o.id_delivery} hover>
                      <TableCell>INV-{o.id_delivery}</TableCell>
                      <TableCell>{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</TableCell>
                      <TableCell><Chip label={o.status} color={chipColor(o.status)} size="small" /></TableCell>
                      <TableCell>{o.id_user}</TableCell>
                      <TableCell>${o.total_price}</TableCell>
                      <TableCell align="right">
                        <IconButton onClick={() => { setDetailOrder(o); }}><Edit2 size={18} /></IconButton>
                        <IconButton onClick={() => handleDelete(o.id_delivery)}><Trash2 size={18} color="red" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5,10,20]}
              />
            </CardContent>
          </Card>

          {/* Detail dialog */}
          <Dialog open={!!detailOrder} onClose={()=>setDetailOrder(null)} maxWidth="md" fullWidth>
            <DialogTitle>Detalle Pedido</DialogTitle>
            <DialogContent>
              {detailOrder && (
                <Box>
                  <Typography>ID: {detailOrder.id_delivery}</Typography>
                  <Typography>Status: {detailOrder.status}</Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">Productos</Typography>
                  {detailOrder.products?.map((p,i)=> (
                    <Box key={i} sx={{ p:1 }}>
                      <Typography>Producto {p.id_product} — qty: {p.quantity} — ${p.unit_price}</Typography>
                    </Box>
                  ))}
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1">Dirección</Typography>
                  {Object.entries(detailOrder.address||{}).map(([k,v]) => (<Typography key={k}>{k}: {v}</Typography>))}
                  <Box sx={{ mt:2 }}>
                    <Button variant="contained" onClick={()=>{ openEdit(detailOrder); setDetailOrder(null); }}>Editar</Button>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>setDetailOrder(null)}>Cerrar</Button>
            </DialogActions>
          </Dialog>

          {/* Create / Edit Dialog */}
          <Dialog open={createOpen} onClose={()=>setCreateOpen(false)} maxWidth="lg" fullWidth>
            <DialogTitle>{isEditing ? 'Editar pedido' : 'Crear pedido'}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={3}><TextField fullWidth label="id_delivery" value={form.id_delivery} onChange={e=>setForm(f=>({...f, id_delivery: e.target.value}))} /></Grid>
                <Grid item xs={12} sm={3}><TextField fullWidth label="id_provider" value={form.id_provider} onChange={e=>setForm(f=>({...f, id_provider: e.target.value}))} /></Grid>
                <Grid item xs={12} sm={3}><TextField fullWidth label="id_user" value={form.id_user} onChange={e=>setForm(f=>({...f, id_user: e.target.value}))} /></Grid>
                <Grid item xs={12} sm={3}><TextField fullWidth label="total_price" value={form.total_price} onChange={e=>setForm(f=>({...f, total_price: e.target.value}))} /></Grid>

                <Grid item xs={12}><Typography variant="subtitle1">Productos</Typography></Grid>
                {form.products.map((p,i)=> (
                  <React.Fragment key={i}>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="id_product" value={p.id_product} onChange={e=>updateProductField(i,'id_product',e.target.value)} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="quantity" value={p.quantity} onChange={e=>updateProductField(i,'quantity',e.target.value)} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="unit_price" value={p.unit_price} onChange={e=>updateProductField(i,'unit_price',e.target.value)} /></Grid>
                    <Grid item xs={12} sm={3}><Button color="error" onClick={()=>removeProductRow(i)}>Eliminar</Button></Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={12}><Button onClick={addProductRow}>Añadir producto</Button></Grid>

                <Grid item xs={12}><Typography variant="subtitle1">Dirección</Typography></Grid>
                {Object.keys(form.address).map((k)=> (
                  <Grid item xs={12} sm={6} key={k}><TextField fullWidth label={k} value={form.address[k]} onChange={e=>setForm(f=>({...f, address:{...f.address, [k]: e.target.value}}))} /></Grid>
                ))}

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Estado</InputLabel>
                    <Select value={form.status} label="Estado" onChange={e=>setForm(f=>({...f, status: e.target.value}))}>
                      <MenuItem value={'En transito'}>En tránsito</MenuItem>
                      <MenuItem value={'Entregado'}>Entregado</MenuItem>
                      <MenuItem value={'Cancelado'}>Cancelado</MenuItem>
                      <MenuItem value={'Pendiente'}>Pendiente</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>setCreateOpen(false)}>Cancelar</Button>
              <Button variant="contained" onClick={handleCreateOrUpdate}>{isEditing ? 'Guardar' : 'Crear'}</Button>
            </DialogActions>
          </Dialog>

          <Snackbar open={snack.open} autoHideDuration={4000} onClose={()=>setSnack(s=>({...s, open:false}))}>
            <Alert onClose={()=>setSnack(s=>({...s, open:false}))} severity={snack.severity} sx={{ width: '100%' }}>{snack.message}</Alert>
          </Snackbar>

        </Box>
      </Paper>
    </ThemeProvider>
  );
}
