// ===============================
// 🗺️ MAPA INTERATIVO BASE (ROLL20)
// ===============================

const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

let cw, ch;
function resizeCanvas() {
    cw = canvas.width = canvas.clientWidth;
    ch = canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Estado do mapa
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;

// Imagem do mapa
let mapImage = new Image();
let hasMap = false;

// ===============================
// GRID
// ===============================
const gridSize = 50;

function drawGrid() {
    ctx.strokeStyle = "rgba(255,0,255,0.15)";
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
// RENDER
// ===============================
function render() {
    ctx.clearRect(0, 0, cw, ch);

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    if (hasMap) {
        ctx.drawImage(mapImage, 0, 0);
    }

    ctx.restore();
    drawGrid();

    requestAnimationFrame(render);
}
render();

// ===============================
// ZOOM
// ===============================
canvas.addEventListener("wheel", e => {
    e.preventDefault();
    const zoomAmount = e.deltaY * -0.001;
    scale += zoomAmount;
    scale = Math.min(Math.max(scale, 0.2), 4);
});

// ===============================
// PAN (ARRASTAR)
// ===============================
canvas.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    canvas.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
    isDragging = false;
    canvas.style.cursor = "grab";
});

window.addEventListener("mousemove", e => {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
});

// ===============================
// UPLOAD DE MAPA
// ===============================
const upload = document.getElementById("mapUpload");
upload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
        mapImage.src = ev.target.result;
        hasMap = true;
    };
    reader.readAsDataURL(file);
});
