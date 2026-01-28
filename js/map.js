const canvas=document.getElementById("mapCanvas");
const ctx=canvas.getContext("2d");
canvas.width=2000;
canvas.height=2000;

let bg=null;
let objects=[];
let tokens=[];
let selected=null;
let start=null;

const GRID=50;
const METERS=1.5;

const assets={
tree:"assets/map/tree.png",
rock:"assets/map/rock.png",
house:"assets/map/house.png",
monster:"assets/map/monster.png",
animal:"assets/map/animal.png",
chest:"assets/map/chest.png"
};

const palette=document.createElement("div");
palette.className="palette";
palette.innerHTML=Object.keys(assets).map(a=>`<button onclick="selectAsset('${a}')">${a}</button>`).join("");
document.body.appendChild(palette);

function selectAsset(a){ selected=assets[a]; }

function draw(){
ctx.clearRect(0,0,canvas.width,canvas.height);
if(bg) ctx.drawImage(bg,0,0,canvas.width,canvas.height);

objects.forEach(o=>{
let img=new Image();
img.src=o.src;
ctx.drawImage(img,o.x,o.y,50,50);
});

tokens.forEach(t=>{
let img=new Image();
img.src=t.img;
ctx.drawImage(img,t.x,t.y,50,50);
});
}

canvas.onclick=e=>{
const r=canvas.getBoundingClientRect();
const x=e.clientX-r.left;
const y=e.clientY-r.top;

if(selected){
objects.push({src:selected,x,y});
}else{
tokens.push({x,y,img:avatarPreview.src});
}
draw();
};

canvas.onmousedown=e=>start={x:e.offsetX,y:e.offsetY};
canvas.onmouseup=e=>{
let dx=e.offsetX-start.x;
let dy=e.offsetY-start.y;
let dist=Math.sqrt(dx*dx+dy*dy);
let sq=Math.round(dist/GRID);
alert(`📏 ${sq} quadrados ≈ ${(sq*METERS).toFixed(1)}m`);
};

const Map={
upload(e){
let img=new Image();
img.onload=()=>{bg=img;draw();}
img.src=URL.createObjectURL(e.target.files[0]);
}
};
