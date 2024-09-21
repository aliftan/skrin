const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSources: () => ipcRenderer.invoke('get-sources'),
    startRecording: () => ipcRenderer.send('start-recording'),
    stopRecording: () => ipcRenderer.send('stop-recording'),
    getCursorPosition: () => ipcRenderer.invoke('get-cursor-position'),
    saveTempFile: (arrayBuffer) => ipcRenderer.invoke('save-temp-file', arrayBuffer),
    showSaveDialog: (suggestedName) => ipcRenderer.invoke('show-save-dialog', suggestedName),
    saveRecording: (tempPath, savePath) => ipcRenderer.invoke('save-recording', tempPath, savePath),
    cleanupTempFile: (tempPath) => ipcRenderer.invoke('cleanup-temp-file', tempPath),
});