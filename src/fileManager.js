async function saveTempFile(arrayBuffer) {
    return await window.electronAPI.saveTempFile(arrayBuffer);
}

async function showSaveDialog() {
    return await window.electronAPI.showSaveDialog();
}

async function saveRecording(tempFilePath, savePath) {
    await window.electronAPI.saveRecording(tempFilePath, savePath);
}

async function deleteTempFile(tempFilePath) {
    await window.electronAPI.deleteTempFile(tempFilePath);
}

export { saveTempFile, showSaveDialog, saveRecording, deleteTempFile };