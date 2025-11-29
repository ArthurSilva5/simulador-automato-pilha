const formatarPilha = (pilha) => {
    if (!pilha || pilha.length === 0) {
        return "(vazia)";
    }
    
    return pilha.join(" ");
};

const exibirPilha = (pilha) => {
    const elementoPilha = document.getElementById("exPilha");
    
    if (!pilha || pilha.length === 0) {
        elementoPilha.innerHTML = '<div class="text-muted">(vazia)</div>';
        return;
    }

    let html = "";
    for (let i = pilha.length - 1; i >= 0; i--) {
        html += `<div class="border-bottom p-2 text-center bg-light">${pilha[i]}</div>`;
    }
    elementoPilha.innerHTML = html;
};

const exibirEstadoAtual = () => {
    const elementoEstado = document.getElementById("exEstado");
    const elementoEntrada = document.getElementById("exEntrada");
    const elementoTransicao = document.getElementById("exTransicao");

    if (!execucao) {
        elementoEstado.textContent = "";
        elementoEntrada.textContent = "";
        elementoTransicao.textContent = "";
        return;
    }

    elementoEstado.textContent = execucao.estado;
    
    const entradaVazia = execucao.entrada === "";
    elementoEntrada.textContent = entradaVazia ? "ε" : execucao.entrada;
    
    if (historicoPassos.length > 0) {
        const ultimoPasso = historicoPassos[historicoPassos.length - 1];
        elementoTransicao.textContent = ultimoPasso.transicao;
    } else {
        elementoTransicao.textContent = "Estado inicial";
    }
};

const exibirTabelaPassos = () => {
    const tbody = document.getElementById("tabelaPassos");
    tbody.innerHTML = "";

    if (historicoPassos.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = '<td colspan="5" class="text-center text-muted">Nenhum passo executado ainda</td>';
        tbody.appendChild(tr);
        return;
    }

    historicoPassos.forEach((passo, index) => {
        const tr = document.createElement("tr");
        const numeroPasso = index + 1;
        const estadoAtual = passo.estado;
        const entradaRestante = passo.entrada === "" ? "ε" : passo.entrada;
        const pilhaFormatada = formatarPilha(passo.pilha);
        const transicaoAplicada = passo.transicao;
        
        tr.innerHTML = `
            <td>${numeroPasso}</td>
            <td class="fw-bold">${estadoAtual}</td>
            <td class="font-monospace">${entradaRestante}</td>
            <td class="font-monospace">${pilhaFormatada}</td>
            <td class="font-monospace small">${transicaoAplicada}</td>
        `;
        tbody.appendChild(tr);
    });
};

const exibirResultadoFinal = () => {
    const elementoResultado = document.getElementById("exResultado");

    if (!execucao) {
        elementoResultado.textContent = "";
        elementoResultado.className = "text-center fw-bold";
        return;
    }

    if (verificarAceitacao()) {
        elementoResultado.textContent = "✓ SENTENÇA ACEITA";
        elementoResultado.className = "text-center fw-bold text-success";
        return;
    }

    if (verificarRejeicao()) {
        elementoResultado.textContent = "✗ SENTENÇA REJEITADA";
        elementoResultado.className = "text-center fw-bold text-danger";
        return;
    }

    elementoResultado.textContent = "";
    elementoResultado.className = "text-center fw-bold";
};

const exibirExecucao = () => {
    exibirEstadoAtual();
    
    if (execucao) {
        exibirPilha(execucao.pilha);
    } else {
        const elementoPilha = document.getElementById("exPilha");
        elementoPilha.innerHTML = '<div class="text-muted">(vazia)</div>';
    }

    exibirTabelaPassos();
    exibirResultadoFinal();
};
