const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSources: () => ipcRenderer.invoke('get-sources'),
    startRecording: () => ipcRenderer.send('start-recording'),
    stopRecording: () => ipcRenderer.send('stop-recording'),
    getCursorPosition: () => ipcRenderer.invoke('get-cursor-position'),
    saveTempFile: (blob) => ipcRenderer.invoke('save-temp-file', blob),
    showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
    saveRecording: (tempPath, savePath) => ipcRenderer.invoke('save-recording', tempPath, savePath),
    deleteTempFile: (tempPath) => ipcRenderer.invoke('delete-temp-file', tempPath),
});