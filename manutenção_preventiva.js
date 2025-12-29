// 1. GESTÃO DE FOTOS (COMPRESSÃO PARA SUPORTAR FOTOS GRANDES)
function removeImage(button) {
    const box = button.parentElement;
    const input = box.querySelector('input');
    box.style.backgroundImage = 'none';
    box.querySelector('.icon').style.display = 'block';
    box.querySelector('p').style.display = 'block';
    button.style.display = 'none';
    input.value = ''; 
}

document.querySelectorAll('.photo-box').forEach(box => {
    const input = box.querySelector('input');
    const removeBtn = box.querySelector('.remove-photo');
    box.addEventListener('click', (e) => { if (e.target !== removeBtn) input.click(); });
    
    input.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const scale = Math.min(800 / img.width, 1);
                    canvas.width = img.width * scale;
                    canvas.height = img.height * scale;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    box.style.backgroundImage = `url(${canvas.toDataURL('image/jpeg', 0.8)})`;
                    box.style.backgroundSize = 'cover';
                    box.querySelector('.icon').style.display = 'none';
                    box.querySelector('p').style.display = 'none';
                    removeBtn.style.display = 'flex';
                };
            };
            reader.readAsDataURL(this.files[0]);
        }
    });
});

// 2. GERADOR DE PDF FINALIZADO (2 PÁGINAS COM CHECKLIST UNIFICADO)
document.getElementById('preventiva-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const originalElement = document.querySelector('.glass-container');
    const worker = originalElement.cloneNode(true);

    // --- AJUSTES DE BORDAS E ESPAÇAMENTO ---
    worker.style.background = "#ffffff";
    worker.style.width = "790px"; // Largura máxima A4
    worker.style.padding = "10px"; // Bordas menores
    worker.querySelectorAll('button').forEach(b => b.remove());

    // Ajuste dos campos de Identificação para ocupar menos espaço vertical
    worker.querySelectorAll('.row, .row-3').forEach(row => {
        row.style.display = "flex";
        row.style.marginBottom = "5px";
        row.querySelectorAll('.input-group').forEach(group => {
            group.style.flex = "1";
            group.style.margin = "0 5px";
            group.style.fontSize = "11px";
        });
    });

    // --- UNIFICAÇÃO DO CHECKLIST NA PÁGINA 1 ---
    // Removemos qualquer quebra de página automática do checklist
    const cards = worker.querySelectorAll('.card-checklist');
    cards.forEach(card => {
        card.style.pageBreakInside = "avoid";
        card.style.marginBottom = "8px";
    });

    // --- QUEBRA DE PÁGINA SOMENTE PARA DESCRIÇÃO E FOTOS ---
    const descSec = worker.querySelector('.form-section:nth-last-of-type(2)');
    if(descSec) {
        descSec.style.pageBreakBefore = "always";
        descSec.style.marginTop = "10px";
    }

    // --- AJUSTE DAS FOTOS DE EVIDÊNCIA (FOTO 05) ---
    const grids = worker.querySelectorAll('.photo-grid, .photo-grid-5');
    grids.forEach(grid => {
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(5, 1fr)"; // Garante 5 colunas iguais
        grid.style.gap = "5px";
        grid.style.marginTop = "10px";
        
        grid.querySelectorAll('.photo-box').forEach(box => {
            box.style.height = "110px"; // Altura fixa para caber tudo
            box.style.width = "100%";
            box.style.border = "1px solid #ccc";
        });
    });

    // --- ASSINATURA FINAL ---
    const assinatura = document.createElement('div');
    assinatura.style.cssText = "margin-top: 20px; text-align: center; border-top: 1px solid #000; padding-top: 15px; page-break-inside: avoid;";
    assinatura.innerHTML = `
        <div style="width: 250px; border-top: 2px solid #000; margin: 0 auto 5px auto;"></div>
        <p style="margin: 0; font-weight: bold; font-size: 15px; text-transform: uppercase;">FILIPE DA SILVA</p>
        <p style="margin: 0; font-size: 13px;">Operação Logística - Mercado Livre</p>
        <p style="font-size: 9px; color: #777; margin-top: 10px;">Relatório de Vistoria Técnica - ${new Date().toLocaleString('pt-BR')}</p>
    `;
    worker.appendChild(assinatura);

    const opt = {
        margin: [5, 5, 5, 5], // Margens mínimas do PDF
        filename: `Vistoria_ML_Final.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(worker).save().then(() => {
        alert('PDF 100% Finalizado e pronto para uso!');
    });
});