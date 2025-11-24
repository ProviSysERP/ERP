import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, Box, Typography, Card, CardContent, Grid, Avatar, Button, Divider, List, ListItem, ListItemIcon, ListItemText,
} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import PeopleIcon from "@mui/icons-material/People";

const theme = createTheme({
  palette: {
    primary: { main: "#0f62fe" },
    secondary: { main: "#7c4dff" },
    background: { default: "#fbfdff" },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

export default function AboutUs() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", py: 8, px: 2, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          <Card
            elevation={6}
            sx={{
              overflow: "hidden",
              borderRadius: 3,
              mb: 4,
              color: "common.white",
              background: "linear-gradient(135deg, #0f62fe 0%, #7c4dff 100%)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Grid container spacing={2} alignItems="center">

                <Grid item xs>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    NovaTechZeo
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    ¿Quiénes somos?
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body1" paragraph>
                    Somos <strong>NovaTechZeo</strong>. , una empresa de Desarrollo de Software 
                    orientada a dar soluciones digitales a problemas reales que surgen en empresas 
                    de todos tipos y orientaciones.

                  </Typography>

                  <Typography variant="body2" paragraph>
                    Trabajamos con equipos de todos los tamaños y buscamos tener una relación cercana con ellos: escuchar,
                    proponer y entregar soluciones claras.
                  </Typography>

                  <List disablePadding>
                    <ListItem>
                      <ListItemIcon>
                        <BusinessCenterIcon />
                      </ListItemIcon>
                      <ListItemText primary="Proyectos a medida" secondary="Nos adaptamos a tu flujo de trabajo" />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Comunicación abierta" secondary="Te mantenemos al día en cada paso" />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <SyncAltIcon />
                      </ListItemIcon>
                      <ListItemText primary="Integraciones útiles" secondary="Conecta tus herramientas sin líos" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    ¿Qué es ProviSys?
                  </Typography>

                  <Divider sx={{ mb: 2 }} />

                  <Typography variant="body1" paragraph>
                  <strong>ProviSys</strong> es un ERP (Enterprise Resource Planning), 
                  creado por <strong>NovaTechZeo</strong>; este proyecto nace con el objetivo de ayudar 
                  a expandir negocios en el sector de la hostelería, además de querer facilitar las 
                  herramientas necesarias para lograr una mejor comunicación entre empresa-proveedor, 
                  y viceversa.
                  </Typography>

                  <Typography variant="body2" paragraph>
                    Lo diseñamos para que sea claro: vistas sencillas, acciones rápidas y datos que
                    realmente te ayudan a tomar decisiones para crecer como empresa.
                  </Typography>

                  <List disablePadding>
                    <ListItem>
                      <ListItemIcon>
                        <RestaurantMenuIcon />
                      </ListItemIcon>
                      <ListItemText primary="Hecho para hostelería" secondary="Funciones pensadas para el sector de la hostelería." />
                    </ListItem>

                    <ListItem>
                      <ListItemIcon>
                        <SyncAltIcon />
                      </ListItemIcon>
                      <ListItemText primary="Comunicación empresa ↔ proveedor" secondary="Sistema de chat para mantener la comunicación y apartado interactivo para pedidos..." />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}