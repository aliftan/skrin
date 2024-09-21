const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const setupControls = document.getElementById('setupControls');
const recordingControls = document.getElementById('recordingControls');
const previewControls = document.getElementById('previewControls');
const timer = document.getElementById('timer');
const previewVideo = document.getElementById('previewVideo');
const recordedVideo = document.getElementById('recordedVideo');

function updateUIForRecordingStart() {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    setupControls.classList.add('d-none');
    timer.classList.remove('d-none');
    previewVideo.classList.add('d-none');
}

function showPreviewControls() {
    recordedVideo.classList.remove('d-none');
    previewVideo.classList.add('d-none');
    timer.classList.add('d-none');
    recordingControls.classList.add('d-none');
    previewControls.classList.remove('d-none');
}

function resetUI() {
    recordedVideo.classList.add('d-none');
    previewVideo.classList.remove('d-none');
    setupControls.classList.remove('d-none');
    recordingControls.classList.remove('d-none');
    previewControls.classList.add('d-none');
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

export { updateUIForRecordingStart, showPreviewControls, resetUI };