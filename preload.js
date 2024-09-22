const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getSources: () => ipcRenderer.invoke('get-sources'),
    startRecording: () => ipcRenderer.send('start-recording'),
    stopRecording: () => ipcRenderer.send('stop-recording'),
    getCursorPosition: async () => {
        try {
            return await ipcRenderer.invoke('get-cursor-position');
        } catch (error) {
            console.error('Error invoking get-cursor-position:', error);
            return { x: 0, y: 0 }; 
        }
    },
    getWindowBounds: () => ipcRenderer.invoke('get-window-bounds'),
    saveTempFile: (arrayBuffer) => ipcRenderer.invoke('save-temp-file', arrayBuffer),
    showSaveDialog: (suggestedName) => ipcRenderer.invoke('show-save-dialog', suggestedName),
    saveRecording: (tempPath, savePath) => ipcRenderer.invoke('save-recording', tempPath, savePath),
    cleanupTempFile: (tempPath) => ipcRenderer.invoke('cleanup-temp-file', tempPath),
});