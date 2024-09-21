let cursorCanvas;
let cursorCtx;
let cursorInterval;

function setupCursorCanvas(width, height) {
    cursorCanvas = document.createElement('canvas');
    cursorCanvas.width = width;
    cursorCanvas.height = height;
    cursorCtx = cursorCanvas.getContext('2d');
}

async function createStreamWithCursorHighlight(videoStream, audioStream) {
    const videoTrack = videoStream.getVideoTracks()[0];
    const { width, height } = videoTrack.getSettings();
    
    setupCursorCanvas(width, height);
    const cursorStream = cursorCanvas.captureStream();
    
    cursorInterval = setInterval(updateCursorPosition, 1000 / 60); // 60 fps
    
    return new MediaStream([
        videoTrack,
        ...cursorStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
    ]);
}

async function updateCursorPosition() {
    const { x, y } = await window.electronAPI.getCursorPosition();
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    cursorCtx.beginPath();
    cursorCtx.arc(x, y, 15, 0, 2 * Math.PI);
    cursorCtx.fillStyle = 'rgba(255, 255, 0, 0.5)';  // Yellow with 50% opacity
    cursorCtx.fill();
}

export { createStreamWithCursorHighlight, cursorInterval };