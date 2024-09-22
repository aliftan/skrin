import { getSources, getAudioSources, updatePreview } from "./sourceManager.js";
import { startRecording, stopRecording } from "./recordingManager.js";
import { showSaveDialog, saveRecording } from "./fileManager.js";
import {
    showIdleState,
    resetUI,
    stopAndResetVideo
} from './uiManager.js';
import { createStreamWithCursorHighlight, stopCursorHighlight } from './cursorHighlight.js';

document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById("startBtn");
    const stopBtn = document.getElementById("stopBtn");
    const sourceSelect = document.getElementById("sourceSelect");
    const audioSelect = document.getElementById("audioSelect");
    const cancelBtn = document.getElementById("cancelBtn");
    const saveBtn = document.getElementById("saveBtn");
    const cursorHighlightCheckbox = document.getElementById("cursorHighlight");

    let tempFilePath;
    let videoStream;
    let audioStream;

    getSources();
    getAudioSources();

    sourceSelect.addEventListener("change", async () => {
        videoStream = await updatePreview();
    });

    audioSelect.addEventListener("change", async () => {
        console.log("Audio source changed:", audioSelect.value);
        audioStream = await getAudioStream(audioSelect.value);
    });

    cursorHighlightCheckbox.addEventListener("change", async (event) => {
        console.log("Cursor highlight toggled:", event.target.checked);
        if (event.target.checked && videoStream && audioStream) {
            await createStreamWithCursorHighlight(videoStream, audioStream, true);
        } else {
            stopCursorHighlight();
        } 
        await updatePreview();
    });

    startBtn.addEventListener("click", () => startRecording(cursorHighlightCheckbox.checked));

    stopBtn.addEventListener("click", stopRecording);

    cancelBtn.addEventListener("click", () => {
        stopAndResetVideo(document.getElementById("recordedVideo"));
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
            stopAndResetVideo(document.getElementById("recordedVideo"));
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