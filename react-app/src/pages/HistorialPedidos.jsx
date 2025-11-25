import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import Header from "../components/Header.jsx";
import { obtenerUsuario } from "../components/ObtenerUsuario.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const HistorialPedidos = () => {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setIsLoading(true);
      try {
        const user = await obtenerUsuario();
        if (!user) {
          setError("No se pudo obtener el usuario.");
          setIsLoading(false);
          return;
        }
        setUsuario(user);

        const res = await fetch("http://localhost:3000/pedidos");
        if (!res.ok) throw new Error("Error al cargar pedidos");

        const data = await res.json();
        const userPedidos = data.filter((p) => p.id_user === user.id_user);
        setPedidos(userPedidos);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al cargar pedidos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  // Función para descargar PDF
  const descargarPDF = () => {
  if (!pedidos || pedidos.length === 0) {
    alert("No hay pedidos para descargar.");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Historial de Pedidos", 14, 20);

  const tableData = pedidos.map(pedido => [
    pedido.provider_name || "",
    pedido.products?.map(p => p.product_name).join(", ") || "",
    (pedido.total_price?.toFixed(2) || "0.00") + " €",
    pedido.status || "",
  ]);

  autoTable(doc, {
    head: [["Proveedor", "Productos", "Total", "Estado"]],
    body: tableData,
    startY: 30,
  });

  doc.save("historial_pedidos.pdf");
};
  // Eliminar pedido
  const handleEliminarPedido = async (pedidoId) => {
    if (!window.confirm("¿Deseas eliminar este pedido?")) return;
    try {
      const res = await fetch(`http://localhost:3000/pedidos/${pedidoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error eliminando pedido");
      setPedidos((prev) => prev.filter((p) => p._id !== pedidoId));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el pedido");
    }
  };

  // Cambiar estado del pedido
  const handleCambioEstado = async (pedidoId, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:3000/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nuevoEstado }),
      });
      if (!res.ok) throw new Error("Error actualizando estado");
      setPedidos((prev) =>
        prev.map((p) =>
          p._id === pedidoId ? { ...p, status: nuevoEstado } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el estado");
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header />
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Box
        sx={{
          mt: 2,
          mb: 2,
          p: 2,
          backgroundColor: "#1976d2",
          borderRadius: 1,
          color: "#fff",
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Historial de pedidos</Typography>
          <Button variant="contained" onClick={descargarPDF}>
            Descargar PDF
          </Button>
        </Stack>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Proveedor</TableCell>
                <TableCell>Productos</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay pedidos realizados
                  </TableCell>
                </TableRow>
              ) : (
                pedidos.map((pedido) => (
                  <TableRow key={pedido._id}>
                    <TableCell>{pedido.provider_name}</TableCell>
                    <TableCell>
                      {pedido.products.map((prod) => prod.product_name).join(", ")}
                    </TableCell>
                    <TableCell>{pedido.total_price.toFixed(2)} €</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <Select
                          value={pedido.status}
                          onChange={(e) =>
                            handleCambioEstado(pedido._id, e.target.value)
                          }
                        >
                          <MenuItem value="Pendiente">Pendiente</MenuItem>
                          <MenuItem value="En tránsito">En tránsito</MenuItem>
                          <MenuItem value="Entregado">Entregado</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        onClick={() => handleEliminarPedido(pedido._id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default HistorialPedidos;
