import {
    showRecordingState,
    showPreviewState
} from "./uiManager.js";
import { getVideoStream, getAudioStream } from "./sourceManager.js";
import { saveTempFile } from "./fileManager.js";
import { createStreamWithCursorHighlight, stopCursorHighlight } from "./cursorHighlight.js";

let mediaRecorder;
let recordedChunks = [];
let tempFilePath;
let mimeType;

async function startRecording() {
    const sourceId = document.getElementById("sourceSelect").value;
    const audioId = document.getElementById("audioSelect").value;
    const cursorHighlight = document.getElementById("cursorHighlight").checked;

    try {
        const videoStream = await getVideoStream(sourceId);
        const audioStream = await getAudioStream(audioId);
        let combinedStream;

        if (cursorHighlight) {
            console.log("Applying cursor highlight to recording");
            combinedStream = await createStreamWithCursorHighlight(videoStream, audioStream, true);
        } else {
            combinedStream = new MediaStream([
                ...videoStream.getVideoTracks(),
                ...audioStream.getAudioTracks(),
            ]);
        }

        // Check for MP4 support
        if (MediaRecorder.isTypeSupported('video/mp4')) {
            mimeType = 'video/mp4';
        } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
            mimeType = 'video/webm; codecs=vp9';
        } else {
            mimeType = 'video/webm';
        }

        console.log(`Using MIME type: ${mimeType}`);

        mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: mimeType
        });

        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleRecordingStop;

        recordedChunks = [];
        mediaRecorder.start();
        showRecordingState();
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
    const blob = new Blob(recordedChunks, { type: mimeType });

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
        stopCursorHighlight();
    }
}

export { startRecording, stopRecording, mediaRecorder, recordedChunks, tempFilePath };
