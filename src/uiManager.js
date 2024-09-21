import { startTimer, stopTimer } from './timerManager.js';

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const setupControls = document.getElementById('setupControls');
const recordingControls = document.getElementById('recordingControls');
const previewControls = document.getElementById('previewControls');
const timer = document.getElementById('timer');
const previewVideo = document.getElementById('previewVideo');
const recordedVideo = document.getElementById('recordedVideo');

const idleState = document.getElementById('idleState');
const recordingState = document.getElementById('recordingState');
const previewState = document.getElementById('previewState');

function showIdleState() {
    idleState.classList.remove('d-none');
    recordingState.classList.add('d-none');
    previewState.classList.add('d-none');
    
    setupControls.classList.remove('d-none');
    recordingControls.classList.remove('d-none');
    previewControls.classList.add('d-none');
    startBtn.classList.remove('d-none');
    stopBtn.classList.add('d-none');
    timer.classList.add('d-none');
    previewVideo.classList.remove('d-none');
    recordedVideo.classList.add('d-none');
}

function showRecordingState() {
    idleState.classList.add('d-none');
    recordingState.classList.remove('d-none');
    previewState.classList.add('d-none');

    startBtn.classList.add('d-none');
    stopBtn.classList.remove('d-none');
    stopBtn.disabled = false;
    setupControls.classList.add('d-none');
    timer.classList.remove('d-none');
    previewVideo.classList.add('d-none');
    startTimer();
}

function showPreviewState() {
    idleState.classList.add('d-none');
    recordingState.classList.add('d-none');
    previewState.classList.remove('d-none');

    recordedVideo.classList.remove('d-none');
    previewVideo.classList.add('d-none');
    timer.classList.add('d-none');
    recordingControls.classList.add('d-none');
    previewControls.classList.remove('d-none');
    stopBtn.classList.add('d-none');
    stopTimer();
}

function resetUI() {
    showIdleState();
    stopTimer();
    timer.textContent = '00:00:00';
}

export { showIdleState, showRecordingState, showPreviewState, resetUI };