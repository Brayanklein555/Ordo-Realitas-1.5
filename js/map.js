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
    if (cw === 0 || ch === 0) return;

    ctx.strokeStyle = "rgba(255,0,255,0.25)";
    ctx.lineWidth = 1;

    for (let x = -offsetX % (gridSize * scale); x < cw; x += gridSize * scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
    }

    for (let y = -offsetY % (gridSize * scale); y < ch; y += gridSize * scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
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
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rulerStart.x, rulerStart.y);
    ctx.lineTo(rulerEnd.x, rulerEnd.y);
    ctx.stroke();

    const dx = rulerEnd.x - rulerStart.x;
    const dy = rulerEnd.y - rulerStart.y;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const grids = distPx / (gridSize * scale);
    const meters = (grids * metersPerGrid).toFixed(1);

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(`${meters} m`, rulerEnd.x + 6, rulerEnd.y - 6);
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

    ctx.restore();
    drawGrid();
    drawRuler();

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rulerActive) {
        rulerStart = { x, y };
        rulerEnd = { x, y };
        return;
    }

    draggingMap = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
});

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (rulerActive && rulerStart) {
        rulerEnd = { x, y };
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

// ===============================
// FORÇA RESIZE AO ENTRAR NA ABA
// ===============================
setTimeout(resizeCanvas, 100);
