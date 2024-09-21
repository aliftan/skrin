import { updateUIForRecordingStart } from './uiManager.js';
import { getVideoStream, getAudioStream } from './sourceManager.js';

let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
    const sourceId = document.getElementById('sourceSelect').value;
    const audioId = document.getElementById('audioSelect').value;
    try {
        const videoStream = await getVideoStream(sourceId);
        const audioStream = await getAudioStream(audioId);
        const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
        ]);
        
        mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9' });
        
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.onstop = handleRecordingStop;
        
        mediaRecorder.start();
        updateUIForRecordingStart();
    } catch (err) {
        console.error("Error starting recording:", err);
    }
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

function handleRecordingStop() {
    // This function will be implemented later
    console.log('Recording stopped');
}

export { startRecording, mediaRecorder, recordedChunks };