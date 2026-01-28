const Combat={
hp:20,
attack(){
let atk=rollDice(20,1).max;
let dmg=rollDice(6,1).max;
this.hp-=dmg;
combatLog.innerHTML+=`<div>Ataque ${atk} | Dano ${dmg} | HP ${this.hp}</div>`;
if(this.hp<=0){ combatLog.innerHTML+="<b>Inimigo derrotado</b>"; this.hp=20; }
}
};
