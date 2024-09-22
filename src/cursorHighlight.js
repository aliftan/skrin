let cursorCanvas, cursorCtx, cursorInterval;
let isHighlightActive = false;

function setupCursorCanvas() {
    cursorCanvas = document.createElement('canvas');
    cursorCanvas.width = window.screen.width;
    cursorCanvas.height = window.screen.height;
    cursorCtx = cursorCanvas.getContext('2d');

    cursorCanvas.style.position = 'fixed';
    cursorCanvas.style.top = '0';
    cursorCanvas.style.left = '0';
    cursorCanvas.style.width = '100%';
    cursorCanvas.style.height = '100%';
    cursorCanvas.style.pointerEvents = 'none';
    cursorCanvas.style.zIndex = '9999';
    document.body.appendChild(cursorCanvas);
}

async function createStreamWithCursorHighlight(videoStream, audioStream, highlight) {
    isHighlightActive = highlight;
    setupCursorCanvas();

    cursorInterval = setInterval(updateCursorPosition, 1000 / 60); // 60 fps

    const cursorStream = cursorCanvas.captureStream(60); // 60 fps

    return new MediaStream([
        videoStream.getVideoTracks()[0],
        cursorStream.getVideoTracks()[0],
        ...audioStream.getAudioTracks()
    ]);
}

async function updateCursorPosition() {
    if (!isHighlightActive) {
        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        return;
    }

    try {
        const { x, y } = await window.electronAPI.getCursorPosition();

        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

        const radius = 20; // Larger highlighter

        cursorCtx.beginPath();
        cursorCtx.arc(x, y, radius, 0, 2 * Math.PI);
        cursorCtx.fillStyle = 'rgba(255, 255, 0, 0.7)';
        cursorCtx.fill();
        cursorCtx.strokeStyle = 'black';
        cursorCtx.lineWidth = 3;
        cursorCtx.stroke();
    } catch (error) {
        console.error('Error getting cursor position:', error);
    }
}

function stopCursorHighlight() {
    if (cursorInterval) {
        clearInterval(cursorInterval);
    }
    if (cursorCanvas) {
        cursorCanvas.remove();
    }
    isHighlightActive = false;
}

export { createStreamWithCursorHighlight, cursorInterval, stopCursorHighlight };
