import { useEffect, useState } from "react";   
import React from "react";
import Slider from "react-slick";
import { Card, CardMedia, Box, Typography, Button, Container } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';
import "./Novedades.css";


const slides = [

];

export default function PromoCarousel() {

    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      console.log("Cargando posts...");
      setIsLoading(true);
  
      fetch("http://localhost:3000/posts")
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
          console.error("Error al cargar posts:", error);
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

  const data = products && products.length ? products : slides;

  return (
    <Slider {...settings}>
      {data.map((s, i) => {
        const imageUrl =
          (s.images && s.images.length && s.images[0]) || "/placeholder.jpg";

        const title = s.title || "";
        const content = s.content ||"";

        return (
          <Box key={i} className="slide-box">
            <Card className="novedad-card" sx={{ display: 'flex', alignItems: 'stretch' }}>
              {/* Imagen a la izquierda */}
              <CardMedia
                component="img"
                image={imageUrl}
                alt={title}
                className="novedad-img"
                sx={{ width: { xs: '40%', sm: '45%', md: '50%' }, minWidth: 180, objectFit: 'cover' }}
              />

              {/* Contenido a la derecha */}
              <Box
                sx={{
                  width: { xs: '60%', sm: '55%', md: '50%' },
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: { xs: 2, sm: 4 },
                  gap: 2,
                }}
              >
                <Typography variant="h3" component="h2" className="novedad-title">
                  {title}
                </Typography>
                <Typography className="novedad-content">
                  {content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" size="large" className="novedad-button">
                    DESCUBRE MÁS
                  </Button>
                </Box>
              </Box>
            </Card>
          </Box>
        );
      })}
    </Slider>
  );
}