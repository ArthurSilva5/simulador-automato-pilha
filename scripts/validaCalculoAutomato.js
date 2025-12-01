// VALIDA DADOS DIGITADos PELO USUARIO
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

// VERIFICA SE EXECUCAO JA EXISTE
const obterEstadoAtualExecucao = () => {
    if (!execucao) {
        return null;
    }

    let topo = null;
    if (execucao.pilha.length > 0) {
        topo = execucao.pilha[execucao.pilha.length - 1];
    } else {
        topo = null;
    }

    // RETORNA UMA CÓPIA DA PILHA
    return {
        estado: execucao.estado,
        entrada: execucao.entrada,
        pilha: execucao.pilha,
        topoPilha: topo
    };
};

// VERIFICA LEITURA DA FITA
const verificarCondicaoEntrada = (transicao, entradaAtual) => {
    let resultado = false;

    if (transicao.lidoFita === "?") {
        if (entradaAtual === "") {
            resultado = true;
        }
    } else if (transicao.lidoFita === "e") {
        resultado = true;
    } else {
        if (entradaAtual.length > 0 && entradaAtual.startsWith(transicao.lidoFita)) { // VERIFICA SE A ENTRADA ATUAL COMEÇA COM LIDO FITA
            resultado = true;
        }
    }
    return resultado;
};

// VERIFICA SE O QUE FOI LIDO É VÁLIDO COM A PILHA
const verificarCondicaoPilha = (transicao, topoPilha) => {
    if (transicao.lidoPilha === "?"){
        return topoPilha === null;
    } 
    if (transicao.lidoPilha === "e"){
        return true;
    } 
    return topoPilha === transicao.lidoPilha;
};

// VALIDA A SENTENÇA
const verificarAceitacao = () => {
    if (!execucao) { // SE NAO TEM EXECUCAO RETORNA FALSO
        return false;
    }
    return execucao.entrada === "" && dadosAutomato.estadosFinais.includes(execucao.estado); // SE O ESTADO ATUAL É FINAL
};

// VALIDA SE EXISTE ALGUM SIMBOLO PARA SER LIDO
const entradaFoiCompletamenteLida = () => {
    const estado = obterEstadoAtualExecucao();
    if (!estado || estado.entrada === "") {
        return estado !== null && estado.entrada === ""
    }
    
    for (const transicao of listaTransicoes) { // VARRE AS TRANSIÇÕES EM BUSCA DE CONSUMIR O PRÓXIMO SÍMBOLO, SE EXISTIR
        if (transicao.estadoAtual === estado.estado && 
            transicao.lidoFita !== "?" && transicao.lidoFita !== "e" &&
            verificarCondicaoEntrada(transicao, estado.entrada) && 
            verificarCondicaoPilha(transicao, estado.topoPilha)) {
            return false;
        }
    }
    return true;
};

// VALIDA SE A SENTENÇA FOI REJEITADA
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

// VALIDA MELHOR TRANSIÇÃO PARA APLICAR
const encontrarTransicaoAplicavel = () => {
    const estado = obterEstadoAtualExecucao();
    if (!estado) {
        return null;
    }

    // FILTRA TODAS AS TRANSIÇÕES CUJAS CONDIÇÕES DE ENTRADA E PILHA SÃO ATENDIDAS
    const transicoesAplicaveis = listaTransicoes.filter(transicao => 
        transicao.estadoAtual === estado.estado &&  
        verificarCondicaoEntrada(transicao, estado.entrada) &&
        verificarCondicaoPilha(transicao, estado.topoPilha)
    );

    // SE NENHUMA TRANSIÇÃO É APLICÁVEL, ENCERRA
    if (transicoesAplicaveis.length === 0) {
        return null;
    }
        // SE SÓ EXISTE UMA TRANSIÇÃO VÁLIDA, RETORNA ELA
    if (transicoesAplicaveis.length === 1) {
        return transicoesAplicaveis[0];
    }

    // TRANSIÇÕES QUE LÊEM UM SÍMBOLO ESPECÍFICO DO TOPO DA PILHA
    const transicoesQueLeemSimboloEspecificoDaPilha = transicoesAplicaveis.filter(t => 
        t.lidoPilha !== "e" && 
        t.lidoPilha !== "?" && 
        estado.topoPilha !== null && 
        t.lidoPilha === estado.topoPilha);

    // SE ENCONTRAR ALGUMA TRANSIÇÃO QUE LÊ EXATAMENTE O TOPO
    if (transicoesQueLeemSimboloEspecificoDaPilha.length > 0) {
        return transicoesQueLeemSimboloEspecificoDaPilha[0];
    }

    // TRANSIÇÕES QUE LÊEM QUALQUER SÍMBOLO DA PILHA (MAS NÃO ε OU ?)
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

    // ENTÃO REMOVE O PRIMEIRO CARACTERE DA ENTRADA
    if (transicao.lidoFita !== "?" && transicao.lidoFita !== "e" && execucao.entrada.length > 0) {
        execucao.entrada = execucao.entrada.substring(1);
    }

    // REMOVE O TOPO DA PILHA
    if (transicao.lidoPilha !== "?" && transicao.lidoPilha !== "e" && execucao.pilha.length > 0) {
        execucao.pilha.pop();
    }

    // GRAVA NO TOPO DA PILHA
    if (transicao.gravadoPilha !== "e") {
        const simbolosParaGravar = transicao.gravadoPilha.split("").reverse();
        for (const simbolo of simbolosParaGravar) {
            execucao.pilha.push(simbolo);
        }
    }

    execucao.estado = transicao.proximoEstado;
};

// MUDA DE "e" PARA "ε"
const formatarSimbolo = (simbolo) => {
    if (simbolo === "e") {
        return "ε";
    }
    return simbolo;
};

// RETORNA A TRANSICAO FORMATADA
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

// FUNÇÃO GENÉRICA DESABILITA CAMPOS PELO ID
const alterarEstadoCampos = (ids, desabilitado) => {
    ids.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.disabled = desabilitado;
    });
};

/// BLOQUEIA CAMPOS DE ENTRADA DE DADOS
const bloquearCamposAutomato = () => {
    alterarEstadoCampos([
        "entradaAlfabeto", "listaEstados", "estadoInicial", "listaEstadosFinais", "alfabetoPilha",
        "botaoConfirmarAutomato", "transEstadoAtual", "transProximoEstado", "transLidoFita",
        "transLidoPilha", "transGravadoPilha", "botaoAdicionarTransicao", "entradaSentenca",
        "botaoIniciarExecucao"
    ], true);
};

// DESBLOQUEIA APENAS OS CAMPOS RELACIONADOS À INSERÇÃO DE TRANSIÇÕES
const desbloquearCamposAposExecucao = () => {
    alterarEstadoCampos([
        "transEstadoAtual", "transProximoEstado", "transLidoFita", "transLidoPilha",
        "transGravadoPilha", "botaoAdicionarTransicao", "entradaSentenca", "botaoIniciarExecucao"
    ], false);
};

// DESBLOQUEIA TODOS OS CAMPOS DO FORMULÁRIO DO AUTÔMATO
const desbloquearCamposAutomato = () => {
    alterarEstadoCampos([
        "entradaAlfabeto", "listaEstados", "estadoInicial", "listaEstadosFinais", "alfabetoPilha",
        "botaoConfirmarAutomato", "transEstadoAtual", "transProximoEstado", "transLidoFita",
        "transLidoPilha", "transGravadoPilha", "botaoAdicionarTransicao", "entradaSentenca",
        "botaoIniciarExecucao"
    ], false);
};

// FUNÇÃO PARA GERAR O OBJETO EXECUCAO E BLOQUEAR CAMPOS DE ENTRADA NA EXECUCAO
const iniciarExecucao = () => {
    if (!dadosAutomato) {
        alert("Confirme os dados do autômato primeiro.");
        return;
    }
      // VERIFICA SE AS TRANSIÇÕES ESTÃO CORRETAMENTE DEFINIDAS
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

    // ZERA HISTORICO DE PASSOS
    historicoPassos = [];

    bloquearCamposAutomato();
    limparExibicao();
    atualizarEstadoBotaoProximoPasso();
};

const gerarProximoPasso = () => {
    if (!execucao) {
        alert("Inicie a execução primeiro.")
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
    // PROCURA TRANSIÇÃO QUE LÊ ε NA FITA E COMBINA COM O TOPO DA PILHA 
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
    // SE AINDA ASSIM NÃO EXISTE NENHUMA TRANSIÇÃO APLICÁVEL
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
        } 
        else {
            const estado = obterEstadoAtualExecucao();
            const proximoSymbolo = estado.entrada[0];
            let transicaoTentada = null;
            // AINDA HÁ ENTRADA MAS NENHUMA TRANSIÇÃO SERVE
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
            if (!estadoAtualEhFinal) { // SE NÃO FOR O ESTADO FINAL
                execucao.concluida = true;
                exibirExecucao();
                desbloquearCamposAposExecucao();
                alert(transicaoTentada ? 
                    `ERRO: Tentou ler "${proximoSymbolo}" mas nenhuma transição aplicável encontrada. SENTENÇA REJEITADA!` :
                    "ERRO: Nenhuma transição aplicável e não está em estad final. SENTENÇA REJEITADA!");
                return;
            }
            // SE ESTÁ NO ESTADO FINAL MAS AINDA EXISTEM ELEMENTOS NA FITA
            if (!transicaoTentada) {
                execucao.transicao = null;
                adicionarPassoAoHistorico();
            }
            alert("Nenhuma transição aplicável. A entrada ainda não foi completamente lida.");
            exibirExecucao();
            return;
        }
    }

    // APLICA A TRANSIÇÃO ENCONTRADA, REGISTRA O PASSO E LIMPA A TRANSIÇÃO ATUAL
    execucao.transicao = transicaoAplicavel;
    aplicarTransicao(transicaoAplicavel);
    adicionarPassoAoHistorico();
    execucao.transicao = null;

    const entradaEstaVazia = execucao.entrada === "";
    // PROCURA TRANSIÇÃO APLICÁVEL MESMO COM ENTRADA VAZIA
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

// INSERE NA VARIAVEL GLOBAL O PASSO
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

// LIMPA OS CAMPOS DA EXECUÇÃO
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

// LIMPA TODOS RASTROS DE EXECUCAO
const resetarExecucao = () => {
    execucao = null;
    historicoPassos = [];
    limparExibicao();
    atualizarEstadoBotaoProximoPasso();
    desbloquearCamposAutomato();
};

document.getElementById("botaoIniciarExecucao").onclick = iniciarExecucao;
document.getElementById("botaoProximoPasso").onclick = gerarProximoPasso;
document.getElementById("botaoResetar").onclick = resetarExecucao;