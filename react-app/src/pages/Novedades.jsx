import { useEffect, useState } from "react";   
import React from "react";
import Slider from "react-slick";
import { Card, CardMedia, Box, Typography, Button } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Novedades.css";

const slides = [
  {
    title: "Refresca tu espíritu navideño con Coca-Cola",
    content: "Participa y podrás ganar una experiencia mágica",
    image: "/path/to/your-image.jpg",
  },
];

export default function PromoCarousel() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:3000/posts")
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

  const settings = {
    dots: true,            
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,        
    autoplaySpeed: 8500,   
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  const data = products && products.length ? products : slides;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',     
        justifyContent: 'flex-start',
        pt: 6, 
        bgcolor: '#f5f7fa',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: 960 }}>
          <Slider {...settings}>
            {data.map((s, i) => {
              const imageUrl = (s.images && s.images.length && s.images[0]) || s.image || '/placeholder.jpg';
              const title = s.title || '';
              const content = s.content || '';

              return (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'center', px: 2 }}>
                  <Card
                    sx={{
                      width: 920,
                      height: 420,
                      borderRadius: 2.5,
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      boxShadow: '0 10px 30px rgba(18,20,30,0.08)',
                      bgcolor: '#fff',
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={title}
                      sx={{
                        width: '48%',
                        height: '100%',
                        objectFit: 'cover',
                        flexShrink: 0,
                        filter: 'brightness(0.88)',
                      }}
                    />

                    <Box
                      sx={{
                        width: '52%',
                        height: '100%',
                        position: 'relative',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box sx={{ flex: '1 1 auto', overflow: 'hidden' }}>
                        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, fontSize: '1.6rem', color: '#111216', mb: 1 }}>
                          {title}
                        </Typography>
                        <Typography sx={{ color: '#33363a', fontSize: '1rem', lineHeight: 1.6 }}>
                          {content}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        size="large"
                        sx={{
                          position: 'absolute',
                          bottom: 24,
                          right: 28,
                          width: 190,
                          height: 44,
                          borderRadius: 1.25,
                          background: 'linear-gradient(180deg, #0a66c2 0%, #0754a8 100%)',
                          boxShadow: '0 6px 18px rgba(10,102,194,0.18)',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          letterSpacing: '.6px',
                        }}
                      >
                        DESCUBRE MÁS
                      </Button>
                    </Box>
                  </Card>
                </Box>
              );
            })}
          </Slider>
        </Box>
      </Box>
    </Box>
  );
}