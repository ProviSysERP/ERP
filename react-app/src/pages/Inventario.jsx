// src/pages/InventarioProveedor.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Add, Remove, Delete, LocalShipping } from '@mui/icons-material';

export default function InventarioProveedor({ providerId }) {
  // si no pasas providerId por props usa fijo (solo para pruebas)
  const PROVIDER_ID = providerId ?? 1;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [newItem, setNewItem] = useState({ id_product: '', quantity: 1, unit_price: 0 });
  const [snack, setSnack] = useState({ open: false, severity: 'success', message: '' });

  useEffect(() => {
    fetchItems();
  }, [PROVIDER_ID]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/inventario/porProveedor/${PROVIDER_ID}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: 'error', message: 'Error cargando inventario' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddOpen = () => { setNewItem({ id_product: '', quantity: 1, unit_price: 0 }); setOpenAdd(true); };
  const handleAddSave = async () => {
    // basic validation
    if (!newItem.id_product || Number(newItem.quantity) <= 0) {
      setSnack({ open: true, severity: 'error', message: 'Campos inválidos' });
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/inventario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_provider: PROVIDER_ID,
          id_product: Number(newItem.id_product),
          quantity: Number(newItem.quantity),
          unit_price: Number(newItem.unit_price)
        })
      });
      if (!res.ok) throw new Error('Error');
      await fetchItems();
      setOpenAdd(false);
      setSnack({ open: true, severity: 'success', message: 'Producto añadido/actualizado' });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: 'error', message: 'Error al añadir' });
    }
  };

  const adjustQty = async (id, delta) => {
    try {
      const res = await fetch(`http://localhost:3000/inventario/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta })
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error || 'Error');
      }
      const updated = await res.json();
      setItems(prev => prev.map(it => it._id === updated._id ? updated : it));
      setSnack({ open: true, severity: 'success', message: 'Stock actualizado' });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: 'error', message: err.message || 'Error actualizar' });
    }
  };

  const removeItem = async (id) => {
    if (!confirm('Eliminar item?')) return;
    try {
      const res = await fetch(`http://localhost:3000/inventario/${id}`, { method: 'DELETE' });
      if (res.status === 204) {
        setItems(prev => prev.filter(i => i._id !== id));
        setSnack({ open: true, severity: 'success', message: 'Item eliminado' });
      } else {
        const e = await res.json();
        setSnack({ open: true, severity: 'error', message: e.error || 'Error' });
      }
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: 'error', message: 'Error al eliminar' });
    }
  };

  // Simular venta: crea pedido (backend se encargará de decrementar stock)
  const simulateSale = async (productList) => {
    // productList example: [{ id_product: 1, quantity: 2, unit_price: 3 }]
    try {
      const res = await fetch('http://localhost:3000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_provider: PROVIDER_ID,
          id_user: 0, // id_user del cliente (0 o 1 para pruebas); adapta según tu app
          products: productList,
          total_price: productList.reduce((s,p) => s + (p.unit_price * p.quantity), 0),
          address: { street: 'Punto de venta', city: 'Ciudad' },
          status: 'Enviado'
        })
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Error creando pedido');
      // éxito: recarga inventario
      await fetchItems();
      setSnack({ open: true, severity: 'success', message: 'Venta registrada y stock actualizado' });
    } catch (err) {
      console.error(err);
      setSnack({ open: true, severity: 'error', message: err.message || 'Error venta' });
    }
  };

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h2>Inventario proveedor #{PROVIDER_ID}</h2>
        <Box>
          <Button variant="contained" onClick={handleAddOpen}>Añadir producto</Button>
        </Box>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio unit.</TableCell>
              <TableCell>Últ. actualización</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}>Cargando...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={5}>No hay productos</TableCell></TableRow>
            ) : items.map(it => (
              <TableRow key={it._id}>
                <TableCell>{it.id_product}</TableCell>
                <TableCell>{it.quantity}</TableCell>
                <TableCell>{it.unit_price}</TableCell>
                <TableCell>{new Date(it.updatedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => adjustQty(it._id, +1)}><Add /></IconButton>
                  <IconButton onClick={() => adjustQty(it._id, -1)}><Remove /></IconButton>
                  <IconButton onClick={() => removeItem(it._id)}><Delete /></IconButton>
                  <Button size="small" startIcon={<LocalShipping />} onClick={() => simulateSale([{ id_product: it.id_product, quantity: 1, unit_price: it.unit_price }])}>Vender 1</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Dialog Añadir */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Añadir producto al inventario</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} mt={1}>
            <TextField label="ID producto" value={newItem.id_product} onChange={e => setNewItem(n => ({ ...n, id_product: e.target.value }))} />
            <TextField label="Cantidad" type="number" value={newItem.quantity} onChange={e => setNewItem(n => ({ ...n, quantity: e.target.value }))} />
            <TextField label="Precio unit." type="number" value={newItem.unit_price} onChange={e => setNewItem(n => ({ ...n, unit_price: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
