import {useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { Card, CardMedia, Box, Typography, Button } from "@mui/material";



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
            setProducts(jsonData);
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
    

  return (
        <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
        <IconButton sx={{ p: '10px' }} aria-label="menu">
            <MenuIcon />
        </IconButton>
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Buscar producto"
            inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton color="primary" sx={{ p: '10px' }} aria-label="directions">
            <DirectionsIcon />
        </IconButton>
        </Paper>
 
  );
}

