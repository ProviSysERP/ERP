import { useEffect, useState } from "react";   
import { Card, CardMedia, Box, Typography, Button } from "@mui/material";

export default function Producto(){
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:3000/productos")
        .then((response) => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then((jsonData) => {
            setProducts(jsonData);
            setError(null);
        })
        .catch((error) => setError(error.message))
        .finally(() => setIsLoading(false));
    }, []);
}