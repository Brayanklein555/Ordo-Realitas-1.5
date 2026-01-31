// ===============================
// 🗺️ MAPA + GRID + RÉGUA (ROLL20)
// ===============================

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

let cw = 0, ch = 0;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    cw = canvas.width;
    ch = canvas.height;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ===============================
// ESTADO
// ===============================
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let draggingMap = false;
let startX = 0, startY = 0;

let mapImage = new Image();
let hasMap = false;

// ===============================
// GRID
// ===============================
const gridSize = 50;
const metersPerGrid = 1.5;

function drawGrid() {
    ctx.strokeStyle = "rgba(255,0,255,0.25)";
    ctx.lineWidth = 1 / scale;

    const startX = -offsetX / scale;
    const startY = -offsetY / scale;
    const endX = startX + cw / scale;
    const endY = startY + ch / scale;

    for (let x = Math.floor(startX / gridSize) * gridSize; x < endX; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
        ctx.stroke();
    }

    for (let y = Math.floor(startY / gridSize) * gridSize; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }
}

// ===============================
// RÉGUA
// ===============================
let rulerActive = false;
let rulerStart = null;
let rulerEnd = null;

function toggleRuler() {
    rulerActive = !rulerActive;
    rulerStart = rulerEnd = null;
}

function drawRuler() {
    if (!rulerStart || !rulerEnd) return;

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2 / scale;
    ctx.beginPath();
    ctx.moveTo(rulerStart.x, rulerStart.y);
    ctx.lineTo(rulerEnd.x, rulerEnd.y);
    ctx.stroke();

    const dx = rulerEnd.x - rulerStart.x;
    const dy = rulerEnd.y - rulerStart.y;
    const distWorld = Math.sqrt(dx * dx + dy * dy);
    const grids = distWorld / gridSize;
    const meters = (grids * metersPerGrid).toFixed(1);

    ctx.fillStyle = "white";
    ctx.font = `${14 / scale}px Arial`;
    ctx.fillText(`${meters} m`, rulerEnd.x + 8 / scale, rulerEnd.y - 8 / scale);
}

// ===============================
// UTIL
// ===============================
function screenToWorld(x, y) {
    return {
        x: (x - offsetX) / scale,
        y: (y - offsetY) / scale
    };
}

// ===============================
// RENDER LOOP
// ===============================
function render() {
    ctx.clearRect(0, 0, cw, ch);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    if (hasMap) ctx.drawImage(mapImage, 0, 0);
    drawGrid();
    drawRuler();

    ctx.restore();

    requestAnimationFrame(render);
}
render();

// ===============================
// ZOOM
// ===============================
canvas.addEventListener("wheel", e => {
    e.preventDefault();
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(scale, 0.3), 4);
});

// ===============================
// PAN / RÉGUA
// ===============================
canvas.addEventListener("mousedown", e => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (rulerActive) {
        rulerStart = screenToWorld(sx, sy);
        rulerEnd = rulerStart;
        return;
    }

    draggingMap = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (rulerActive && rulerStart) {
        rulerEnd = screenToWorld(sx, sy);
        return;
    }

    if (!draggingMap) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
});

window.addEventListener("mouseup", () => draggingMap = false);

// ===============================
// UPLOAD MAPA
// ===============================
document.getElementById("mapUpload").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
        mapImage.src = ev.target.result;
        hasMap = true;
    };
    reader.readAsDataURL(file);
});
