import { startTimer, stopTimer } from './timerManager.js';

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const timer = document.getElementById('timer');
const previewVideo = document.getElementById('previewVideo');
const recordedVideo = document.getElementById('recordedVideo');

const idleState = document.getElementById('idleState');
const recordingState = document.getElementById('recordingState');
const previewState = document.getElementById('previewState');

function showIdleState() {
    console.log('Showing idle state');
    idleState.classList.remove('d-none');
    recordingState.classList.add('d-none');
    previewState.classList.add('d-none');

    startBtn.classList.remove('d-none');
    stopBtn.classList.add('d-none');
    timer.classList.add('d-none');
    
    previewVideo.classList.remove('d-none');
    recordedVideo.classList.add('d-none');
}

function showRecordingState() {
    console.log('Showing recording state');
    idleState.classList.add('d-none');
    recordingState.classList.remove('d-none');
    previewState.classList.add('d-none');

    startBtn.classList.add('d-none');
    stopBtn.classList.remove('d-none');
    stopBtn.disabled = false;
    timer.classList.remove('d-none');
    
    // Move the video container to the recording state, above the timer
    const videoContainer = document.querySelector('.video-container');
    const timerElement = recordingState.querySelector('#timer');
    recordingState.insertBefore(videoContainer, timerElement);
    
    previewVideo.classList.remove('d-none');
    recordedVideo.classList.add('d-none');
    startTimer();
}

function showPreviewState() {
    console.log('Showing preview state');
    idleState.classList.add('d-none');
    recordingState.classList.add('d-none');
    previewState.classList.remove('d-none');

    recordedVideo.classList.remove('d-none');
    previewVideo.classList.add('d-none');
    timer.classList.add('d-none');
    stopBtn.classList.add('d-none');
    stopTimer();
}

function showLoadingState() {
    console.log('Showing loading state');
    const loadingMessage = document.createElement('div');
    loadingMessage.textContent = 'Preparing to record...';
    loadingMessage.id = 'loadingMessage';
    loadingMessage.className = 'text-center mt-3';
    document.querySelector('.container').appendChild(loadingMessage);
}

function hideLoadingState() {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

function resetUI() {
    console.log('Resetting UI');
    showIdleState();
    stopTimer();
    timer.textContent = '00:00:00';
    hideLoadingState();
    stopAndResetVideo(recordedVideo);
}

function stopAndResetVideo(videoElement) {
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
        videoElement.src = '';
    }
}

export { 
    showIdleState, 
    showRecordingState, 
    showPreviewState, 
    resetUI, 
    showLoadingState, 
    hideLoadingState,
    stopAndResetVideo
};