// VALIDAÇÃO BÁSICA DAS TRANSICOES
const validarTransicao = (estadoAtual, proximoEstado, lidoFita, lidoPilha, gravadoPilha) => {
    if (!dadosAutomato) {
        return { valido: false, mensagem: "Confirme os dados do autômato primeiro." };
    }

    if (!estadoAtual || !proximoEstado) {
        return { valido: false, mensagem: "Estados não podem ser vazios." };
    }

    if (!dadosAutomato.estados.includes(estadoAtual)) {
        return { valido: false, mensagem: `Estado atual "${estadoAtual}" não existe na lista de estados.` };
    }

    if (!dadosAutomato.estados.includes(proximoEstado)) {
        return { valido: false, mensagem: `Próximo estado "${proximoEstado}" não existe na lista de estados.` };
    }

    const lidoFitaEhTesteVazio = lidoFita === "?";
    const lidoFitaEhMovimentoVazio = lidoFita === "e";
    const lidoFitaEhVazio = lidoFita === "";
    const lidoFitaEhSimboloValido = dadosAutomato.alfabetoEntrada.includes(lidoFita);
    
    if (!lidoFitaEhTesteVazio && !lidoFitaEhMovimentoVazio && !lidoFitaEhVazio && !lidoFitaEhSimboloValido) {
        return { valido: false, mensagem: `Símbolo "${lidoFita}" não pertence ao alfabeto de entrada.` };
    }

    const lidoPilhaEhTesteVazio = lidoPilha === "?";
    const lidoPilhaEhMovimentoVazio = lidoPilha === "e";
    const lidoPilhaEhVazio = lidoPilha === "";
    const lidoPilhaEhSimboloValido = dadosAutomato.alfabetoPilha.includes(lidoPilha);
    
    if (!lidoPilhaEhTesteVazio && !lidoPilhaEhMovimentoVazio && !lidoPilhaEhVazio && !lidoPilhaEhSimboloValido) {
        return { valido: false, mensagem: `Símbolo "${lidoPilha}" não pertence ao alfabeto da pilha.` };
    }

    if (!gravadoPilha || gravadoPilha.trim() === "") {
        return { valido: false, mensagem: "O campo 'Gravado na pilha' não pode estar vazio. Use 'e' para épsilon." };
    }

    const gravadoPilhaEhEpsilon = gravadoPilha === "e";
    if (!gravadoPilhaEhEpsilon) {
        for (const simbolo of gravadoPilha) {
            if (!dadosAutomato.alfabetoPilha.includes(simbolo)) {
                return { valido: false, mensagem: `Símbolo "${simbolo}" em 'Gravado na pilha' não pertence ao alfabeto da pilha.` };
            }
        }
    }

    return { valido: true };
};

// GERA NOVA TRANSICAO NA LISTA DE TRANSICOES LENDO O VALOR DIGITADO PELO USUARIO
const adicionarTransicao = () => {
    const execucaoEmAndamento = execucao !== null && !execucao.concluida;
    if (execucaoEmAndamento) {
        alert("Não é possível adicionar transições durante a execução. Aguarde a conclusão ou use o botão Reiniciar Autômato.");
        return;
    }
    if (!dadosAutomato) {
        alert("Confirme os dados do autômato primeiro.");
        return;
    }

    const estadoAtual = document.getElementById("transEstadoAtual").value.trim();
    const proximoEstado = document.getElementById("transProximoEstado").value.trim();
    const lidoFita = document.getElementById("transLidoFita").value.trim();
    const lidoPilha = document.getElementById("transLidoPilha").value.trim();
    const gravadoPilha = document.getElementById("transGravadoPilha").value.trim();

    const validacao = validarTransicao(estadoAtual, proximoEstado, lidoFita, lidoPilha, gravadoPilha);
    if (!validacao.valido) {
        alert(validacao.mensagem);
        return;
    }

    let lidoFitaFormatado;
    if (lidoFita === "") {
        lidoFitaFormatado = "?";
    } else {
        lidoFitaFormatado = lidoFita;
    }

    let lidoPilhaFormatado;
    if (lidoPilha === "") {
        lidoPilhaFormatado = "?";
    } else {
        lidoPilhaFormatado = lidoPilha;
    }

    const transicao = {
        estadoAtual: estadoAtual,
        proximoEstado: proximoEstado,
        lidoFita: lidoFitaFormatado,
        lidoPilha: lidoPilhaFormatado,
        gravadoPilha: gravadoPilha
    };

    listaTransicoes.push(transicao);
    atualizarTabelaTransicoes();

    document.getElementById("transEstadoAtual").value = "";
    document.getElementById("transProximoEstado").value = "";
    document.getElementById("transLidoFita").value = "";
    document.getElementById("transLidoPilha").value = "";
    document.getElementById("transGravadoPilha").value = "";
};

// INSERE O NOVO REGISTRO NO HTML
const atualizarTabelaTransicoes = () => {
    const tbody = document.getElementById("tabelaTransicoes");
    tbody.innerHTML = "";

    if (listaTransicoes.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = '<td colspan="5" class="text-center text-muted">Nenhuma transição adicionada</td>';
        tbody.appendChild(tr);
        return;
    }

    listaTransicoes.forEach((transicao, index) => {
        const tr = document.createElement("tr");
        const execucaoEmAndamento = execucao !== null && !execucao.concluida;
        const botaoDesabilitado = execucaoEmAndamento ? "disabled" : "";
        
        let lidoFitaExibido = "";
        if (transicao.lidoFita === "?") {
            lidoFitaExibido = "?";
        } else if (transicao.lidoFita === "e") {
            lidoFitaExibido = "ε";
        } else {
            lidoFitaExibido = transicao.lidoFita;
        }
        
        let lidoPilhaExibido = "";
        if (transicao.lidoPilha === "?") {
            lidoPilhaExibido = "?";
        } else if (transicao.lidoPilha === "e") {
            lidoPilhaExibido = "ε";
        } else {
            lidoPilhaExibido = transicao.lidoPilha;
        }
        
        const gravadoPilhaExibido = transicao.gravadoPilha === "e" ? "ε" : transicao.gravadoPilha;
        
        tr.innerHTML = `
            <td>${transicao.estadoAtual}</td>
            <td>${transicao.proximoEstado}</td>
            <td>${lidoFitaExibido}</td>
            <td>${lidoPilhaExibido}</td>
            <td>
                ${gravadoPilhaExibido}
                <button class="btn btn-sm btn-danger float-end" onclick="removerTransicao(${index})" ${botaoDesabilitado}>Remover</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
};

// REMOVE UMA TRANSICAO DA TABELA SE NAO TIVER EXECUCAO EM ANDAMENTO
const removerTransicao = (indice) => {
    const execucaoEmAndamento = execucao !== null && !execucao.concluida;
    if (execucaoEmAndamento) {
        alert("Não é possível remover transições durante a execução. Aguarde a conclusão ou use o botão Reiniciar Autômato.");
        return;
    }
    if (indice >= 0 && indice < listaTransicoes.length) {
        listaTransicoes.splice(indice, 1);
        atualizarTabelaTransicoes();
    }
};

// VALIDA SE OS CAMPOS TÃO PREENCHIDOS PARA EXECUTAR
const validarTransicoesParaExecucao = () => {
    if (!dadosAutomato) {
        return { valido: false, mensagem: "Autômato não foi configurado." };
    }

    if (listaTransicoes.length === 0) {
        return { valido: false, mensagem: "Deve haver pelo menos uma transição para executar o autômato." };
    }
    return { valido: true };
};

document.getElementById("botaoAdicionarTransicao").onclick = adicionarTransicao;
