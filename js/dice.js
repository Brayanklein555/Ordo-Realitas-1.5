// ===============================
// 🎲 SISTEMA DE DADOS AVANÇADO
// ===============================

let diceHistory = [];

// Agora inclui D6
const diceTypes = [4, 6, 8, 10, 12, 20, 50, 100];

let selectedDice = 20;
let rollAmount = 1;

// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
    createDiceButtons();
    updateRollAmountLabel();
});

// -------------------------------
// Criar botões
// -------------------------------
function createDiceButtons() {
    const container = document.getElementById("dice-types");
    if (!container) return;

    container.innerHTML = "";

    diceTypes.forEach(type => {
        const btn = document.createElement("button");
        btn.className = "dice-btn";
        btn.innerText = `D${type}`;
        btn.onclick = () => selectDice(type, btn);
        container.appendChild(btn);

        if (type === selectedDice) {
            btn.classList.add("active");
        }
    });
}

function selectDice(type, btn) {
    selectedDice = type;
    document.querySelectorAll(".dice-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// -------------------------------
// Quantidade
// -------------------------------
function changeRollAmount(value) {
    rollAmount += value;
    if (rollAmount < 1) rollAmount = 1;
    if (rollAmount > 100) rollAmount = 100;
    updateRollAmountLabel();
}

function updateRollAmountLabel() {
    const el = document.getElementById("roll-amount");
    if (el) el.innerText = rollAmount + "x";
}

// -------------------------------
// Rolagem
// -------------------------------
function rollDice() {

    if (window.diceSound) {
        window.diceSound.currentTime = 0;
        window.diceSound.play();
    }

    let results = [];

    for (let i = 0; i < rollAmount; i++) {
        results.push(Math.floor(Math.random() * selectedDice) + 1);
    }

    const max = Math.max(...results);

    const rollData = {
        dice: `D${selectedDice}`,
        amount: rollAmount,
        results,
        max,
        time: new Date().toLocaleTimeString()
    };

    diceHistory.unshift(rollData);
    if (diceHistory.length > 30) diceHistory.pop();

    renderResult(rollData);
    renderHistory();
}

// -------------------------------
// Resultado
// -------------------------------
function renderResult(data) {
    const panel = document.getElementById("dice-result");
    if (!panel) return;

    panel.innerHTML = `
        <h2>🎯 Resultado</h2>
        <p><strong>${data.dice}</strong> | ${data.amount}x dados</p>
        <p>🎲 Valores: ${data.results.join(", ")}</p>
        <h1>🔥 Maior Resultado: ${data.max}</h1>
    `;
}

// -------------------------------
// Histórico
// -------------------------------
function renderHistory() {
    const list = document.getElementById("dice-history");
    if (!list) return;

    list.innerHTML = "";

    diceHistory.forEach(item => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <small>${item.time}</small><br>
            ${item.dice} | ${item.amount}x → <strong>${item.max}</strong>
        `;
        list.appendChild(div);
    });
}

// -------------------------------
// Rolagem por atributo (para ficha)
// -------------------------------
function rollByAttribute(attributeValue) {
    rollAmount = attributeValue;
    updateRollAmountLabel();
    rollDice();
}
