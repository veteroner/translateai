const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Electron penceresi
let mainWindow;

// Ana pencereyi oluştur
function createWindow() {
  // Pencere boyutları
  const windowWidth = 1200;
  const windowHeight = 800;
  
  // Pencere oluşturma
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false, // İlk yüklenme tamamlanana kadar gösterme
    icon: path.join(__dirname, '../assets/icon.png')
  });

  // Menüyü oluştur
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Yükleme URL'si - geliştirme modunda localhost, üretimde index.html
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  // Web sayfasını yükle
  mainWindow.loadURL(startUrl);

  // Pencere hazır olduğunda göster
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Geliştirme modunda DevTools'u aç
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Pencere kapatıldığında referansı temizle
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Harici bağlantıları tarayıcıda aç
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
}

// Electron hazır olduğunda
app.whenReady().then(() => {
  createWindow();

  // macOS'da tüm pencereler kapatıldığında uygulamayı yeniden başlat
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Tüm pencereler kapatıldığında uygulamayı sonlandır (macOS hariç)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC olayları
ipcMain.on('download-file', (event, { content, filename }) => {
  // İndirme diyaloğunu göster
  const options = {
    title: 'Çeviriyi Kaydet',
    defaultPath: filename,
    filters: [
      { name: 'Metin Dosyaları', extensions: ['txt'] },
      { name: 'Tüm Dosyalar', extensions: ['*'] }
    ]
  };

  dialog.showSaveDialog(options).then(result => {
    if (!result.canceled && result.filePath) {
      // Dosyayı kaydet
      fs.writeFile(result.filePath, content, 'utf-8', (err) => {
        if (err) {
          event.reply('download-error', err.message);
        } else {
          event.reply('download-success', result.filePath);
        }
      });
    }
  }).catch(err => {
    event.reply('download-error', err.message);
  });
});

// Uygulama menüsü
const menuTemplate = [
  {
    label: 'Dosya',
    submenu: [
      {
        label: 'Yeni Çeviri',
        accelerator: 'CmdOrCtrl+N',
        click() {
          if (mainWindow) {
            mainWindow.webContents.send('new-translation');
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Çıkış',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Alt+F4',
        click() {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Düzenle',
    submenu: [
      { role: 'undo', label: 'Geri Al' },
      { role: 'redo', label: 'Yinele' },
      { type: 'separator' },
      { role: 'cut', label: 'Kes' },
      { role: 'copy', label: 'Kopyala' },
      { role: 'paste', label: 'Yapıştır' },
      { role: 'delete', label: 'Sil' },
      { type: 'separator' },
      { role: 'selectAll', label: 'Tümünü Seç' }
    ]
  },
  {
    label: 'Görünüm',
    submenu: [
      { role: 'reload', label: 'Yenile' },
      { role: 'forceReload', label: 'Zorla Yenile' },
      { type: 'separator' },
      { role: 'resetZoom', label: 'Yakınlaştırmayı Sıfırla' },
      { role: 'zoomIn', label: 'Yakınlaştır' },
      { role: 'zoomOut', label: 'Uzaklaştır' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Tam Ekran' }
    ]
  },
  {
    label: 'Yardım',
    submenu: [
      {
        label: 'Hakkında',
        click() {
          // Hakkında penceresi aç
          const aboutWindow = new BrowserWindow({
            width: 400,
            height: 300,
            title: 'Hakkında',
            autoHideMenuBar: true,
            resizable: false,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false
            }
          });
          
          aboutWindow.loadURL(
            isDev
              ? `http://localhost:3000/about`
              : `file://${path.join(__dirname, '../build/index.html#/about')}`
          );
        }
      },
      {
        label: 'Web Sitesi',
        click() {
          shell.openExternal('https://translateai.example.com');
        }
      },
      {
        label: 'GitHub',
        click() {
          shell.openExternal('https://github.com/translateai');
        }
      }
    ]
  }
];

// macOS için menü değişiklikleri
if (process.platform === 'darwin') {
  menuTemplate.unshift({
    label: app.name,
    submenu: [
      { role: 'about', label: 'Hakkında' },
      { type: 'separator' },
      { role: 'services', label: 'Servisler' },
      { type: 'separator' },
      { role: 'hide', label: 'Gizle' },
      { role: 'hideOthers', label: 'Diğerlerini Gizle' },
      { role: 'unhide', label: 'Tümünü Göster' },
      { type: 'separator' },
      { role: 'quit', label: 'Çıkış' }
    ]
  });
} 