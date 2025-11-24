import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Typography, Container, Box, CircularProgress, Alert, Button, CardMedia, CardContent, CardActions, Card, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper } from '@mui/material';
import Header from '../components/Header.jsx';
import '../pages/Productos.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { obtenerUsuario } from "../components/ObtenerUsuario.js";
import { fetchWithRefresh } from "../components/fetchWithRefresh";


export default function Productos() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [idUsuario, setIdUsuario] = useState(null);
  const [updatingStock, setUpdatingStock] = useState({});
  const [success, setSuccess] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [isProveedor, setIsProveedor] = useState(false);
  const [openCreateProduct, setOpenCreateProduct] = useState(false);
  const [openDeleteProviderProducts, setOpenDeleteProviderProducts] = useState(false);
  const [newProduct, setNewProduct] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteDialogProviderId, setDeleteDialogProviderId] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const usuario = await obtenerUsuario();
      setIdUsuario(usuario.id_user);
      const response = await fetchWithRefresh(`http://localhost:3000/usuarios/${usuario.id_user}`);
      const userWithData = await response.json();
      console.log(userWithData.provider);
      setIsProveedor(userWithData.provider);
      const providerRes = await fetchWithRefresh(`http://localhost:3000/proveedores/porUser/${userWithData.id_user}`);
      const providerData = await providerRes.json();
      const idpr = providerData.id_provider;
      setDeleteDialogProviderId(idpr);    
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!idUsuario) return;

    const loadInventory = async () => {
      setIsLoading(true);

      try {
        const invRes = await fetchWithRefresh(`http://localhost:3000/inventario/porProveedor/${idUsuario}`);

        if (!invRes.ok) throw new Error("Error al cargar inventario");

        const inventario = await invRes.json();

        if (inventario === null) {
          const createRes = await fetchWithRefresh(`http://localhost:3000/inventario/create/${idUsuario}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });
          if (!createRes.ok) throw new Error("No se pudo crear el inventario");
          setProducts([]);
          setError(null);
          return;
        }

        console.log(inventario);

        const productPromises = inventario.products.map(async (item) => {
          const prodRes = await fetchWithRefresh(`http://localhost:3000/productos/${item.id_product}`);
          if (!prodRes.ok) return null;

          const prod = await prodRes.json();
          return {
            ...prod,
            stock: item.stock,
            unit_price: item.unit_price,
            lastRestocked: item.lastRestocked
          };
        });

        const productosConInventario = (await Promise.all(productPromises)).filter(Boolean);

        setProducts(productosConInventario);
        setError(null);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadInventory();
  }, [idUsuario]);


  const saveStock = async (id_product, newStock) => {
    setUpdatingStock((prev) => ({ ...prev, [id_product]: true }));

    try {
      const res = await fetchWithRefresh(`http://localhost:3000/inventario/modifyStock/${id_product}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: idUsuario, newStock })
      });

      if (!res.ok) { 
        throw new Error("No se pudo actualizar el stock")
      } else {
        setSuccess(true);
        setTimeout(setSuccess, 2000);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingStock((prev) => ({ ...prev, [id_product]: false }));
    }
  };

  const productosFiltrados = products.filter((p) => {
    const coincideBusqueda = p.name.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === "" ||
      (p.category && p.category.toLowerCase() === categoriaSeleccionada.toLowerCase());
    return coincideBusqueda && coincideCategoria;
  });

  const handleOpenAddDialog = async () => {
  try {
    const res = await fetchWithRefresh("http://localhost:3000/productos");
    if (!res.ok) throw new Error("No se pudo cargar la lista de productos");
    const productosDB = await res.json();

    const productosFaltantes = productosDB.filter(
      (pDB) => !products.some((pInv) => pInv.id_product === pDB.id_product)
    );

    setAllProducts(productosFaltantes);
    setOpenAddDialog(true);
  } catch (err) {
    setError(err.message);
  }
};

const handleAddProduct = async (product) => {
  try {
    const res = await fetchWithRefresh(`http://localhost:3000/inventario/addProduct/${idUsuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_product: product.id_product, stock: 0, unit_price: product.price })
    });

    if (!res.ok) throw new Error("No se pudo añadir el producto");

    setProducts((prev) => [...prev, { ...product, stock: 0, unit_price: product.price, lastRestocked: new Date() }]);
    setOpenAddDialog(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);

  } catch (err) {
    setError(err.message);
  }
};

const handleRemoveProduct = async (id_product) => {
  try {
    const res = await fetchWithRefresh(`http://localhost:3000/inventario/removeProduct/${idUsuario}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_product })
    });

    if (!res.ok) throw new Error("No se pudo eliminar el producto");

    setProducts((prev) => prev.filter((p) => p.id_product !== id_product));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);

  } catch (err) {
    setError(err.message);
  }
};

const handleCreateProduct = async (product) => {
  if (!product.category) {
    alert("Por favor selecciona una categoría");
    return;
  }

  const provider = await fetchWithRefresh(`http://localhost:3000/proveedores/porUser/${idUsuario}`)
  const cacharro = await provider.json();

  const idProvider = cacharro.id_provider

  const productToSend = {
      ...product,
      id_provider: idProvider,
    };

  try {
    const res = await fetch('http://localhost:3000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productToSend)
    });

    if (!res.ok) throw new Error('No se pudo crear el producto');
    const created = await res.json();
    console.log('Producto creado:', created);
    setOpenCreateProduct(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);

  } catch (err) {
    setError(err.message);
  }
};

const handleDeleteProduct = async (id) => {
  try {
      const res = await fetchWithRefresh(
        `http://localhost:3000/productos/${id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error(`No se pudo eliminar el producto ${id}`);


    setProducts(prev => prev.filter(p => !selectedProducts.includes(p.id_product)));
    setSelectedProducts([]);
    setOpenDeleteProviderProducts(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  } catch (err) {
    setError(err.message);
  }
};

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Header />
      {error && (
        <Alert severity="error" sx={{ mb: 2, ml: "340px" }}>
          Error: {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{mb: 2, ml: "340px"}}>
          ¡Cambios a este producto guardados!
        </Alert>
      )}

      <Box sx={{ display: "flex" }}>
        <Box className="productos-sidebar">
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
            Buscar producto
          </Typography>

          <TextField
            fullWidth
            label="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" sx={{ mb: 1 }}>
            Categorías
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {["Alimentos", "Bebidas", "Otros"].map((cat) => (
              <Button
                key={cat}
                variant={categoriaSeleccionada === cat.toLowerCase() ? "contained" : "outlined"}
                onClick={() =>
                  setCategoriaSeleccionada(
                    categoriaSeleccionada === cat.toLowerCase() ? "" : cat.toLowerCase()
                  )
                }
              >
                {cat}
              </Button>
            ))}
          </Box>
        </Box>

        <Box elevation={10} sx={{ flex: 1, ml: "200px", p: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
            Inventario Actual
          </Typography>
            <Button variant="contained" color="secondary" onClick={handleOpenAddDialog} sx={{ position: "fixed", right:30, top:120, zIndex:9999 }}>
              Añadir productos
            </Button>
          <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth maxWidth="sm" sx={{zIndex:1000000}}>
            <DialogTitle>Productos disponibles para añadir</DialogTitle>
            <DialogContent>
              {allProducts.length === 0 ? (
                <Typography>No hay productos disponibles para añadir.</Typography>
              ) : (
                <List>
                  {allProducts.map((product) => (
                    <ListItem key={product.id_product} button onClick={() => handleAddProduct(product)}>
                      <ListItemAvatar>
                        <Avatar
                          src={(product.images?.length ? product.images[0] : product.image) || '/placeholder.jpg'}
                          alt={product.name}
                          variant="square"
                          sx={{ width: 56, height: 56, mr: 2 }}
                        />
                        </ListItemAvatar>
                      <ListItemText primary={product.name} secondary={`Precio: ${product.price}`} />
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            {isProveedor && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3, alignSelf: "center", maxWidth: 500 }}>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setNewProduct({ category: '' });
                    setOpenCreateProduct(true);
                  }}
                >
                  Crear nuevo producto
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setOpenDeleteProviderProducts(true);
                    console.log(deleteDialogProviderId);
                  }}
                >
                  Borrar productos de mi empresa
                </Button>

              </Box>
            )}
            <DialogActions>
              <Button onClick={() => setOpenAddDialog(false)}>Cerrar</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={openCreateProduct} onClose={() => setOpenCreateProduct(false)} fullWidth maxWidth="sm" sx={{zIndex:1000001}}>
            <DialogTitle>Crear nuevo producto</DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

              <TextField
                fullWidth
                label="Nombre del producto"
                value={newProduct.name || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
              />

              <TextField
                fullWidth
                label="Descripción"
                multiline
                rows={3}
                value={newProduct.description || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 1, ml:13 }}>
                {["Alimentos", "Bebidas", "Otros"].map((cat) => (
                  <Button
                    key={cat}
                    variant={newProduct.category === cat.toLowerCase() ? "contained" : "outlined"}
                    onClick={() => setNewProduct(prev => ({ ...prev, category: cat.toLowerCase() }))}
                  >
                    {cat}
                  </Button>
                ))}
              </Box>

              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={newProduct.price || ''}
                onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
              />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(newProduct.images || []).map((img, idx) => (
                  <TextField
                    key={idx}
                    fullWidth
                    label={`URL de la imagen ${idx + 1}`}
                    value={img}
                    onChange={(e) => {
                      const updatedImages = [...(newProduct.images || [])];
                      updatedImages[idx] = e.target.value;
                      setNewProduct(prev => ({ ...prev, images: updatedImages }));
                    }}
                  />
                ))}
                <Button
                  variant="outlined"
                  onClick={() =>
                    setNewProduct(prev => ({ ...prev, images: [...(prev.images || []), ''] }))
                  }
                >
                  Agregar imagen
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { 
                setOpenCreateProduct(false);
              }}>
                Cancelar</Button>
              <Button variant="contained" color="success" onClick={() => {
                handleCreateProduct(newProduct)
                setOpenAddDialog(false);
              }}>
                Crear producto
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={openDeleteProviderProducts}
            onClose={() => setOpenDeleteProviderProducts(false)}
            fullWidth
            maxWidth="sm"
            sx = {{zIndex:1000001}}
          >
            <DialogTitle>Eliminar productos de mi empresa</DialogTitle>
            <DialogContent>
              <List>
                {allProducts
                  .filter(p => p.id_provider === deleteDialogProviderId)
                  .map((product) => (
                    <ListItem
                      key={product.id_product}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          color="error"
                          endIcon= {<DeleteForeverIcon/>}
                          onClick={() => {
                            handleDeleteProduct(product.id_product)
                            setOpenDeleteProviderProducts(false);
                            setOpenAddDialog(false);
                          }}
                        >
                        </Button>
                      }
                    >
                      <ListItemText primary={product.name} />
                    </ListItem>
                  ))}
              </List>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDeleteProviderProducts(false)}>Cerrar</Button>
            </DialogActions>
          </Dialog>


          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {productosFiltrados.length > 0 ? (
              productosFiltrados.map((product) => (
                <Card key={product.id_product} sx={{ maxWidth: 300, minWidth: 300, height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardMedia
                    sx={{ height: 140 }}
                    image={(product.images?.length ? product.images[0] : product.image) || '/placeholder.jpg'}
                    title={product.name}
                  />

                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Precio: {product.price}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", ml: 9, mt: 1, mb: 1 }}>
                      <Button
                        variant="outlined"
                        onClick={() =>
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id_product === product.id_product
                                ? { ...p, stock: Math.max(0, p.stock - 1) }
                                : p
                            )
                          )
                        }
                        sx={{ minWidth: 40 }}
                      >
                        -
                      </Button>

                      <Typography sx={{ mx: 2, fontWeight: "bold" }}>
                        {product.stock}
                      </Typography>

                      <Button
                        variant="outlined"
                        onClick={() =>
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id_product === product.id_product
                                ? { ...p, stock: p.stock + 1 }
                                  : p
                              )
                            )
                        }
                        sx={{ minWidth: 40 }}
                      >
                        +
                      </Button>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Precio Unitario: {product.unit_price}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Último Reabastecimiento:
                      {" "}
                      {new Date(product.lastRestocked).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        saveStock(product.id_product, product.stock)
                      }
                    >
                      Guardar Cambios
                    </Button>

                    <Button
                      size="small"
                      component={Link}
                      to={`/producto/${product.id_product}`}
                      fullWidth
                    >
                      Más Info
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveProduct(product.id_product)}
                    >
                      Eliminar del inventario
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Alert severity="info">No hay productos disponibles</Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
