import {
    showRecordingState,
    showPreviewState,
    resetUI
} from "./uiManager.js";
import { getVideoStream, getAudioStream } from "./sourceManager.js";
import { saveTempFile } from "./fileManager.js";

let mediaRecorder;
let recordedChunks = [];
let tempFilePath;

async function startRecording() {
    const sourceId = document.getElementById("sourceSelect").value;
    const audioId = document.getElementById("audioSelect").value;
    const cursorHighlight = document.getElementById("cursorHighlight").checked;

    try {
        const videoStream = await getVideoStream(sourceId);
        const audioStream = await getAudioStream(audioId);
        let combinedStream;

        if (cursorHighlight) {
            // Implement cursor highlight logic here
            // For now, we'll just combine video and audio
            combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);
        } else {
            combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);
        }

        mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: "video/webm; codecs=vp9",
        });

        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleRecordingStop;

        recordedChunks = []; // Clear any previous recordings
        mediaRecorder.start();
        showRecordingState(); // Move UI update here
    } catch (err) {
        console.error("Error starting recording:", err);
        alert(
            "Failed to start recording. Please check your selected sources and try again."
        );
    }
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

async function handleRecordingStop() {
    console.log("Recording stopped");
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    
    const arrayBuffer = await blob.arrayBuffer();
    
    tempFilePath = await saveTempFile(arrayBuffer);
    window.setTempFilePath(tempFilePath);
    const recordedVideo = document.getElementById("recordedVideo");
    recordedVideo.src = URL.createObjectURL(blob);
    showPreviewState();
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
}

export { startRecording, stopRecording, mediaRecorder, recordedChunks, tempFilePath };