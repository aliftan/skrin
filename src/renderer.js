import { getSources, getAudioSources, updatePreview } from "./sourceManager.js";
import { startRecording, stopRecording } from "./recordingManager.js";
import { showSaveDialog, saveRecording } from "./fileManager.js";
import {
    showIdleState,
    resetUI,
    stopAndResetVideo
} from './uiManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const sourceSelect = document.getElementById("sourceSelect");
    const audioSelect = document.getElementById("audioSelect");
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

    cancelBtn.addEventListener("click", () => {
        stopAndResetVideo(recordedVideo);
        tempFilePath = null;
        resetUI();
    });

    saveBtn.addEventListener("click", async () => {
        if (!tempFilePath) {
            console.error("No recording to save");
            return;
        }
        const savePath = await showSaveDialog();
        if (savePath) {
            stopAndResetVideo(recordedVideo);
            await saveRecording(tempFilePath, savePath);
            tempFilePath = null; // Clear the temp file path after saving
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