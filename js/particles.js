const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

function resize(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

let particles = [];

for(let i=0;i<120;i++){
    particles.push({
        x:Math.random()*canvas.width,
        y:canvas.height + Math.random()*300,
        size:Math.random()*3+1,
        speed:Math.random()*1+0.5,
        alpha:Math.random()
    });
}

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    particles.forEach(p=>{
        p.y -= p.speed;
        if(p.y < -10){
            p.y = canvas.height + 200;
            p.x = Math.random()*canvas.width;
        }

        ctx.fillStyle = `rgba(255,0,0,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fill();
    });

    requestAnimationFrame(animate);
}
animate();
