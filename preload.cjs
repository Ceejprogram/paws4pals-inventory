const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => 'pong',
  sendNotification: (message) => ipcRenderer.send('notify', message),
});