import React, { useState, useEffect } from 'react'; 
import Paper from '@mui/material/Paper';
import { Box, Typography, Container } from "@mui/material"; 
import Header from '../components/Header.jsx';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';


function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: '2020-01-05',
        customerId: '11091700',
        amount: 3,
      },
      {
        date: '2020-01-02',
        customerId: 'Anonymous',
        amount: 1,
      },
    ],
  };
}

function Row(props) {
 
  const { row } = props;
  const [open, setOpen] = useState(false); 

  return (
    
    <React.Fragment> 
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
          {row.name}
        </TableCell>
        <TableCell align="right">{row.calories}</TableCell>
        <TableCell align="right">{row.fat}</TableCell>
        <TableCell align="right">{row.carbs}</TableCell>
        <TableCell align="right">{row.protein}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history && row.history.map((historyRow) => ( 
                    <TableRow key={historyRow.date + historyRow.customerId}> 
                      <TableCell component="th" scope="row">
                        {historyRow.date}
                      </TableCell>
                      <TableCell>{historyRow.customerId}</TableCell>
                      <TableCell align="right">{historyRow.amount}</TableCell>
                      <TableCell align="right">
                        {Math.round(historyRow.amount * row.price * 100) / 100} 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};



export default function Pedidos() {

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("Cargando productos...");
        setIsLoading(true);

        fetch("http://localhost:3000/productos")
          .then((response) => {
            console.log("Response:", response);
            if (!response.ok) {
              throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
          })
          .then((jsonData) => {
            console.log("Datos recibidos:", jsonData);

            const formattedProducts = jsonData.map(p => 
                createData(p.name, p.calories, p.fat, p.carbs, p.protein, p.price)
            );
            
            setProducts(formattedProducts);
            setError(null);
          })
          .catch((error) => {
            console.error("Error al cargar producto:", error);
            setError(error.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, []);
    

    if (isLoading) {
        return (
            <Container>
                <Header/>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5">Cargando productos...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Header/>
                <Box sx={{ p: 3 }}>
                    <Typography color="error" variant="h5">Error al cargar datos: {error}</Typography>
                </Box>
            </Container>
        );
    }

    if (products.length === 0) {
      return (
            <Container>
                <Header/>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5">No se encontraron productos.</Typography>
                </Box>
            </Container>
        );
    }
  
    return (
        <Container>
            <Header/>
            <Box>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Nombre</TableCell>
                                <TableCell align="right">Proveedor</TableCell>
                                <TableCell align="right">Precio(€)</TableCell>
                                <TableCell align="right">Cantidad(unidad)</TableCell>
                                <TableCell align="right"></TableCell> {/*Añadir al carrito con la imagen que he puesto antes en el Headerrr*/}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((row) => ( 
                                <Row key={row.name} row={row} />
                                
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
}