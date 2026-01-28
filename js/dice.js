const diceQty=document.getElementById("diceQty");
for(let i=1;i<=100;i++) diceQty.innerHTML+=`<option>${i}</option>`;
diceQty.value=1;

function rollDice(faces=null,qty=null){
diceSound.play();
faces=faces||Number(diceType.value);
qty=qty||Number(diceQty.value);

let rolls=[],max=0;
for(let i=0;i<qty;i++){
let r=Math.floor(Math.random()*faces)+1;
rolls.push(r); max=Math.max(max,r);
}

diceVisual.innerHTML=`<img src="assets/dice/d${faces}.png">`;
diceText.innerHTML=`Resultados: ${rolls.join(",")} | ⭐ ${max}`;
history.innerHTML=`<div>${qty}xD${faces} → ${max}</div>`+history.innerHTML;
return {rolls,max};
}
