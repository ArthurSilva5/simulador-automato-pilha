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

const obterEstadoAtualExecucao = () => {
    if (!execucao) return null;
    return {
        estado: execucao.estado,
        entrada: execucao.entrada,
        pilha: execucao.pilha,
        topoPilha: execucao.pilha.length > 0 ? execucao.pilha[execucao.pilha.length - 1] : null
    };
};

const verificarCondicaoEntrada = (transicao, entradaAtual) => {
    if (transicao.lidoFita === "?") return entradaAtual === "";
    if (transicao.lidoFita === "e") return true;
    return entradaAtual.length > 0 && entradaAtual.startsWith(transicao.lidoFita);
};

const verificarCondicaoPilha = (transicao, topoPilha) => {
    if (transicao.lidoPilha === "?") return topoPilha === null;
    if (transicao.lidoPilha === "e") return true;
    return topoPilha === transicao.lidoPilha;
};

const verificarAceitacao = () => {
    if (!execucao) {
        return false;
    }
    return execucao.entrada === "" && dadosAutomato.estadosFinais.includes(execucao.estado);
};

const entradaFoiCompletamenteLida = () => {
    const estado = obterEstadoAtualExecucao();
    if (!estado || estado.entrada === "") {
        return estado !== null && estado.entrada === "";
    }
    
    for (const transicao of listaTransicoes) {
        if (transicao.estadoAtual === estado.estado && 
            transicao.lidoFita !== "?" && transicao.lidoFita !== "e" &&
            verificarCondicaoEntrada(transicao, estado.entrada) && 
            verificarCondicaoPilha(transicao, estado.topoPilha)) {
            return false;
        }
    }
    
    return true;
};

const verificarRejeicao = () => {
    if (!execucao || verificarAceitacao() || !entradaFoiCompletamenteLida()) {
        return false;
    }

    const estado = obterEstadoAtualExecucao();
    for (const transicao of listaTransicoes) {
        if (transicao.estadoAtual === estado.estado &&
            verificarCondicaoEntrada(transicao, estado.entrada) && 
            verificarCondicaoPilha(transicao, estado.topoPilha)) {
            return false;
        }
    }

    return true;
};

const encontrarTransicaoAplicavel = () => {
    const estado = obterEstadoAtualExecucao();
    if (!estado) {
        return null;
    }

    const transicoesAplicaveis = listaTransicoes.filter(transicao => 
        transicao.estadoAtual === estado.estado &&
        verificarCondicaoEntrada(transicao, estado.entrada) &&
        verificarCondicaoPilha(transicao, estado.topoPilha)
    );

    if (transicoesAplicaveis.length === 0) {
        return null;
    }

    if (transicoesAplicaveis.length === 1) {
        return transicoesAplicaveis[0];
    }

    const transicoesQueLeemSimboloEspecificoDaPilha = transicoesAplicaveis.filter(t => 
        t.lidoPilha !== "e" && t.lidoPilha !== "?" && estado.topoPilha !== null && t.lidoPilha === estado.topoPilha
    );
    if (transicoesQueLeemSimboloEspecificoDaPilha.length > 0) {
        return transicoesQueLeemSimboloEspecificoDaPilha[0];
    }

    const transicoesQueLeemDaPilha = transicoesAplicaveis.filter(t => t.lidoPilha !== "e" && t.lidoPilha !== "?");
    if (transicoesQueLeemDaPilha.length > 0) {
        return transicoesQueLeemDaPilha[0];
    }

    const transicoesEpsilon = transicoesAplicaveis.filter(t => t.lidoPilha === "e");
    return transicoesEpsilon.length > 0 ? transicoesEpsilon[0] : transicoesAplicaveis[0];
};

const aplicarTransicao = (transicao) => {
    if (!execucao || !transicao) {
        return;
    }

    if (transicao.lidoFita !== "?" && transicao.lidoFita !== "e" && execucao.entrada.length > 0) {
        execucao.entrada = execucao.entrada.substring(1);
    }

    if (transicao.lidoPilha !== "?" && transicao.lidoPilha !== "e" && execucao.pilha.length > 0) {
        execucao.pilha.pop();
    }

    if (transicao.gravadoPilha !== "e") {
        const simbolosParaGravar = transicao.gravadoPilha.split("").reverse();
        for (const simbolo of simbolosParaGravar) {
            execucao.pilha.push(simbolo);
        }
    }

    execucao.estado = transicao.proximoEstado;
};

const formatarSimbolo = (simbolo) => {
    if (simbolo === "?") return "?";
    if (simbolo === "e") return "ε";
    return simbolo;
};

const formatarTransicao = (transicao) => {
    if (!transicao) {
        return "Nenhuma transição aplicável";
    }

    const prefixoTentativaFalhou = transicao._tentativaFalhou ? "[TENTATIVA FALHOU] " : "";
    const simboloLidoFitaFormatado = formatarSimbolo(transicao.lidoFita);
    const simboloLidoPilhaFormatado = formatarSimbolo(transicao.lidoPilha);
    const simboloGravadoPilhaFormatado = formatarSimbolo(transicao.gravadoPilha);
    
    return `${prefixoTentativaFalhou}(${transicao.estadoAtual} → ${transicao.proximoEstado}, lido da fita: ${simboloLidoFitaFormatado}, lido da pilha: ${simboloLidoPilhaFormatado}, gravado na pilha: ${simboloGravadoPilhaFormatado})`;
};

const alterarEstadoCampos = (ids, desabilitado) => {
    ids.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.disabled = desabilitado;
    });
};

const bloquearCamposAutomato = () => {
    alterarEstadoCampos([
        "entradaAlfabeto", "listaEstados", "estadoInicial", "listaEstadosFinais", "alfabetoPilha",
        "botaoConfirmarAutomato", "transEstadoAtual", "transProximoEstado", "transLidoFita",
        "transLidoPilha", "transGravadoPilha", "botaoAdicionarTransicao", "entradaSentenca",
        "botaoIniciarExecucao"
    ], true);
};

const desbloquearCamposAposExecucao = () => {
    alterarEstadoCampos([
        "transEstadoAtual", "transProximoEstado", "transLidoFita", "transLidoPilha",
        "transGravadoPilha", "botaoAdicionarTransicao", "entradaSentenca", "botaoIniciarExecucao"
    ], false);
};

const desbloquearCamposAutomato = () => {
    alterarEstadoCampos([
        "entradaAlfabeto", "listaEstados", "estadoInicial", "listaEstadosFinais", "alfabetoPilha",
        "botaoConfirmarAutomato", "transEstadoAtual", "transProximoEstado", "transLidoFita",
        "transLidoPilha", "transGravadoPilha", "botaoAdicionarTransicao", "entradaSentenca",
        "botaoIniciarExecucao"
    ], false);
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
        transicao: null,
        concluida: false
    };

    historicoPassos = [];

    bloquearCamposAutomato();
    limparExibicao();
    atualizarEstadoBotaoProximoPasso();
};

const gerarProximoPasso = () => {
    if (!execucao) {
        alert("Inicie a execução primeiro.");
        return;
    }

    if (execucao.concluida) {
        alert("A análise já foi concluída. Use o botão 'Reiniciar Autômato' para começar uma nova execução.");
        return;
    }

    if (historicoPassos.length === 0) {
        historicoPassos.push({
            estado: execucao.estado,
            entrada: execucao.entrada,
            pilha: [...execucao.pilha],
            transicao: "Estado inicial"
        });
    }

    let transicaoAplicavel = encontrarTransicaoAplicavel();

    if (!transicaoAplicavel) {
        const estado = obterEstadoAtualExecucao();
        for (const transicao of listaTransicoes) {
            if (transicao.estadoAtual === estado.estado && transicao.lidoFita === "e" && 
                verificarCondicaoPilha(transicao, estado.topoPilha)) {
                transicaoAplicavel = transicao;
                break;
            }
        }
    }

    if (!transicaoAplicavel) {
        const entradaEstaVazia = execucao.entrada === "";
        
        if (entradaEstaVazia) {
            execucao.transicao = null;
            execucao.concluida = true;
            adicionarPassoAoHistorico();
            exibirExecucao();
            desbloquearCamposAposExecucao();
            alert(verificarAceitacao() ? "SENTENÇA ACEITA!" : "SENTENÇA REJEITADA!");
            return;
        } else {
            const estado = obterEstadoAtualExecucao();
            const proximoSymbolo = estado.entrada[0];
            let transicaoTentada = null;
            
            for (const transicao of listaTransicoes) {
                if (transicao.estadoAtual === estado.estado && transicao.lidoFita === proximoSymbolo &&
                    !verificarCondicaoPilha(transicao, estado.topoPilha)) {
                    transicaoTentada = transicao;
                    break;
                }
            }
            
            if (transicaoTentada) {
                execucao.transicao = { ...transicaoTentada, _tentativaFalhou: true };
                adicionarPassoAoHistorico();
                execucao.transicao = null;
                exibirExecucao();
            }
            
            const estadoAtualEhFinal = dadosAutomato.estadosFinais.includes(estado.estado);
            if (!estadoAtualEhFinal) {
                execucao.concluida = true;
                exibirExecucao();
                desbloquearCamposAposExecucao();
                alert(transicaoTentada ? 
                    `ERRO: Tentou ler "${proximoSymbolo}" mas nenhuma transição aplicável encontrada. SENTENÇA REJEITADA!` :
                    "ERRO: Nenhuma transição aplicável e não está em estado final. SENTENÇA REJEITADA!");
                return;
            }
            
            if (!transicaoTentada) {
                execucao.transicao = null;
                adicionarPassoAoHistorico();
            }
            alert("Nenhuma transição aplicável. A entrada ainda não foi completamente lida.");
            exibirExecucao();
            return;
        }
    }

    execucao.transicao = transicaoAplicavel;
    aplicarTransicao(transicaoAplicavel);
    adicionarPassoAoHistorico();
    execucao.transicao = null;

    const entradaEstaVazia = execucao.entrada === "";
    
    if (entradaEstaVazia) {
        const transicaoEpsilonAplicavel = encontrarTransicaoAplicavel();
        if (!transicaoEpsilonAplicavel) {
            execucao.concluida = true;
            exibirExecucao();
            desbloquearCamposAposExecucao();
            if (verificarAceitacao()) {
                alert("SENTENÇA ACEITA!");
            } else if (verificarRejeicao()) {
                alert("SENTENÇA REJEITADA!");
            }
            return;
        }
    }

    exibirExecucao();
};

const adicionarPassoAoHistorico = () => {
    if (!execucao) {
        return;
    }

    historicoPassos.push({
        estado: execucao.estado,
        entrada: execucao.entrada,
        pilha: [...execucao.pilha],
        transicao: execucao.transicao ? formatarTransicao(execucao.transicao) : "Nenhuma transição aplicável"
    });
};

const atualizarEstadoBotaoProximoPasso = () => {
    const botaoProximoPasso = document.getElementById("botaoProximoPasso");
    if (botaoProximoPasso) {
        botaoProximoPasso.disabled = !execucao || execucao.concluida;
    }
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
    limparExibicao();
    atualizarEstadoBotaoProximoPasso();
    desbloquearCamposAutomato();
};

document.getElementById("botaoIniciarExecucao").onclick = iniciarExecucao;
document.getElementById("botaoProximoPasso").onclick = gerarProximoPasso;
document.getElementById("botaoResetar").onclick = () => {
    resetarExecucao();
};
