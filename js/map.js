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

// ===============================
// ESTADO
// ===============================
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isDragging = false;
let startX, startY;

// ===============================
// MAPAS
// ===============================
let maps = [];
let currentMapIndex = 0;

// ===============================
// AVATARES
// ===============================
let avatars = [];
let selectedAvatar = null;

// ===============================
// GRID
// ===============================
const gridSize = 50;

function drawGrid() {
    ctx.strokeStyle = "rgba(255,0,0,0.15)";
    ctx.lineWidth = 1;

    const scaledGrid = gridSize * scale;

    for (let x = offsetX % scaledGrid; x < cw; x += scaledGrid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
    }

    for (let y = offsetY % scaledGrid; y < ch; y += scaledGrid) {
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

    if (maps[currentMapIndex]) {
        ctx.drawImage(maps[currentMapIndex], 0, 0);
    }

    avatars.forEach(a => {
        ctx.drawImage(a.img, a.x - 25, a.y - 25, 50, 50);
    });

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
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(scale, 0.3), 4);
});

// ===============================
// PAN
// ===============================
canvas.addEventListener("mousedown", e => {
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    canvas.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
    isDragging = false;
    selectedAvatar = null;
    canvas.style.cursor = "grab";
});

window.addEventListener("mousemove", e => {
    if (!isDragging) return;

    if (selectedAvatar) {
        selectedAvatar.x = (e.clientX - offsetX) / scale;
        selectedAvatar.y = (e.clientY - offsetY) / scale;
    } else {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
    }
});

// ===============================
// SELEÇÃO DE AVATAR
// ===============================
canvas.addEventListener("mousedown", e => {
    const x = (e.clientX - offsetX) / scale;
    const y = (e.clientY - offsetY) / scale;

    avatars.forEach(a => {
        if (
            x > a.x - 25 &&
            x < a.x + 25 &&
            y > a.y - 25 &&
            y < a.y + 25
        ) {
            selectedAvatar = a;
        }
    });
});

// ===============================
// UPLOAD MAPAS
// ===============================
document.getElementById("mapUpload").addEventListener("change", e => {
    [...e.target.files].forEach(file => {
        const img = new Image();
        img.onload = () => {
            maps.push(img);
            currentMapIndex = maps.length - 1;
        };
        img.src = URL.createObjectURL(file);
    });
});

// ===============================
// UPLOAD AVATARES
// ===============================
document.getElementById("avatarUpload").addEventListener("change", e => {
    [...e.target.files].forEach(file => {
        const img = new Image();
        img.onload = () => {
            avatars.push({
                img,
                x: 200,
                y: 200
            });
        };
        img.src = URL.createObjectURL(file);
    });
});
