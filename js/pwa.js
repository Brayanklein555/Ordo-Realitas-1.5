if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}

let deferredPrompt;
window.addEventListener("beforeinstallprompt",e=>{
e.preventDefault();
deferredPrompt=e;
const btn=document.createElement("button");
btn.innerText="Instalar App";
btn.className="install-btn";
btn.onclick=()=>deferredPrompt.prompt();
document.body.appendChild(btn);
});
