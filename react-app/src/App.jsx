import { Routes, Route } from 'react-router-dom'
import './App.css'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Header from './components/Header.jsx'
import Contactos from './pages/Contactos.jsx'
import Perfil from './pages/Perfil.jsx'
import Novedades from './pages/Novedades.jsx'
import Proveedores from './pages/Proveedores.jsx'
import Proveedor from './pages/Proveedor.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Productos from './pages/Productos.jsx'
import Producto from './pages/Producto.jsx'
import HistorialPedidos from './pages/HistorialPedidos.jsx'
import Home from './pages/Home.jsx'
import CartaProveedores from './components/CartaProveedores.jsx'
import Inventario from './pages/Inventario.jsx'
import Pedidos from './pages/Pedidos.jsx'
import Chat from './pages/Chat.jsx'

// --- IMPORTS PARA EL TEMA ---
import { ThemeProvider, CssBaseline } from "@mui/material"
import { createTheme } from "@mui/material/styles"  // ← FALTABA ESTO
import IconButton from "@mui/material/IconButton"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import { useMemo, useState, useEffect } from "react"
import { getDesignTokens } from "./components/theme.js"


function App() {
  const [mode, setMode] = useState("light")

  // Cargar tema guardado
  useEffect(() => {
    const saved = localStorage.getItem("themeMode")
    if (saved) setMode(saved)
  }, [])

  // Crear tema MUI dinámico
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light"
    setMode(newMode)
    localStorage.setItem("themeMode", newMode)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
      sx={{
     width: "100%",
     minHeight: "100vh",
      bgcolor: "background.default",
     color: "text.primary",
      transition: "background 0.3s ease"
      }}
      >

        <Container>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Register />} />

            {/* Rutas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Contactos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil/:id"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/novedades"
              element={
                <ProtectedRoute>
                  <Novedades />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proveedores"
              element={
                <ProtectedRoute>
                  <Proveedores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/proveedor/:id"
              element={
                <ProtectedRoute>
                  <Proveedor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contactos"
              element={
                <ProtectedRoute>
                  <Contactos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/productos"
              element={
                <ProtectedRoute>
                  <Productos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/producto/:id"
              element={
                <ProtectedRoute>
                  <Producto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cartaproveedores"
              element={
                <ProtectedRoute>
                  <CartaProveedores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pedidos"
              element={
                <ProtectedRoute>
                  <Pedidos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/historialpedidos"
              element={
                <ProtectedRoute>
                  <HistorialPedidos />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventario"
              element={
                <ProtectedRoute>
                  <Inventario />
                </ProtectedRoute>
              }
            />
            <Route
              path="/header"
              element={
                <ProtectedRoute>
                  <Header />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </Box>

      {/* --- BOTÓN FLOTANTE TEMA CLARO/OSCURO --- */}
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          bgcolor: "background.paper",
          boxShadow: 3,
          "&:hover": { opacity: 0.8 }
        }}
      >
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </ThemeProvider>
  )
}

export default App
