import {app, BrowserWindow, Menu} from 'electron';

const createWindow = () => {
    const win = new BrowserWindow({
        width: 700,
        height: 900,
    });
    //win.loadFile('index.html');
    win.loadURL('http://localhost:5173/login')
    //win.webContents.openDevTools();

    win.on('maximize', () => console.log('Window maximized'));
    win.on('minimize', () => console.log('Window minimized'));
    win.on('focus', () => console.log('Window focused'));
    win.on('blur', () => console.log('Window lost focus'));

    const templateDefault = [
     {
      label: 'Explorar',
      submenu: [
        {
          label: 'Inicio',
          click: () => {
            win.loadURL('http://localhost:5173/home');
          },
        },
        {
          label: 'Proveedores',
          click: () => {
            win.loadURL('http://localhost:5173/proveedores');
          },
        },
        {
          label: 'Contactos',
          click: () => {
            win.loadURL('http://localhost:5173/contactos');
          },
        },
        {
          label: 'Productos',
          click: () => {
            win.loadURL('http://localhost:5173/productos');
          },
        },
        {
          label: 'Inventario',
          click: () => {
            win.loadURL('http://localhost:5173/inventario');
          },
        },
        {
          label: 'Pedidos',
          click: () => {
            win.loadURL('http://localhost:5173/pedidos');
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'About Us', click: () => console.log('About Us clicked') },
      ],
    },
  ];
  

    // definir MENU
     const templateMac = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Menu',
          click: () => {
            win.loadFile('menu.html');
          },
        },
        {
          label: 'Pedidos',
          click: () => {
            win.loadFile('pedidos.html');
          },
        },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'About Us', click: () => console.log('About Us clicked') },
      ],
    },
  ];

  let template;
  if (process.platform === 'darwin') {
    template = templateMac;
  } else {
    template = templateDefault;
  }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
    createWindow();
});
app.on('window-all-closed', () => {
    console.log('All windows closed');
    app.quit();
});
app.whenReady().then(() => {
  console.log(process.platform);
});