function generateFilename() {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19); // YYYY-MM-DDTHH-mm-ss
    return `skrin_recording_${timestamp}.webm`;
}

async function showSaveDialog() {
    const suggestedName = generateFilename();
    return await window.electronAPI.showSaveDialog(suggestedName);
}

async function saveTempFile(arrayBuffer) {
    return await window.electronAPI.saveTempFile(arrayBuffer);
}

async function saveRecording(tempPath, savePath) {
    await window.electronAPI.saveRecording(tempPath, savePath);
}

async function cleanupTempFile(tempPath) {
    await window.electronAPI.cleanupTempFile(tempPath);
}

export { saveTempFile, showSaveDialog, saveRecording, cleanupTempFile };