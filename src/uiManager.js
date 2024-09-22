import { startTimer, stopTimer } from './timerManager.js';
import { getVideoStream } from './sourceManager.js';

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
    idleState.classList.remove('hidden');
    recordingState.classList.add('hidden');
    previewState.classList.add('hidden');

    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    timer.classList.add('hidden');

    previewVideo.classList.remove('hidden');
    recordedVideo.classList.add('hidden');

    moveVideoContainerToIdleState();
}

function showRecordingState() {
    console.log('Showing recording state');
    idleState.classList.add('hidden');
    recordingState.classList.remove('hidden');
    previewState.classList.add('hidden');

    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    stopBtn.disabled = false;
    timer.classList.remove('hidden');

    const videoContainer = document.querySelector('.video-container');
    if (videoContainer && !recordingState.contains(videoContainer)) {
        recordingState.insertBefore(videoContainer, recordingState.firstChild);
    }

    previewVideo.classList.remove('hidden');
    recordedVideo.classList.add('hidden');
    startTimer();
}

function showPreviewState() {
    console.log('Showing preview state');
    idleState.classList.add('hidden');
    recordingState.classList.add('hidden');
    previewState.classList.remove('hidden');

    recordedVideo.classList.remove('hidden');
    previewVideo.classList.add('hidden');
    timer.classList.add('hidden');
    stopBtn.classList.add('hidden');
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

    previewVideo.classList.remove('hidden');
    if (!previewVideo.srcObject) {
        getVideoStream(document.getElementById("sourceSelect").value)
            .then(stream => {
                previewVideo.srcObject = stream;
                previewVideo.play();
            })
            .catch(error => console.error("Error resetting preview video:", error));
    }

    moveVideoContainerToIdleState();
}

function stopAndResetVideo(videoElement) {
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
        videoElement.src = '';
    }
}

function moveVideoContainerToIdleState() {
    const videoContainer = document.querySelector('.video-container');
    const idleStateContent = idleState.querySelector('.space-y-4');
    if (videoContainer && idleStateContent && !idleState.contains(videoContainer)) {
        idleState.insertBefore(videoContainer, idleStateContent);
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