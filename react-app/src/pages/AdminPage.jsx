import { useEffect, useState } from "react";
import { useAuth } from "../components/useAuth";
import { useNavigate } from "react-router-dom";
import { fetchWithRefresh } from "../components/fetchWithRefresh";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";

export default function AdminPage() {
  const { idUser, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  // MODALES
  const [usersOpen, setUsersOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [providersOpen, setProvidersOpen] = useState(false);
  const [editProviderOpen, setEditProviderOpen] = useState(false);

  const [users, setUsers] = useState([]);
  const [editUserData, setEditUserData] = useState(null);

  const [providers, setProviders] = useState([]);
  const [editProviderData, setEditProviderData] = useState(null);

  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!idUser) {
      navigate("/home");
      return;
    }

    const checkAdmin = async () => {
      const res = await fetchWithRefresh(`http://localhost:3000/usuarios/${idUser}/admin`);
      const data = await res.json();
      if (!data.admin) {
        navigate("/home");
      } else {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [loading, idUser]);

  // --------------------- USUARIOS ---------------------
  const loadUsers = async () => {
    const res = await fetchWithRefresh("http://localhost:3000/usuarios");
    const data = await res.json();
    setUsers(data);
    setUsersOpen(true);
  };

  const openEditUser = (u) => {
    setEditUserData({
      id_user: u.id_user,
      name: u.name || "",
      email: u.email || "",
      phone: u.phone || "",
      profile_picture: u.profile_picture || "",
      passwordHash: "",
      provider: u.provider || false,
      admin: u.admin || false,
      street: u.address?.street || "",
      city: u.address?.city || "",
      state: u.address?.state || "",
      postalcode: u.address?.postalcode ?? u.address?.postalCode ?? "",
      country: u.address?.country || "",
      notifications: u.preferences?.notifications ?? u.notifications ?? false,
    });
    setEditUserOpen(true);
  };

  const handleUserChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditUserData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUserSave = async () => {
    const payload = {
      name: editUserData.name,
      email: editUserData.email,
      phone: editUserData.phone,
      profile_picture: editUserData.profile_picture,
      provider: editUserData.provider,
      admin: editUserData.admin,
      street: editUserData.street,
      city: editUserData.city,
      state: editUserData.state,
      postalcode: editUserData.postalcode,
      country: editUserData.country,
      notifications: editUserData.notifications,
      passwordHash: editUserData.passwordHash || undefined,
    };

    try {
      const res = await fetchWithRefresh(`http://localhost:3000/usuarios/${editUserData.id_user}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id_user === updated.id_user ? updated : u)));
      setSnack({ open: true, message: "Usuario actualizado", severity: "success" });
      setEditUserOpen(false);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Error al actualizar usuario", severity: "error" });
    }
  };

  // --------------------- PROVEEDORES ---------------------
  const loadProviders = async () => {
    const res = await fetchWithRefresh("http://localhost:3000/proveedores");
    const data = await res.json();
    setProviders(data);
    setProvidersOpen(true);
  };

  const openEditProvider = (p) => {
    setEditProviderData({
      id_provider: p.id_provider,
      companyName: p.companyName || "",
      description: p.description || "",
      categories: p.categories || [],
      latitude: p.latitude || "",
      longitude: p.longitude || "",
      availability: p.availability || { open: "", close: "", days: [] },
      image: p.image || "",
      userId: p.userId || [],
    });
    setEditProviderOpen(true);
  };

  const handleProviderChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setEditProviderData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCategoryAdd = (cat) => {
    setEditProviderData((prev) => ({
      ...prev,
      categories: [...prev.categories, cat],
    }));
  };

  const handleCategoryRemove = (cat) => {
    setEditProviderData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== cat),
    }));
  };

  const handleAvailabilityChange = (key) => (e) => {
    const value = e.target.value;
    setEditProviderData((prev) => ({
      ...prev,
      availability: { ...prev.availability, [key]: value },
    }));
  };

  const handleAvailabilityDaysChange = (day) => {
    setEditProviderData((prev) => {
      const days = prev.availability.days.includes(day)
        ? prev.availability.days.filter((d) => d !== day)
        : [...prev.availability.days, day];
      return { ...prev, availability: { ...prev.availability, days } };
    });
  };

  const handleProviderSave = async () => {
    const payload = {
      companyName: editProviderData.companyName,
      description: editProviderData.description,
      categories: editProviderData.categories,
      latitude: parseFloat(editProviderData.latitude),
      longitude: parseFloat(editProviderData.longitude),
      availability: editProviderData.availability,
      image: editProviderData.image,
      userId: editProviderData.userId,
    };

    try {
      const res = await fetchWithRefresh(`http://localhost:3000/proveedores/${editProviderData.id_provider}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated = await res.json();
      setProviders((prev) =>
        prev.map((p) => (p.id_provider === updated.id_provider ? updated : p))
      );
      setSnack({ open: true, message: "Proveedor actualizado", severity: "success" });
      setEditProviderOpen(false);
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Error al actualizar proveedor", severity: "error" });
    }
  };

  if (loading || isAdmin === null) return <p>Cargando...</p>;

  return (
    <Box sx={{ p: 4 }}>
      <h1>Panel de Administrador</h1>
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={loadUsers}>
          Gestionar usuarios
        </Button>
        <Button variant="contained" onClick={loadProviders}>
          Gestionar proveedores
        </Button>
      </Box>

      {/* MODAL USUARIOS */}
      <Dialog open={usersOpen} onClose={() => setUsersOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Usuarios</DialogTitle>
        <DialogContent>
          {users.map((u) => (
            <Box
              key={u.id_user}
              sx={{ p: 1, borderBottom: "1px solid #ccc", cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
              onClick={() => openEditUser(u)}
            >
              {u.name} — {u.email}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUsersOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL EDITAR USUARIO */}
        <Dialog open={editUserOpen} onClose={() => setEditUserOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
            {editUserData && (
            <Box sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField label="Nombre" fullWidth value={editUserData.name} onChange={handleUserChange("name")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Email" fullWidth value={editUserData.email} onChange={handleUserChange("email")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Teléfono" fullWidth value={editUserData.phone} onChange={handleUserChange("phone")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="URL imagen" fullWidth value={editUserData.profile_picture} onChange={handleUserChange("profile_picture")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField label="Calle" fullWidth value={editUserData.street} onChange={handleUserChange("street")} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField label="Ciudad" fullWidth value={editUserData.city} onChange={handleUserChange("city")} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField label="Provincia/Estado" fullWidth value={editUserData.state} onChange={handleUserChange("state")} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField label="Código postal" fullWidth value={editUserData.postalcode} onChange={handleUserChange("postalcode")} />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField label="País" fullWidth value={editUserData.country} onChange={handleUserChange("country")} />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                    control={<Switch checked={editUserData.admin} onChange={handleUserChange("admin")} />}
                    label="Administrador"
                    />
                    <FormControlLabel
                    control={<Switch checked={editUserData.provider} onChange={handleUserChange("provider")} />}
                    label="Proveedor"
                    />
                    <FormControlLabel
                    control={<Switch checked={editUserData.notifications} onChange={handleUserChange("notifications")} />}
                    label="Notificaciones activadas"
                    />
                </Grid>
                </Grid>
            </Box>
            )}
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setEditUserOpen(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleUserSave}>Guardar</Button>
        </DialogActions>
        </Dialog>

      {/* MODAL PROVEEDORES */}
      <Dialog open={providersOpen} onClose={() => setProvidersOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Proveedores</DialogTitle>
        <DialogContent>
          {providers.map((p) => (
            <Box
              key={p.id_provider}
              sx={{ p: 1, borderBottom: "1px solid #ccc", cursor: "pointer", "&:hover": { backgroundColor: "#f0f0f0" } }}
              onClick={() => openEditProvider(p)}
            >
              {p.companyName} — {p.description}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProvidersOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL EDITAR PROVEEDOR */}
      <Dialog open={editProviderOpen} onClose={() => setEditProviderOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Editar Proveedor</DialogTitle>
        <DialogContent>
          {editProviderData && (
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Nombre empresa" fullWidth value={editProviderData.companyName} onChange={handleProviderChange("companyName")} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Descripción" fullWidth value={editProviderData.description} onChange={handleProviderChange("description")} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Categorías (separadas por coma)"
                    fullWidth
                    value={editProviderData.categories.join(",")}
                    onChange={(e) => setEditProviderData((prev) => ({
                      ...prev,
                      categories: e.target.value.split(",").map((c) => c.trim())
                    }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Latitud" fullWidth value={editProviderData.latitude} onChange={handleProviderChange("latitude")} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Longitud" fullWidth value={editProviderData.longitude} onChange={handleProviderChange("longitude")} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Apertura" fullWidth value={editProviderData.availability.open} onChange={handleAvailabilityChange("open")} />
                </Grid>
                <Grid item xs={6}>
                  <TextField label="Cierre" fullWidth value={editProviderData.availability.close} onChange={handleAvailabilityChange("close")} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="URL imagen" fullWidth value={editProviderData.image} onChange={handleProviderChange("image")} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="User IDs (separados por coma)" fullWidth
                    value={editProviderData.userId.join(",")}
                    onChange={(e) => setEditProviderData(prev => ({ ...prev, userId: e.target.value.split(",").map(n => parseInt(n.trim())) }))}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditProviderOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleProviderSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}