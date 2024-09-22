import { createStreamWithCursorHighlight } from "./cursorHighlight.js";

const sourceSelect = document.getElementById('sourceSelect');
const audioSelect = document.getElementById('audioSelect');
const previewVideo = document.getElementById('previewVideo');

let previewStream;

async function getSources() {
    try {
        console.log('Fetching sources...');
        const sources = await window.electronAPI.getSources();
        console.log('Sources received:', sources);
        if (sources && sources.length > 0) {
            sourceSelect.innerHTML = sources.map(source =>
                `<option value="${source.id}">${source.name}</option>`
            ).join('');
            sourceSelect.value = sources[0].id; // Select the first source
            updatePreview();
        } else {
            sourceSelect.innerHTML = '<option value="">No sources available</option>';
        }
    } catch (error) {
        console.error('Error getting sources:', error);
        sourceSelect.innerHTML = '<option value="">Error loading sources</option>';
    }
}

async function getAudioSources() {
    try {
        console.log('Fetching audio devices...');
        const devices = await navigator.mediaDevices.enumerateDevices();
        console.log('Audio devices received:', devices);
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        if (audioDevices.length > 0) {
            audioSelect.innerHTML = audioDevices.map(device =>
                `<option value="${device.deviceId}">${device.label || `Microphone ${audioSelect.length + 1}`}</option>`
            ).join('');
        } else {
            audioSelect.innerHTML = '<option value="">No audio devices found</option>';
        }
    } catch (error) {
        console.error('Error getting audio sources:', error);
        audioSelect.innerHTML = '<option value="">Error loading audio sources</option>';
    }
}


async function updatePreview() {
    if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
    }

    const sourceId = sourceSelect.value;
    const cursorHighlight = document.getElementById("cursorHighlight").checked;

    try {
        console.log('Updating preview for source:', sourceId);
        let videoStream = await getVideoStream(sourceId);

        if (cursorHighlight) {
            console.log("Applying cursor highlight to preview");
            try {
                const audioStream = new MediaStream(); // Empty audio stream for preview
                previewStream = await createStreamWithCursorHighlight(videoStream, audioStream, true);
            } catch (highlightError) {
                console.error("Error applying cursor highlight:", highlightError);
                previewStream = videoStream; // Fallback to non-highlighted stream
            }
        } else {
            previewStream = videoStream;
        }

        previewVideo.srcObject = previewStream;
        await previewVideo.play(); // Ensure the video starts playing
        return previewStream; // Return the stream for use in other parts of the application
    } catch (err) {
        console.error("Error updating preview:", err);
    }
}

async function getVideoStream(sourceId) {
    return navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: sourceId
            }
        }
    });
}

async function getAudioStream(audioId) {
    return navigator.mediaDevices.getUserMedia({
        audio: { deviceId: audioId ? { exact: audioId } : undefined },
        video: false
    });
}

export { getSources, getAudioSources, updatePreview, getVideoStream, getAudioStream };