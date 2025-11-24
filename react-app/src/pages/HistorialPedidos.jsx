import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Stack
} from "@mui/material";
import { jsPDF } from "jspdf";
import Header from "../components/Header.jsx";
import { fetchWithRefresh } from "../components/fetchWithRefresh";

export default function HistorialPedidos() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchWithRefresh("http://localhost:3000/pedidos")
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setHistorial(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Historial de Pedidos", 14, 20);

    let y = 30;
    historial.forEach((pedido, index) => {
      doc.setFontSize(12);
      doc.text(`Pedido #${pedido.id || index + 1}`, 14, y);
      y += 6;
      doc.text(`Proveedor: ${pedido.id_provider || "N/D"}`, 14, y);
      y += 6;
      doc.text(`Usuario: ${pedido.user_name || "N/D"}`, 14, y);
      y += 6;
      doc.text(`Total: ${pedido.total_price?.toFixed(2) || 0} €`, 14, y);
      y += 6;
      doc.text("Productos:", 14, y);
      y += 6;
      pedido.products.forEach((prod) => {
        doc.text(
          ` - ${prod.product_name} x ${prod.quantity} (${prod.unit_price?.toFixed(2) || 0} €/ud)`,
          18,
          y
        );
        y += 6;
      });
      y += 4;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("historial_pedidos.pdf");
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header />
        <Box sx={{ p: 3 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Header />

      {/* Cabecera con recuadro */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1976d2", // color de cabecera, azul MUI
          color: "white",
          px: 3,
          py: 2,
          borderRadius: 1,
          mt: 3,
          mb: 2,
        }}
      >
        <Typography variant="h5">Historial de Pedidos</Typography>
        <Button variant="contained" onClick={handleDownloadPDF}>
          Descargar PDF
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Pedido</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Total (€)</TableCell>
              <TableCell>Productos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historial.map((pedido, index) => (
              <TableRow key={pedido.id || index}>
                <TableCell>{pedido.id || index + 1}</TableCell>
                <TableCell>{pedido.id_provider || "N/D"}</TableCell>
                <TableCell>{pedido.user_name || "N/D"}</TableCell>
                <TableCell>{pedido.total_price?.toFixed(2) || 0}</TableCell>
                <TableCell>
                  {pedido.products
                    .map(
                      (prod) =>
                        `${prod.product_name} x${prod.quantity} (${prod.unit_price?.toFixed(
                          2
                        )} €/ud)`
                    )
                    .join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
