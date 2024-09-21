const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const sourceSelect = document.getElementById('sourceSelect');
const audioSelect = document.getElementById('audioSelect');
const previewVideo = document.getElementById('previewVideo');
const recordedVideo = document.getElementById('recordedVideo');

let mediaRecorder;
let recordedChunks = [];
let previewStream;

async function getSources() {
    const sources = await window.electronAPI.getSources();
    sourceSelect.innerHTML = sources.map(source => 
        `<option value="${source.id}">${source.name}</option>`
    ).join('');
    
    updatePreview();
}

async function getAudioSources() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    audioSelect.innerHTML = audioDevices.map(device => 
        `<option value="${device.deviceId}">${device.label || `Microphone ${audioSelect.length + 1}`}</option>`
    ).join('');
}

async function updatePreview() {
    if (previewStream) {
        previewStream.getTracks().forEach(track => track.stop());
    }

    const sourceId = sourceSelect.value;
    try {
        previewStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId
                }
            }
        });
        previewVideo.srcObject = previewStream;
    } catch (err) {
        console.error("Error updating preview:", err);
    }
}

sourceSelect.addEventListener('change', updatePreview);

getSources();
getAudioSources();

async function startRecording() {
    const sourceId = sourceSelect.value;
    const audioId = audioSelect.value;
    try {
        const videoStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: sourceId
                }
            }
        });

        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {deviceId: audioId ? {exact: audioId} : undefined},
            video: false
        });

        const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
        ]);

        mediaRecorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9' });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            recordedVideo.src = URL.createObjectURL(blob);
            recordedVideo.style.display = 'block';
            previewVideo.style.display = 'none';
        };

        mediaRecorder.start();
        startBtn.disabled = true;
        stopBtn.disabled = false;
        sourceSelect.disabled = true;
        audioSelect.disabled = true;
    } catch (err) {
        console.error("Error: " + err);
    }
}

startBtn.addEventListener('click', startRecording);

stopBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
        sourceSelect.disabled = false;
        audioSelect.disabled = false;
        previewVideo.style.display = 'block';
    }
});

function trackMouse(event) {
    mousePositions.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now() - startTime
    });
}

function applyZoomEffect() {
    if (videoPlayer.paused || videoPlayer.ended) {
        return;
    }

    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;

    ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

    const currentTime = videoPlayer.currentTime * 1000;
    const currentPosition = mousePositions.find(p => p.timestamp >= currentTime) || mousePositions[mousePositions.length - 1];

    if (currentPosition) {
        const zoomFactor = 1.5;
        const zoomSize = 200;
        const zoomX = currentPosition.x - zoomSize / 2;
        const zoomY = currentPosition.y - zoomSize / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(currentPosition.x, currentPosition.y, zoomSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(videoPlayer, 
            zoomX, zoomY, zoomSize, zoomSize,
            zoomX - (zoomSize * (zoomFactor - 1)) / 2, 
            zoomY - (zoomSize * (zoomFactor - 1)) / 2, 
            zoomSize * zoomFactor, zoomSize * zoomFactor
        );
        ctx.restore();
    }

    requestAnimationFrame(applyZoomEffect);
}

videoPlayer.addEventListener('play', () => {
    const mouseData = localStorage.getItem('lastRecordingMousePositions');
    if (mouseData) {
        mousePositions = JSON.parse(mouseData);
        canvas.style.display = 'block';
        videoPlayer.style.display = 'none';
        applyZoomEffect();
    }
});

videoPlayer.addEventListener('pause', () => {
    canvas.style.display = 'none';
    videoPlayer.style.display = 'block';
});

videoPlayer.addEventListener('seeked', () => {
    if (!videoPlayer.paused) {
        canvas.style.display = 'block';
        videoPlayer.style.display = 'none';
        applyZoomEffect();
    }
});