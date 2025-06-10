const { contextBridge, ipcRenderer } = require('electron');

// Electron API'lerini web sayfasına güvenli bir şekilde aktarma
contextBridge.exposeInMainWorld('electron', {
  // IPC kanalları için yardımcı fonksiyonlar
  ipcRenderer: {
    // Ana işleme gönder
    send: (channel, data) => {
      // İzin verilen kanallar
      const validChannels = ['download-file', 'app-ready'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    // Ana işlemden yanıt al
    on: (channel, func) => {
      const validChannels = [
        'download-success', 
        'download-error', 
        'new-translation',
        'open-settings'
      ];
      if (validChannels.includes(channel)) {
        // IPC olaylarını dinle
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    // Ana işleme gönder ve cevap bekle
    invoke: async (channel, data) => {
      const validChannels = ['check-update', 'get-app-info'];
      if (validChannels.includes(channel)) {
        return await ipcRenderer.invoke(channel, data);
      }
    },
    // Dinlemeyi durdur
    removeListener: (channel, func) => {
      ipcRenderer.removeListener(channel, func);
    }
  },
  
  // Sistem bilgileri
  system: {
    platform: process.platform
  },
  
  // Uygulama işlevleri
  app: {
    // Metni masaüstünde dışa aktar
    exportText: (text, filename) => {
      ipcRenderer.send('download-file', { content: text, filename });
    }
  }
}); 