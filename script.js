let currentUser = null;
let authMode = 'login';

// --- 1. INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    // Garante que o sistema comece na tela de login
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('main-content').style.display = 'none';
});

// --- 2. CONTROLE DO MENU LATERAL (SIDEBAR) ---
function toggleSidebar() {
    const sidebar = document.querySelector('.glass-sidebar');
    const overlay = document.getElementById('menu-overlay');
    
    // Liga/Desliga as classes
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Opcional: Fechar o menu automaticamente ao clicar em uma opção
document.querySelectorAll('.side-item').forEach(item => {
    item.addEventListener('click', () => {
        // Se não for o botão de sair, ele fecha o menu após o clique
        if (!item.classList.contains('logout')) {
            toggleSidebar();
        }
    });
});

// Fecha o menu se clicar em qualquer item lá dentro
document.querySelectorAll('.side-item').forEach(item => {
    item.addEventListener('click', () => {
        if (!item.classList.contains('logout')) {
            toggleSidebar();
        }
    });
});

// --- 3. NAVEGAÇÃO ENTRE PÁGINAS ---
function navigate(pageId) {
    // 1. Seleciona todas as seções
    const sections = document.querySelectorAll('.main-section');
    sections.forEach(s => s.classList.remove('active'));

    // 2. Ativa a página alvo
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
    }

    // 3. Atualiza o estado visual dos botões no menu
    const menuItems = document.querySelectorAll('.side-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
        // Se o clique veio do menu, marca como ativo
        if (item.getAttribute('onclick')?.includes(pageId)) {
            item.classList.add('active');
        }
    });

    // 4. Fecha o menu após navegar
    const sidebar = document.getElementById('side-menu');
    if (sidebar.classList.contains('open')) {
        toggleSidebar();
    }

    // 5. Se for inventário, carrega os dados
    if (pageId === 'page-inventario') {
        loadZebraInventory('ZT411');
    }

    window.scrollTo(0, 0);
}

// --- 4. SISTEMA DE AUTENTICAÇÃO ---
function toggleAuth(mode) {
    authMode = mode;
    const registerFields = document.getElementById('register-fields');
    const mainBtn = document.getElementById('auth-main-btn');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (mode === 'login') {
        registerFields.style.display = 'none';
        mainBtn.innerText = 'Acessar AXIS';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        registerFields.style.display = 'block';
        mainBtn.innerText = 'Finalizar Cadastro';
        tabLogin.classList.remove('active');
        tabRegister.classList.add('active');
    }
}

function handleAuth() {
    const userField = document.getElementById('username');
    const passField = document.getElementById('password');
    const userInput = userField.value.trim().toUpperCase();
    const pass = passField.value;

    if (authMode === 'register') {
        const nameField = document.getElementById('reg-fullname');
        const name = nameField.value.trim();
        
        if (!name || !userInput || !pass) return alert("Preencha todos os campos!");
        
        const userData = { name: name.toUpperCase(), pass: pass };
        localStorage.setItem('db_' + userInput, JSON.stringify(userData));
        alert("Conta criada com sucesso!");
        toggleAuth('login');
    } else {
        const dbRaw = localStorage.getItem('db_' + userInput);
        if (dbRaw) {
            const db = JSON.parse(dbRaw);
            if (db.pass === pass) {
                // SUCESSO NO LOGIN
                currentUser = db.name || userInput;
                
                // Atualiza saudação
                document.getElementById('user-display-name').innerText = currentUser;

                // Transição de telas
                document.getElementById('auth-screen').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
                
                // Inicia na Home
                navigate('page-home');
            } else {
                alert("Senha incorreta.");
            }
        } else {
            alert("Usuário não encontrado.");
        }
    }
}

// --- 5. FUNCIONALIDADES TÉCNICAS ---
function loadZebraInventory(modelPrefix) {
    const tableBody = document.getElementById('zt411-data');
    if (!tableBody) return;

    let html = '';
    for (let i = 1; i <= 50; i++) {
        const ip = `10.15.20.${i}`;
        const tag = `${modelPrefix}-IND-${i.toString().padStart(3, '0')}`;
        html += `
            <tr>
                <td><strong>${tag}</strong></td>
                <td>Zebra ${modelPrefix}</td>
                <td>${ip}</td>
                <td><span style="color: #34c759; font-weight: 600;">● Online</span></td>
                <td>Produção Sul</td>
            </tr>`;
    }
    tableBody.innerHTML = html;
}

function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.getElementById('eye-icon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerText = '🙈';
    } else {
        input.type = 'password';
        icon.innerText = '👁️';
    }
}

function logout() {
    if(confirm("Deseja realmente sair do sistema AXIS?")) {
        // Limpa campos e recarrega a aplicação (volta ao estado inicial)
        location.reload();
    }
}

// Placeholder para busca global
function handleGlobalSearch() {
    const query = document.getElementById('global-search').value.toUpperCase();
    console.log("Buscando por:", query);
    // Aqui você pode implementar a lógica de filtro da tabela
}
