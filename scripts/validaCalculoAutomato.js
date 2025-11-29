const validarSentenca = (sentenca) => {
    if (!dadosAutomato) {
        return { valido: false, mensagem: "Autômato não foi configurado." };
    }

    for (const simbolo of sentenca) {
        if (!dadosAutomato.alfabetoEntrada.includes(simbolo)) {
            return { valido: false, mensagem: `Símbolo "${simbolo}" não pertence ao alfabeto de entrada.` };
        }
    }

    return { valido: true };
};

const verificarAceitacao = () => {
    if (!execucao) {
        return false;
    }

    const entradaEstaVazia = execucao.entrada === "";
    const estadoAtualEhFinal = dadosAutomato.estadosFinais.includes(execucao.estado);
    
    const sentencaFoiAceita = entradaEstaVazia && estadoAtualEhFinal;
    return sentencaFoiAceita;
};

const verificarRejeicao = () => {
    if (!execucao) {
        return false;
    }

    if (verificarAceitacao()) {
        return false;
    }

    const topoPilha = execucao.pilha.length > 0 ? execucao.pilha[execucao.pilha.length - 1] : null;

    for (const transicao of listaTransicoes) {
        if (transicao.estadoAtual !== execucao.estado) {
            continue;
        }

        let condicaoEntradaSatisfeita = false;
        if (transicao.lidoFita === "?") {
            condicaoEntradaSatisfeita = execucao.entrada === "";
        } else if (transicao.lidoFita === "e") {
            condicaoEntradaSatisfeita = true;
        } else {
            const entradaTemSimbolo = execucao.entrada.length > 0;
            const entradaComecaComSimbolo = execucao.entrada.startsWith(transicao.lidoFita);
            condicaoEntradaSatisfeita = entradaTemSimbolo && entradaComecaComSimbolo;
        }

        let condicaoPilhaSatisfeita = false;
        if (transicao.lidoPilha === "?") {
            condicaoPilhaSatisfeita = topoPilha === null;
        } else if (transicao.lidoPilha === "e") {
            condicaoPilhaSatisfeita = true;
        } else {
            condicaoPilhaSatisfeita = topoPilha === transicao.lidoPilha;
        }

        if (condicaoEntradaSatisfeita && condicaoPilhaSatisfeita) {
            return false;
        }
    }

    return true;
};

const encontrarTransicaoAplicavel = () => {
    if (!execucao) {
        return null;
    }

    const topoPilha = execucao.pilha.length > 0 ? execucao.pilha[execucao.pilha.length - 1] : null;

    for (const transicao of listaTransicoes) {
        if (transicao.estadoAtual !== execucao.estado) {
            continue;
        }

        let condicaoEntradaSatisfeita = false;
        if (transicao.lidoFita === "?") {
            condicaoEntradaSatisfeita = execucao.entrada === "";
        } else if (transicao.lidoFita === "e") {
            condicaoEntradaSatisfeita = true;
        } else {
            const entradaTemSimbolo = execucao.entrada.length > 0;
            const entradaComecaComSimbolo = execucao.entrada.startsWith(transicao.lidoFita);
            condicaoEntradaSatisfeita = entradaTemSimbolo && entradaComecaComSimbolo;
        }

        let condicaoPilhaSatisfeita = false;
        if (transicao.lidoPilha === "?") {
            condicaoPilhaSatisfeita = topoPilha === null;
        } else if (transicao.lidoPilha === "e") {
            condicaoPilhaSatisfeita = true;
        } else {
            condicaoPilhaSatisfeita = topoPilha === transicao.lidoPilha;
        }

        if (condicaoEntradaSatisfeita && condicaoPilhaSatisfeita) {
            return transicao;
        }
    }

    return null;
};

const aplicarTransicao = (transicao) => {
    if (!execucao || !transicao) {
        return;
    }

    const lidoFitaEhTesteVazio = transicao.lidoFita === "?";
    const lidoFitaEhMovimentoVazio = transicao.lidoFita === "e";
    const deveConsumirEntrada = !lidoFitaEhTesteVazio && !lidoFitaEhMovimentoVazio;

    if (deveConsumirEntrada) {
        if (execucao.entrada.length > 0) {
            execucao.entrada = execucao.entrada.substring(1);
        }
    }

    const lidoPilhaEhTesteVazio = transicao.lidoPilha === "?";
    const lidoPilhaEhMovimentoVazio = transicao.lidoPilha === "e";
    const deveRemoverDaPilha = !lidoPilhaEhTesteVazio && !lidoPilhaEhMovimentoVazio;

    if (deveRemoverDaPilha) {
        if (execucao.pilha.length > 0) {
            execucao.pilha.pop();
        }
    }

    const gravadoPilhaEhEpsilon = transicao.gravadoPilha === "e";
    const deveGravarNaPilha = !gravadoPilhaEhEpsilon;

    if (deveGravarNaPilha) {
        const simbolosParaGravar = transicao.gravadoPilha.split("");
        const simbolosInvertidos = simbolosParaGravar.reverse();
        for (const simbolo of simbolosInvertidos) {
            execucao.pilha.push(simbolo);
        }
    }

    execucao.estado = transicao.proximoEstado;
};

const formatarTransicao = (transicao) => {
    if (!transicao) {
        return "Nenhuma transição aplicável";
    }

    let lidoFitaFormatado = "";
    if (transicao.lidoFita === "?") {
        lidoFitaFormatado = "?";
    } else if (transicao.lidoFita === "e") {
        lidoFitaFormatado = "ε";
    } else {
        lidoFitaFormatado = transicao.lidoFita;
    }

    let lidoPilhaFormatado = "";
    if (transicao.lidoPilha === "?") {
        lidoPilhaFormatado = "?";
    } else if (transicao.lidoPilha === "e") {
        lidoPilhaFormatado = "ε";
    } else {
        lidoPilhaFormatado = transicao.lidoPilha;
    }

    const gravadoPilhaFormatado = transicao.gravadoPilha === "e" ? "ε" : transicao.gravadoPilha;

    return `(${transicao.estadoAtual} → ${transicao.proximoEstado}, leitura: ${lidoFitaFormatado}, lido da pilha: ${lidoPilhaFormatado}, gravado na pilha: ${gravadoPilhaFormatado})`;
};

const bloquearCamposAutomato = () => {
    document.getElementById("entradaAlfabeto").disabled = true;
    document.getElementById("listaEstados").disabled = true;
    document.getElementById("estadoInicial").disabled = true;
    document.getElementById("listaEstadosFinais").disabled = true;
    document.getElementById("alfabetoPilha").disabled = true;
    document.getElementById("botaoConfirmarAutomato").disabled = true;
    document.getElementById("transEstadoAtual").disabled = true;
    document.getElementById("transProximoEstado").disabled = true;
    document.getElementById("transLidoFita").disabled = true;
    document.getElementById("transLidoPilha").disabled = true;
    document.getElementById("transGravadoPilha").disabled = true;
    document.getElementById("botaoAdicionarTransicao").disabled = true;
    document.getElementById("entradaSentenca").disabled = true;
    document.getElementById("botaoIniciarExecucao").disabled = true;
};

const desbloquearCamposAutomato = () => {
    document.getElementById("entradaAlfabeto").disabled = false;
    document.getElementById("listaEstados").disabled = false;
    document.getElementById("estadoInicial").disabled = false;
    document.getElementById("listaEstadosFinais").disabled = false;
    document.getElementById("alfabetoPilha").disabled = false;
    document.getElementById("botaoConfirmarAutomato").disabled = false;
    document.getElementById("transEstadoAtual").disabled = false;
    document.getElementById("transProximoEstado").disabled = false;
    document.getElementById("transLidoFita").disabled = false;
    document.getElementById("transLidoPilha").disabled = false;
    document.getElementById("transGravadoPilha").disabled = false;
    document.getElementById("botaoAdicionarTransicao").disabled = false;
    document.getElementById("entradaSentenca").disabled = false;
    document.getElementById("botaoIniciarExecucao").disabled = false;
};

const iniciarExecucao = () => {
    if (!dadosAutomato) {
        alert("Confirme os dados do autômato primeiro.");
        return;
    }

    const validacaoTransicoes = validarTransicoesParaExecucao();
    if (!validacaoTransicoes.valido) {
        alert(validacaoTransicoes.mensagem);
        return;
    }

    const sentenca = document.getElementById("entradaSentenca").value.trim();
    if (!sentenca) {
        alert("Digite uma sentença para verificar.");
        return;
    }

    const validacaoSentenca = validarSentenca(sentenca);
    if (!validacaoSentenca.valido) {
        alert(validacaoSentenca.mensagem);
        return;
    }

    execucao = {
        estado: dadosAutomato.estadoInicial,
        entrada: sentenca,
        pilha: [],
        transicao: null
    };

    historicoPassos = [];

    bloquearCamposAutomato();
    limparExibicao();
};

const gerarProximoPasso = () => {
    if (!execucao) {
        alert("Inicie a execução primeiro.");
        return;
    }

    if (historicoPassos.length === 0) {
        const passoInicial = {
            estado: execucao.estado,
            entrada: execucao.entrada,
            pilha: [...execucao.pilha],
            transicao: "Estado inicial"
        };
        historicoPassos.push(passoInicial);
    }

    if (verificarAceitacao()) {
        alert("SENTENÇA ACEITA!");
        execucao.transicao = null;
        adicionarPassoAoHistorico();
        exibirExecucao();
        return;
    }

    if (verificarRejeicao()) {
        alert("SENTENÇA REJEITADA!");
        execucao.transicao = null;
        adicionarPassoAoHistorico();
        exibirExecucao();
        return;
    }

    const transicaoAplicavel = encontrarTransicaoAplicavel();

    if (!transicaoAplicavel) {
        alert("SENTENÇA REJEITADA!");
        execucao.transicao = null;
        adicionarPassoAoHistorico();
        exibirExecucao();
        return;
    }

    execucao.transicao = transicaoAplicavel;
    adicionarPassoAoHistorico();
    aplicarTransicao(transicaoAplicavel);
    execucao.transicao = null;

    if (verificarAceitacao()) {
        exibirExecucao();
        alert("SENTENÇA ACEITA!");
        return;
    }

    if (verificarRejeicao()) {
        exibirExecucao();
        alert("SENTENÇA REJEITADA!");
        return;
    }

    exibirExecucao();
};

const adicionarPassoAoHistorico = () => {
    if (!execucao) {
        return;
    }

    const passo = {
        estado: execucao.estado,
        entrada: execucao.entrada,
        pilha: [...execucao.pilha],
        transicao: execucao.transicao ? formatarTransicao(execucao.transicao) : "Nenhuma transição aplicável"
    };

    historicoPassos.push(passo);
};

const limparExibicao = () => {
    document.getElementById("exEstado").textContent = "";
    document.getElementById("exEntrada").textContent = "";
    document.getElementById("exTransicao").textContent = "";
    document.getElementById("exPilha").innerHTML = '<div class="text-muted">(vazia)</div>';
    document.getElementById("exResultado").textContent = "";
    document.getElementById("exResultado").className = "text-center fw-bold";
    const tbody = document.getElementById("tabelaPassos");
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Nenhum passo executado ainda</td></tr>';
};

const resetarExecucao = () => {
    execucao = null;
    historicoPassos = [];
    desbloquearCamposAutomato();
    limparExibicao();
};

document.getElementById("botaoIniciarExecucao").onclick = iniciarExecucao;
document.getElementById("botaoProximoPasso").onclick = gerarProximoPasso;
document.getElementById("botaoResetar").onclick = () => {
    limparMemoria();
    document.getElementById("entradaAlfabeto").value = "";
    document.getElementById("listaEstados").value = "";
    document.getElementById("estadoInicial").value = "";
    document.getElementById("listaEstadosFinais").value = "";
    document.getElementById("alfabetoPilha").value = "";
    document.getElementById("entradaSentenca").value = "";
    atualizarTabelaTransicoes();
    desbloquearCamposAutomato();
    limparExibicao();
};
