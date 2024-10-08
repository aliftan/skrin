const { app, BrowserWindow, ipcMain, desktopCapturer, screen, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 500,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
          "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
          "img-src 'self' data: https:; " +
          "media-src 'self' blob:;"
        ]
      }
    });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-sources', async (event) => {
  try {
    console.log('Fetching sources in main process...');
    const sources = await desktopCapturer.getSources({ types: ['screen'] });
    console.log('Sources fetched in main process:', sources);
    return sources.map(source => ({
      id: source.id,
      name: source.name,
    }));
  } catch (error) {
    console.error('Error fetching sources in main process:', error);
    throw error;
  }
});

ipcMain.handle('get-cursor-position', () => {
  const point = screen.getCursorScreenPoint();
  return { x: point.x, y: point.y };
});

ipcMain.handle('get-window-bounds', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  return win.getBounds();
});

ipcMain.handle('save-temp-file', async (event, blobData) => {
  const tempPath = path.join(os.tmpdir(), `skrin_temp_${Date.now()}.webm`);

  // Convert the array buffer to a Buffer
  const buffer = Buffer.from(new Uint8Array(blobData));

  fs.writeFileSync(tempPath, buffer);
  return tempPath;
});

ipcMain.handle('show-save-dialog', async (event, suggestedName) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Save recording',
    defaultPath: path.join(app.getPath('videos'), suggestedName),
    filters: [{ name: 'WebM files', extensions: ['webm'] }]
  });
  return filePath;
});

ipcMain.handle('save-recording', async (event, tempPath, savePath) => {
  fs.copyFileSync(tempPath, savePath);
  fs.unlinkSync(tempPath);
});

ipcMain.handle('cleanup-temp-file', async (event, tempPath) => {
  if (tempPath && fs.existsSync(tempPath)) {
    fs.unlinkSync(tempPath);
  }
});