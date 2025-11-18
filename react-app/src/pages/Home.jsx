import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Alert, Button, CardMedia, CardContent, CardActions, Card  }  from '@mui/material';
import Novedades from './Novedades.jsx'
import CartaProveedores from "../components/CartaProveedores.jsx";
import { Routes, Route } from 'react-router-dom'
import Header from '../components/Header.jsx'

const Home = () => {
    return (
        <Container>
            <Novedades/>
            <Container>
                <h1>PROVEEDORES</h1>
                <CartaProveedores/>
            </Container>
            
        </Container>
    );
}
export default Home;