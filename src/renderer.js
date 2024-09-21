import { getSources, getAudioSources, updatePreview } from "./sourceManager.js";
import { startRecording, stopRecording } from "./recordingManager.js";
import { showIdleState, showRecordingState, showPreviewState, resetUI } from "./uiManager.js";
import { showSaveDialog, saveRecording, deleteTempFile } from "./fileManager.js";

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const sourceSelect = document.getElementById("sourceSelect");
    const audioSelect = document.getElementById("audioSelect");
    const deleteBtn = document.getElementById("deleteBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");

    let tempFilePath;

    getSources();
    getAudioSources();

    sourceSelect.addEventListener("change", updatePreview);
    audioSelect.addEventListener("change", () => {
        console.log("Audio source changed:", audioSelect.value);
    });

    startBtn.addEventListener("click", startRecording);

    stopBtn.addEventListener("click", stopRecording);

    deleteBtn.addEventListener("click", async () => {
        await deleteTempFile(tempFilePath);
        resetUI();
    });

    cancelBtn.addEventListener("click", () => {
        resetUI();
    });

    saveBtn.addEventListener("click", async () => {
        const savePath = await showSaveDialog();
        if (savePath) {
            await saveRecording(tempFilePath, savePath);
            resetUI();
        }
    });

    // This function will be called from recordingManager.js when recording is stopped
    window.setTempFilePath = (path) => {
        tempFilePath = path;
    };

    // Initialize UI
    showIdleState();
});