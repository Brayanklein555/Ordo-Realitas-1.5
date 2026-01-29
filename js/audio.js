// ================================
// 🔊 CONTROLE DE ÁUDIO GLOBAL
// ================================

const ambientSound = new Audio("assets/ambient.mp3");
const clickSound   = new Audio("assets/click.mp3");
const diceSound    = new Audio("assets/dice.mp3");

// Configurações
ambientSound.loop = true;
ambientSound.volume = 0.4;
diceSound.volume = 0.7;
clickSound.volume = 0.6;

// Iniciar som ambiente ao primeiro clique do usuário
document.addEventListener("click", () => {
    if (ambientSound.paused) {
        ambientSound.play().catch(() => {});
    }
}, { once: true });

// Som ao trocar abas
function playClickSound() {
    clickSound.currentTime = 0;
    clickSound.play();
}

// Exportar para uso global
window.playClickSound = playClickSound;
window.diceSound = diceSound;
