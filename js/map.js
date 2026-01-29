const mapUpload = document.getElementById("mapUpload");
const avatarUpload = document.getElementById("avatarUpload");
const mapArea = document.getElementById("mapArea");
const mapSelector = document.getElementById("mapSelector");

let maps = [];

mapUpload.addEventListener("change", e=>{
    [...e.target.files].forEach(file=>{
        const reader = new FileReader();
        reader.onload = ev=>{
            maps.push(ev.target.result);
            updateSelector();
        };
        reader.readAsDataURL(file);
    });
});

function updateSelector(){
    mapSelector.innerHTML="";
    maps.forEach((m,i)=>{
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = "Mapa " + (i+1);
        mapSelector.appendChild(opt);
    });
    renderMap();
}

mapSelector.addEventListener("change", renderMap);

function renderMap(){
    mapArea.innerHTML="";
    if(!maps.length) return;

    const img = document.createElement("img");
    img.src = maps[mapSelector.value];
    img.style.width="100%";
    img.style.height="100%";
    img.style.objectFit="contain";
    mapArea.appendChild(img);
}

// AVATARES
avatarUpload.addEventListener("change", e=>{
    [...e.target.files].forEach(file=>{
        const reader = new FileReader();
        reader.onload = ev=>{
            const token = document.createElement("img");
            token.src = ev.target.result;
            token.style.width="60px";
            token.style.position="absolute";
            token.style.left="20px";
            token.style.top="20px";
            token.style.cursor="move";
            token.draggable = true;
            mapArea.appendChild(token);
        };
        reader.readAsDataURL(file);
    });
});
