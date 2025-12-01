const validarAlfabeto = (alfabeto, nomeCampo) => {
    if (!alfabeto || alfabeto.length === 0) { // ALFABETO VAZIO NAO PODE
        return { valido: false, mensagem: `${nomeCampo} não pode estar vazio.` };
    }
    
    // FORMATAÇÃO DOS DADOS
    const simbolosSeparados = alfabeto.split(",");
    const simbolosLimpos = simbolosSeparados.map(s => s.trim());
    const simbolosFiltrados = simbolosLimpos.filter(s => s !== "");
    
    if (simbolosFiltrados.length === 0) {
        return { valido: false, mensagem: `${nomeCampo} deve conter pelo menos um símbolo.` };
    }
    
    // BLOQUEIA SIMBOLOS ESPECIAIS
    for (const simbolo of simbolosFiltrados) {
        if (simbolo === "e") {
            return { valido: false, mensagem: `O símbolo "e" não pode ser usado em ${nomeCampo}.` };
        }
        if (simbolo === "?") {
            return { valido: false, mensagem: `O símbolo "?" não pode ser usado em ${nomeCampo}.` };
        }
    }
    
    return { valido: true, simbolos: simbolosFiltrados };
};

// VALIDA A LISTA DE ESTADOS
const validarEstados = (listaEstados) => {
    if (!listaEstados || listaEstados.trim() === "") {
        return { valido: false, mensagem: "Lista de estados não pode estar vazia." };
    }
    
    const estadosSeparados = listaEstados.split(",");
    const estadosLimpos = estadosSeparados.map(s => s.trim());
    const estadosFiltrados = estadosLimpos.filter(s => s !== "");
    
    if (estadosFiltrados.length === 0) {
        return { valido: false, mensagem: "Deve haver pelo menos um estado." };
    }
    
    for (const estado of estadosFiltrados) {
        if (estado === "e") {
            return { valido: false, mensagem: 'O símbolo "e" não pode ser usado como nome de estado.' };
        }
        if (estado === "?") {
            return { valido: false, mensagem: 'O símbolo "?" não pode ser usado como nome de estado.' };
        }
    }
    
    return { valido: true, estados: estadosFiltrados };
};

// VALIDA O ESTADO INICIAL
const validarEstadoInicial = (estadoInicial, listaEstados) => {
    if (!estadoInicial || estadoInicial.trim() === "") {
        return { valido: false, mensagem: "Estado inicial não pode estar vazio." };
    }
    
    const estadoInicialLimpo = estadoInicial.trim();
    
    if (!listaEstados.includes(estadoInicialLimpo)) {
        return { valido: false, mensagem: "Estado inicial deve existir na lista de estados." };
    }
    
    return { valido: true };
};

// VALIDA A LISTA DE ESTADOS FINAIS
const validarEstadosFinais = (listaEstadosFinais, listaEstados) => {
    if (!listaEstadosFinais || listaEstadosFinais.trim() === "") {
        return { valido: false, mensagem: "Estados finais não podem estar vazios." };
    }
    
    const estadosFinaisSeparados = listaEstadosFinais.split(",");
    const estadosFinaisLimpos = estadosFinaisSeparados.map(s => s.trim());
    const estadosFinaisFiltrados = estadosFinaisLimpos.filter(s => s !== "");
    
    if (estadosFinaisFiltrados.length === 0) {
        return { valido: false, mensagem: "Deve haver pelo menos um estado final." };
    }
    
    for (const estadoFinal of estadosFinaisFiltrados) {
        if (!listaEstados.includes(estadoFinal)) {
            return { valido: false, mensagem: `Estado final "${estadoFinal}" não existe na lista de estados.` };
        }
    }
    
    return { valido: true, estadosFinais: estadosFinaisFiltrados };
};

// INVOCA TODAS AS FUNÇÕES DE VALIDAÇÃO, SE ESTIVER OK CRIA O OBJETO DO DADOSAUTOMATO
const confirmarAutomato = () => {
    const execucaoEmAndamento = execucao !== null && !execucao.concluida;
    if (execucaoEmAndamento) {
        alert("Não é possível alterar os dados do autômato durante a execução. Aguarde a conclusão ou use o botão Reiniciar Autômato.");
        return;
    }
    
    const entradaAlfabeto = document.getElementById("entradaAlfabeto").value.trim();
    const listaEstados = document.getElementById("listaEstados").value.trim();
    const estadoInicial = document.getElementById("estadoInicial").value.trim();
    const listaEstadosFinais = document.getElementById("listaEstadosFinais").value.trim();
    const alfabetoPilha = document.getElementById("alfabetoPilha").value.trim();

    const validacaoAlfabetoEntrada = validarAlfabeto(entradaAlfabeto, "Alfabeto de entrada");
    if (!validacaoAlfabetoEntrada.valido) {
        alert(validacaoAlfabetoEntrada.mensagem);
        return;
    }

    const validacaoEstados = validarEstados(listaEstados);
    if (!validacaoEstados.valido) {
        alert(validacaoEstados.mensagem);
        return;
    }

    const validacaoEstadoInicial = validarEstadoInicial(estadoInicial, validacaoEstados.estados);
    if (!validacaoEstadoInicial.valido) {
        alert(validacaoEstadoInicial.mensagem);
        return;
    }

    const validacaoEstadosFinais = validarEstadosFinais(listaEstadosFinais, validacaoEstados.estados);
    if (!validacaoEstadosFinais.valido) {
        alert(validacaoEstadosFinais.mensagem);
        return;
    }

    const validacaoAlfabetoPilha = validarAlfabeto(alfabetoPilha, "Alfabeto da pilha");
    if (!validacaoAlfabetoPilha.valido) {
        alert(validacaoAlfabetoPilha.mensagem);
        return;
    }

    // CRIACAO DO OBJETO
    dadosAutomato = {
        alfabetoEntrada: validacaoAlfabetoEntrada.simbolos,
        estados: validacaoEstados.estados,
        estadoInicial: estadoInicial.trim(),
        estadosFinais: validacaoEstadosFinais.estadosFinais,
        alfabetoPilha: validacaoAlfabetoPilha.simbolos
    };

    alert("Autômato confirmado com sucesso!");
};

document.getElementById("botaoConfirmarAutomato").onclick = confirmarAutomato;