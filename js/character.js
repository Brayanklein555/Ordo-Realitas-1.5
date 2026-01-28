const Inventory={
list:JSON.parse(localStorage.getItem("inv")||"[]"),
render(){
inventoryList.innerHTML="";
this.list.forEach((i,idx)=>{
let li=document.createElement("li");
li.textContent=i;
li.onclick=()=>{this.list.splice(idx,1);this.save();}
inventoryList.appendChild(li);
});
},
add(){
if(itemInput.value){
this.list.push(itemInput.value);
itemInput.value="";
this.save();
}
},
save(){
localStorage.setItem("inv",JSON.stringify(this.list));
this.render();
}
};

const Avatar={
upload(e){
let r=new FileReader();
r.onload=()=>avatarPreview.src=r.result;
r.readAsDataURL(e.target.files[0]);
}
};

function rollAttribute(attr){
const v=Number(document.getElementById(attr).value);
const r=rollDice(20,v);
alert("Maior resultado: "+r.max);
}

Inventory.render();
