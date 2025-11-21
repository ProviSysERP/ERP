import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, CardMedia, Button, CircularProgress, Alert, Chip,Box, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Switch, FormControlLabel, Snackbar, IconButton,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import Header from "../components/Header.jsx";
import { fetchWithRefresh } from "../components/fetchWithRefresh";


export default function Perfil() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    profile_picture: "",
    provider: false,
    admin: false,
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const pullProviders = async (userId) => {
    try {
      const res = await fetchWithRefresh(`http://localhost:3000/proveedores/porUser/${userId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("No se pudo cargar proveedor:", err);
      return null;
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchWithRefresh(`http://localhost:3000/usuarios/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(async (data) => {
        setUser(data);
        setError(null);

        setForm((f) => ({
          ...f,
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          profile_picture: data.profile_picture || "",
          provider: !!data.provider,
          admin: !!data.admin,
          street: data.address?.street || "",
          city: data.address?.city || "",
          state: data.address?.state || "",
          postalCode: data.address?.postalCode || data.address?.postal_code || "",
          country: data.address?.country || "",
        }));

        if (data.provider === true) {
          const prov = await pullProviders(data.id_user ?? data._id);
          if (prov) setProvider(prov);
        } else {
          setProvider(null);
        }
      })
      .catch((err) => {
        console.error("Error al cargar usuario:", err);
        setError(err.message || "Error al cargar usuario");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const openEdit = () => setEditOpen(true);
  const closeEdit = () => setEditOpen(false);

  const handleFormChange = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const readResponseBody = async (res) => {
    try {
      const json = await res.json();
      return JSON.stringify(json);
    } catch {
      try {
        return await res.text();
      } catch {
        return `HTTP ${res.status}`;
      }
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setSnack({ open: true, message: "Necesitamos nombre y correo.", severity: "warning" });
      return;
    }
    if (!isValidEmail(form.email)) {
      setSnack({ open: true, message: "Correo no válido.", severity: "warning" });
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || "",
      profile_picture: form.profile_picture || "",
      provider: !!form.provider,
      admin: !!form.admin,
      address: {
        street: form.street || "",
        city: form.city || "",
        state: form.state || "",
        postalCode: form.postalCode || "",
        country: form.country || "",
      },
    };

    const looksLikeObjectId = (v) => typeof v === "string" && /^[0-9a-fA-F]{24}$/.test(v);
    const candidateIds = [
      ...(user && looksLikeObjectId(user._id) ? [user._id] : []),
      ...(user && user.id_user ? [user.id_user] : []),
      ...(id ? [id] : []),
    ].filter(Boolean);

    setSnack({ open: true, message: "Actualizando...", severity: "info" });

    const doRequest = async (url, method) => {
      try {
        const res = await fetchWithRefresh(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return res;
      } catch (err) {
        throw err;
      }
    };

    try {
      let lastErr = null;

      for (const cid of candidateIds) {
        const url = `http://localhost:3000/usuarios/${cid}`;

        const putRes = await doRequest(url, "PUT");
        if (putRes.ok) {
          const updated = await putRes.json();
          setUser(updated);
          setSnack({ open: true, message: "Cambios guardados.", severity: "success" });
          setEditOpen(false);
          return;
        }

        const putBody = await readResponseBody(putRes);

        if (putRes.status === 404) {
          const patchRes = await doRequest(url, "PATCH");
          if (patchRes.ok) {
            const updated = await patchRes.json();
            setUser(updated);
            setSnack({ open: true, message: "Cambios guardados.", severity: "success" });
            setEditOpen(false);
            return;
          }
          const patchBody = await readResponseBody(patchRes);
          lastErr = { status: patchRes.status, body: patchBody, url };
          continue; 
        }

        lastErr = { status: putRes.status, body: putBody, url };
        break;
      }

      if (lastErr) {
        console.error("Error actualización:", lastErr);
        let userMsg = "No se pudo actualizar. Comprueba los datos.";
        try {
          const parsed = JSON.parse(lastErr.body);
          if (parsed && parsed.error) userMsg = parsed.error;
        } catch {}
        setSnack({ open: true, message: userMsg, severity: "error" });
      } else {
        setSnack({ open: true, message: "No se encontró un identificador válido.", severity: "error" });
      }
    } catch (err) {
      console.error("Excepción al actualizar:", err);
      setSnack({ open: true, message: "Error inesperado al guardar.", severity: "error" });
    }
  };

  const openDelete = () => setDeleteOpen(true);
  const closeDelete = () => setDeleteOpen(false);

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetchWithRefresh(`http://localhost:3000/usuarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSnack({ open: true, message: "Usuario eliminado.", severity: "success" });
      setDeleteOpen(false);
      setTimeout(() => navigate("/contactos"), 600);
    } catch (err) {
      console.error("Error al eliminar:", err);
      setSnack({ open: true, message: "No se pudo eliminar.", severity: "error" });
    }
  };

  if (isLoading)
    return (
      <Container sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Container>
    );

  if (error)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Error al cargar: {error}</Alert>
      </Container>
    );

  if (!user)
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="info">Usuario no encontrado.</Alert>
      </Container>
    );

  return (
    <Container sx={{ py: 4 }}>
      <Header />

      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
        <Button onClick={() => navigate(-1)} variant="outlined">
          ← Volver
        </Button>

        <Button variant="contained" startIcon={<EditIcon />} onClick={openEdit} sx={{ ml: 1 }}>
          Editar
        </Button>

        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={openDelete} sx={{ ml: 1 }}>
          Eliminar
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: provider ? "row" : "column",
          justifyContent: provider ? "space-between" : "center",
          alignItems: "center",
          gap: 0,
          mt: 4,
          width: "100%",
        }}
      >
        <Card sx={{ maxWidth: 400, minWidth: 400, mx: "auto", p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CardMedia
            component="img"
            image={user.profile_picture || "https://via.placeholder.com/200"}
            alt={user.name}
            sx={{ width: 200, height: 200, borderRadius: "50%", objectFit: "cover", mb: 2 }}
          />
          <CardContent sx={{ width: "100%", textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>{user.name}</Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
              <strong>ID:</strong> {user.id_user ?? user._id}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 1 }}>
              <strong>Teléfono:</strong> {user.phone || "—"}
            </Typography>

            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              {user.provider ? "Pertenece a una proveedora." : "No es proveedor."}
            </Typography>
          </CardContent>
        </Card>

        {user.provider === true && provider && (
          <Card sx={{ mt: 4, p: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>Empresa proveedora</Typography>
              <Box>
                {(Array.isArray(provider) ? provider : [provider]).map((p) => (
                  <Card key={p.id_provider} sx={{ maxWidth: 350, mx: "auto", mb: 1 }}>
                    <CardMedia sx={{ height: 200 }} image={p.image || "https://via.placeholder.com/350x200?text=Proveedor"} title={p.companyName} />
                    <CardContent>
                      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>{p.companyName}</Typography>
                      <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 0.5, my: 1 }}>
                        {Array.isArray(p.categories) && p.categories.map((cat, i) => (
                          <Chip key={i} label={cat} size="small" color="primary" sx={{ textTransform: "capitalize" }} />
                        ))}
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0, display: "flex", justifyContent: "center" }}>
                      <Button variant="contained" component={Link} to={`/proveedor/${p.id_provider}`}>Ver</Button>
                    </Box>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog open={editOpen} onClose={closeEdit} maxWidth="md" fullWidth>
        <DialogTitle>
          Editar usuario
          <IconButton aria-label="close" onClick={closeEdit} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box component="form" sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Nombre" fullWidth value={form.name} onChange={handleFormChange("name")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Email" fullWidth value={form.email} onChange={handleFormChange("email")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Teléfono" fullWidth value={form.phone} onChange={handleFormChange("phone")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Foto (URL)" fullWidth value={form.profile_picture} onChange={handleFormChange("profile_picture")} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Dirección</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Calle" fullWidth value={form.street} onChange={handleFormChange("street")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Ciudad" fullWidth value={form.city} onChange={handleFormChange("city")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Provincia / Estado" fullWidth value={form.state} onChange={handleFormChange("state")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Código postal" fullWidth value={form.postalCode} onChange={handleFormChange("postalCode")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="País" fullWidth value={form.country} onChange={handleFormChange("country")} />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  control={<Switch checked={form.provider} onChange={(e) => setForm((p) => ({ ...p, provider: e.target.checked }))} />}
                  label="Proveedor"
                />
                <FormControlLabel
                  control={<Switch checked={form.admin} onChange={(e) => setForm((p) => ({ ...p, admin: e.target.checked }))} />}
                  label="Admin"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeEdit}>Cancelar</Button>
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={closeDelete}>
        <DialogTitle>Eliminar usuario</DialogTitle>
        <DialogContent>
          <Typography>¿Seguro que quieres borrar a <strong>{user.name}</strong>? Esta acción no tiene vuelta atrás.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDelete}>Cancelar</Button>
          <Button color="error" variant="contained" startIcon={<DeleteIcon />} onClick={handleDeleteConfirm}>Borrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
        <Alert onClose={() => setSnack((s) => ({ ...s, open: false }))} severity={snack.severity} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}