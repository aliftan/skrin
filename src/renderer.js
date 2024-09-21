import { getSources, getAudioSources, updatePreview } from "./sourceManager.js";
import { startRecording, mediaRecorder, recordedChunks } from "./recordingManager.js";
import { resetUI } from "./uiManager.js";
import {
  showSaveDialog,
  saveRecording,
  deleteTempFile,
} from "./fileManager.js";

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const sourceSelect = document.getElementById("sourceSelect");
const audioSelect = document.getElementById("audioSelect");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");

let tempFilePath;

getSources();
getAudioSources();

sourceSelect.addEventListener("change", updatePreview);
audioSelect.addEventListener("change", () => {
  // You might want to add some functionality here when the audio source changes
  console.log("Audio source changed:", audioSelect.value);
});
startBtn.addEventListener("click", startRecording);

stopBtn.addEventListener("click", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    resetUI();
  }
});

saveBtn.addEventListener("click", async () => {
  const savePath = await showSaveDialog();
  if (savePath) {
    await saveRecording(tempFilePath, savePath);
    resetUI();
  }
});

deleteBtn.addEventListener("click", async () => {
  await deleteTempFile(tempFilePath);
  resetUI();
});

export { mediaRecorder, recordedChunks, tempFilePath };
