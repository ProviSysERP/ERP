import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import LocalGroceryStoreTwoToneIcon from '@mui/icons-material/LocalGroceryStoreTwoTone';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const [inputValue, setInputValue] = React.useState('');
  const [value, setValue] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const searchOptions = [
    { label: 'Página principal', path: '/home' },
    { label: 'Chat', path: '/Chat' },
    { label: 'Pedidos', path: '/Pedidos' },
    { label: 'Contactos', path: '/contactos' },
    { label: 'Historial de Pedidos', path: '/historialpedidos' },
    { label: 'Proveedores', path: '/proveedores' },
    { label: 'Productos', path: '/productos' },
  ];

  const navigateTo = (path) => {
    if (!path) return;
    window.location.href = path;
  };

  const handleOptionChange = (event, newValue) => {
    setValue(newValue);
    if (newValue && typeof newValue === 'object' && newValue.path) {
      navigateTo(newValue.path);
    }
    if (typeof newValue === 'string' && newValue.trim()) {
      const match = searchOptions.find(
        (o) => o.label.toLowerCase() === newValue.trim().toLowerCase()
      );
      if (match) navigateTo(match.path);
      else navigateTo(`/search?q=${encodeURIComponent(newValue.trim())}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const text = inputValue.trim();
      if (!text) return;
      const match = searchOptions.find(
        (o) => o.label.toLowerCase() === text.toLowerCase()
      );
      if (match) {
        navigateTo(match.path);
      } else {
        navigateTo(`/search?q=${encodeURIComponent(text)}`);
      }
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={0} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
        >
          <Badge badgeContent={0} color="error">
            <LocalGroceryStoreTwoToneIcon/>
          </Badge>
        </IconButton>
        <p>Pedidos</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{ width: '100%', top: 0, left: 0, right: 0 }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => (window.location.href = '/home')}
            sx={{
              display: { xs: 'none', sm: 'block' },
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
          >
            ProviSys
          </Typography>

          <Search>

            <Autocomplete
              freeSolo
              disableClearable
              options={searchOptions}
              getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.label
              }
              value={value}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              onChange={handleOptionChange}
              sx={{
                width: { xs: '100%', md: '260px' },
                '& .MuiInputBase-root': {
                  color: 'inherit',
                  paddingLeft: '0 !important',
                },
                '& .MuiInputBase-input': {
                  paddingLeft: 'calc(1em + 32px)',
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search…"
                  variant="standard"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: false,
                    sx: { color: 'inherit' },
                    onKeyDown: handleKeyDown,
                    'aria-label': 'search',
                  }}
                  inputProps={{
                    ...params.inputProps,
                    'aria-label': 'search',
                  }}
                />
              )}
            />
          </Search>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              onClick={() => (window.location.href = '/Chat')}
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={0} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              color="inherit"
              onClick={() => (window.location.href = '/Pedidos')}
            >
              <Badge badgeContent={0} color="error">
                < LocalGroceryStoreTwoToneIcon/>
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Toolbar />

      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}