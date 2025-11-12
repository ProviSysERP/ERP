import { useEffect, useState } from "react";   
import React from "react";
import Slider from "react-slick";
import { Card, CardMedia, Box, Typography, Button, Container } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const slides = [
  { 
    title: "Refresca tu espíritu navideño con Coca-Cola",
    subtitle: "Participa y podrás ganar una experiencia mágica",
    image: "/path/to/your-image.jpg"
  },
];

export default function PromoCarousel() {

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
            console.error("Error al cargar productos:", error);
            setError(error.message);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }, []);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    appendDots: dots => (
      <Box sx={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)" }}>
        <ul style={{ margin: 0 }}>{dots}</ul>
      </Box>
    ),
  };

  return (
    <Slider {...settings}>
      {slides.map((s, i) => (
        <Box key={i} sx={{ px: 2 }}>
          <Card sx={{ borderRadius: 3, overflow: "hidden", position: "relative", minHeight: 420 }}>
            <CardMedia
              component="img"
              image={s.image}
              alt={s.name}
              sx={{ height: 420, width: "100%", objectFit: "cover", filter: "brightness(0.75)" }}
            />

            {/* Contenido en overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "55%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                p: 4,
              }}
            >
              <Typography variant="h3" component="h2" sx={{ color: "common.white", fontWeight: 700, mb: 1 }}>
                {s.name}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: "common.white", mb: 3 }}>
                {s.description}
              </Typography>
              <Button variant="contained" size="large" sx={{ width: 220, borderRadius: 8 }}>
                DESCUBRE MÁS
              </Button>
            </Box>
          </Card>
        </Box>
      ))}
    </Slider>
  );
}
