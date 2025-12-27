// Referências
const body = document.body;
const btnToggle = document.getElementById('btn-toggle');
const title = document.getElementById('main-title');
const desc = document.getElementById('description');
const editor = document.getElementById('main-editor');
const saveStatus = document.getElementById('save-status');
const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

let currentProfile = 'personal';
let isDrawing = false;

// Configuração inicial do Canvas
function setupCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';
}

// Lógica de Desenho
canvas.addEventListener('mousedown', () => isDrawing = true);
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
    saveCanvas();
});
canvas.addEventListener('mousemove', draw);

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvas();
}

// Salvar e Carregar Desenhos
function saveCanvas() {
    const key = `canvas_${currentProfile}`;
    localStorage.setItem(key, canvas.toDataURL());
}

function loadCanvas() {
    const key = `canvas_${currentProfile}`;
    const dataURL = localStorage.getItem(key);
    if (dataURL) {
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Alternar Perfil (Atualizado)
function toggleProfile() {
    if (currentProfile === 'personal') {
        currentProfile = 'professional';
        body.className = 'theme-professional';
        btnToggle.innerText = 'Alternar para Pessoal';
        title.innerText = 'Painel Profissional';
        desc.innerText = 'Gestão de projetos e notas de trabalho.';
    } else {
        currentProfile = 'personal';
        body.className = 'theme-personal';
        btnToggle.innerText = 'Alternar para Profissional';
        title.innerText = 'Meu Diário Pessoal';
        desc.innerText = 'Espaço para reflexões e notas íntimas.';
    }
    loadContent();
    loadCanvas();
}

// Salvar texto
editor.addEventListener('input', () => {
    localStorage.setItem(`content_${currentProfile}`, editor.value);
    saveStatus.innerText = "Salvando...";
    setTimeout(() => saveStatus.innerText = "Salvo localmente", 1000);
});

function loadContent() {
    editor.value = localStorage.getItem(`content_${currentProfile}`) || "";
}

window.onload = () => {
    setupCanvas();
    loadContent();
    loadCanvas();
};