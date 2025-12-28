let currentUser = null;
let currentMode = 'pessoal';
let authMode = 'login';
let pomoInterval = null;

// CONTROLE DE TELAS (LOGIN vs CADASTRO)
function toggleAuth(mode) {
    authMode = mode;
    document.getElementById('tab-login').classList.toggle('active', mode === 'login');
    document.getElementById('tab-register').classList.toggle('active', mode === 'register');
    
    // Mostra/Esconde campos de Nome e Email
    const registerFields = document.getElementById('register-only-fields');
    registerFields.style.display = mode === 'register' ? 'block' : 'none';
    
    // Altera o texto do botão principal
    document.getElementById('auth-main-btn').innerText = mode === 'login' ? 'Acessar AXIS' : 'Finalizar Cadastro';
}

// OLHO DA SENHA (JÁ FIXADO)
function togglePassword() {
    const p = document.getElementById('password');
    const eye = document.querySelector('.eye-icon');
    if (p.type === 'password') {
        p.type = 'text';
        eye.innerText = '🙈';
    } else {
        p.type = 'password';
        eye.innerText = '👁️';
    }
}

// LOGICA DE AUTENTICAÇÃO E CADASTRO
function handleAuth() {
    const user = document.getElementById('username').value.trim().toUpperCase();
    const pass = document.getElementById('password').value;

    if (authMode === 'register') {
        const fullName = document.getElementById('reg-fullname').value.trim();
        const email = document.getElementById('reg-email').value.trim();

        if (!fullName || !email || !user || !pass) {
            alert("Por favor, preencha todos os 4 campos para o cadastro AXIS.");
            return;
        }

        const userData = {
            name: fullName,
            email: email,
            pass: pass,
            tasks: [],
            fin: [],
            habits: [
                {n: "Beber Água", d: false},
                {n: "Check Sistema", d: false},
                {n: "Leitura", d: false}
            ],
            diary: { pessoal: "", profissional: "" }
        };

        localStorage.setItem('db_' + user, JSON.stringify(userData));
        alert(`Conta AXIS criada com sucesso! Bem-vindo, ${fullName}.`);
        toggleAuth('login');
        
    } else {
        // Lógica de Login
        const storedData = JSON.parse(localStorage.getItem('db_' + user));
        
        if (storedData && storedData.pass === pass) {
            currentUser = user;
            document.getElementById('auth-screen').style.display = 'none';
            document.getElementById('main-content').style.display = 'block';
            updateUI();
        } else {
            alert("Credenciais INVÁLIDAS.");
        }
    }
}

// ATUALIZAÇÃO DA INTERFACE (USA O NOME SALVO)
function updateUI() {
    const db = JSON.parse(localStorage.getItem('db_' + currentUser));
    // Aqui usamos o NOME REAL em vez do usuário
    document.getElementById('welcome-msg').innerText = db.name || currentUser;
    
    renderHabits(db);
    renderTasks(db);
    renderFinance(db);
    document.getElementById('diary-input').value = db.diary[currentMode] || "";
}

// --- FUNÇÕES DO DASHBOARD (HÁBITOS, TAREFAS, FINANÇAS) ---

function renderHabits(db) {
    const list = document.getElementById('habit-list');
    list.innerHTML = '';
    let done = 0;
    db.habits.forEach((h, i) => {
        if (h.d) done++;
        list.innerHTML += `<div class="habit-item ${h.d ? 'done' : ''}" onclick="toggleHabit(${i})">${h.n}</div>`;
    });
    document.getElementById('habit-progress').style.width = (done / db.habits.length * 100) + '%';
}

function toggleHabit(index) {
    const db = JSON.parse(localStorage.getItem('db_' + currentUser));
    db.habits[index].d = !db.habits[index].d;
    localStorage.setItem('db_' + currentUser, JSON.stringify(db));
    updateUI();
}

function addTodo() {
    const val = document.getElementById('todo-input').value;
    if (!val) return;
    const db = JSON.parse(localStorage.getItem('db_' + currentUser));
    db.tasks.push({ text: val, mode: currentMode });
    localStorage.setItem('db_' + currentUser, JSON.stringify(db));
    document.getElementById('todo-input').value = '';
    updateUI();
}

function renderTasks(db) {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    db.tasks.filter(t => t.mode === currentMode).forEach(t => {
        list.innerHTML += `<li>${t.text}</li>`;
    });
}

function addFinance() {
    const desc = document.getElementById('fin-desc').value;
    const val = parseFloat(document.getElementById('fin-val').value);
    if (!desc || isNaN(val)) return;
    const db = JSON.parse(localStorage.getItem('db_' + currentUser));
    db.fin.push({ desc, val, mode: currentMode });
    localStorage.setItem('db_' + currentUser, JSON.stringify(db));
    document.getElementById('fin-desc').value = '';
    document.getElementById('fin-val').value = '';
    updateUI();
}

function renderFinance(db) {
    const list = document.getElementById('fin-list');
    list.innerHTML = '';
    let total = 0;
    db.fin.filter(f => f.mode === currentMode).forEach(f => {
        total += f.val;
        list.innerHTML += `<li class="finance-item"><span>${f.desc}</span> <span>R$ ${f.val.toFixed(2)}</span></li>`;
    });
    document.getElementById('fin-total').innerText = `R$ ${total.toFixed(2)}`;
}

function saveDiary() {
    const db = JSON.parse(localStorage.getItem('db_' + currentUser));
    db.diary[currentMode] = document.getElementById('diary-input').value;
    localStorage.setItem('db_' + currentUser, JSON.stringify(db));
    alert("Notas AXIS salvas!");
}

function togglePomodoro() {
    if (pomoInterval) { 
        clearInterval(pomoInterval); 
        pomoInterval = null; 
        document.getElementById('btn-pomo').innerText = '▶';
    } else {
        let t = 1500;
        document.getElementById('btn-pomo').innerText = '⏸';
        pomoInterval = setInterval(() => {
            t--;
            let m = Math.floor(t/60), s = t%60;
            document.getElementById('pomo-timer').innerText = `${m}:${s<10?'0':''}${s}`;
            if (t <= 0) { clearInterval(pomoInterval); alert("Tempo Esgotado!"); }
        }, 1000);
    }
}

function switchMode() {
    currentMode = currentMode === 'pessoal' ? 'profissional' : 'pessoal';
    document.getElementById('mode-toggle').innerText = `Perfil: ${currentMode}`;
    updateUI();
}

function logout() { location.reload(); }
