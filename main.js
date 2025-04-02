import { app, BrowserWindow, Menu, dialog, ipcMain } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import isDev from 'electron-is-dev';
import remoteMain from '@electron/remote/main/index.js';

// Compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize @electron/remote
remoteMain.initialize();

// Remove the default menu bar
Menu.setApplicationMenu(null);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });
  win.maximize();

  // Enable @electron/remote for this window
  remoteMain.enable(win.webContents);
  
  // Handle window close
  win.on('close', async (event) => {
    // Check if user is authenticated via renderer process
    const isAuthenticated = await win.webContents.executeJavaScript(
      'sessionStorage.getItem("user") !== null'
    );
    
    if (isAuthenticated) {
      event.preventDefault();
      win.webContents.send('app-close-requested');
    }
    // If not authenticated, allow immediate close
  });

  // Load the app content
  if (isDev) {
    console.log('Loading dev URL: http://localhost:8080');
    win.loadURL('http://localhost:8080');
  } else {
    const filePath = path.join(__dirname, 'dist/index.html');
    console.log('Loading prod file:', filePath);
    win.loadFile(filePath);
  }

  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Console ${level} @ ${sourceId}:${line}]: ${message}`);
  });

  // Setup IPC for safe exit
  ipcMain.on('exit-app', () => {
    win.destroy();
    app.quit();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});