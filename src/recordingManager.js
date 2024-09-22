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
let streamCheckInterval;
let recordingStartTime;

async function startRecording() {
    console.log("Starting recording...");
    recordingStartTime = Date.now();
    recordedChunks = []; // Clear any previous data

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

        if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
            mimeType = 'video/webm; codecs=vp9';
        } else if (MediaRecorder.isTypeSupported('video/webm')) {
            mimeType = 'video/webm';
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
            mimeType = 'video/mp4';
        } else {
            throw new Error('No supported mime type found for MediaRecorder');
        }

        console.log(`Using MIME type: ${mimeType}`);

        mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: mimeType,
            videoBitsPerSecond: 5000000 // Increased to 5 Mbps
        });

        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleRecordingStop;
        mediaRecorder.onerror = (event) => console.error("MediaRecorder error:", event);

        mediaRecorder.start(100); // Request data every 100ms for more frequent updates
        showRecordingState();

        streamCheckInterval = setInterval(() => {
            if (!combinedStream.active) {
                console.error("Stream became inactive");
                stopRecording();
            }
        }, 1000);

    } catch (err) {
        console.error("Error starting recording:", err);
        alert("Failed to start recording. Please check your selected sources and try again.");
    }
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
        // console.log(`Chunk received: ${event.data.size} bytes. Total chunks: ${recordedChunks.length}. Total size: ${recordedChunks.reduce((acc, chunk) => acc + chunk.size, 0)} bytes`);
    }
}

async function handleRecordingStop() {
    clearInterval(streamCheckInterval);
    const recordingDuration = Date.now() - recordingStartTime;
    console.log(`Recording stopped after ${recordingDuration}ms`);
    
    if (recordedChunks.length === 0) {
        console.error("No data was recorded.");
        return;
    }

    const totalSize = recordedChunks.reduce((acc, chunk) => acc + chunk.size, 0);
    console.log(`Total recorded size: ${totalSize} bytes in ${recordedChunks.length} chunks`);

    const blob = new Blob(recordedChunks, { type: mimeType });
    console.log(`Final blob size: ${blob.size} bytes`);

    try {
        const arrayBuffer = await blob.arrayBuffer();
        tempFilePath = await saveTempFile(arrayBuffer);
        window.setTempFilePath(tempFilePath);
        const recordedVideo = document.getElementById("recordedVideo");
        recordedVideo.src = URL.createObjectURL(blob);
        showPreviewState();
    } catch (error) {
        console.error("Error in handling recording stop:", error);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        console.log("Stopping recording manually");
        // Request a final chunk of data before stopping
        mediaRecorder.requestData();
        setTimeout(() => {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach((track) => track.stop());
            stopCursorHighlight();
        }, 100); // Short delay to ensure the final data is captured
    }
}

export { startRecording, stopRecording, mediaRecorder, recordedChunks, tempFilePath };