// exibeResultado.js
// Lógica da UI de simulação: inicia simulação, avança passos, renderiza pilha e passos.
// Depende de: dadosSalvos.js e validaCalculoAutomato.js

(function () {
  const btnProximo = document.getElementById('proximoPassoButton');
  const btnResetSim = document.getElementById('resetSimulacaoButton');
  const btnLimparTudo = document.getElementById('limparTudoButton');

  const corpoTabelaPassos = document.getElementById('corpoTabelaPassos');
  const visualPilha = document.getElementById('visualPilha');
  const resultadoFinal = document.getElementById('resultadoFinal');

  const camposExibe = {
    alfabetoEntradaDisplay: document.getElementById('alfabetoEntradaDisplay'),
    sentencaInput: document.getElementById('sentencaInput'),
    adicionarTransicaoButton: document.getElementById('adicionarTransicaoButton')
  };

  // estado da simulação
  let simulacao = lerDados(DADOS_CHAVES.SIM) || null;

  function inicializarConfiguracao(sentenca) {
    const dados = lerDados(DADOS_CHAVES.DADOS);
    return {
      estadoAtual: dados.estadoInicial,
      entradaRestante: (sentenca || '').toLowerCase().trim(),
      pilha: []
    };
  }

  function salvarSimulacaoNoStorage() {
    salvarDados(DADOS_CHAVES.SIM, simulacao);
  }

  function limparExibicao() {
    corpoTabelaPassos.innerHTML = '';
    visualPilha.innerHTML = '';
    resultadoFinal.textContent = '';
    resultadoFinal.classList.remove('text-success', 'text-danger');
  }

  function renderPilha(pilha) {
    visualPilha.innerHTML = '';
    for (let i = pilha.length - 1; i >= 0; i--) {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'small', 'text-center');
      if (i === pilha.length - 1) {
        li.classList.add('fw-bold', 'bg-primary', 'text-white');
        li.textContent = `${pilha[i]}  ← topo`;
      } else {
        li.textContent = pilha[i];
      }
      visualPilha.appendChild(li);
    }
  }

  function adicionarLinhaTabela(passo, estado, entradaRestante, pilha, transicao) {
    const tr = document.createElement('tr');
    const tdPasso = document.createElement('td');
    const tdEstado = document.createElement('td');
    const tdEntrada = document.createElement('td');
    const tdPilha = document.createElement('td');
    const tdTransicao = document.createElement('td');

    tdPasso.textContent = passo;
    tdEstado.textContent = estado;
    tdEntrada.textContent = entradaRestante === '' ? 'ε' : entradaRestante;
    tdPilha.textContent = pilha.length === 0 ? 'vazia' : pilha.join('');
    tdTransicao.textContent = transicao || '-';

    tr.appendChild(tdPasso);
    tr.appendChild(tdEstado);
    tr.appendChild(tdEntrada);
    tr.appendChild(tdPilha);
    tr.appendChild(tdTransicao);

    corpoTabelaPassos.appendChild(tr);
    tr.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  function atualizarInterface() {
    limparExibicao();
    if (simulacao && simulacao.historico) {
      simulacao.historico.forEach(reg => adicionarLinhaTabela(reg.passo, reg.estado, reg.entradaRestante, reg.pilha, reg.transicao));
    }
    if (simulacao && simulacao.configuracaoAtual) {
      renderPilha(simulacao.configuracaoAtual.pilha);
    }
    if (simulacao && simulacao.terminou) {
      if (simulacao.aceitou) {
        resultadoFinal.textContent = 'ACEITA';
        resultadoFinal.classList.remove('text-danger');
        resultadoFinal.classList.add('text-success');
      } else {
        resultadoFinal.textContent = 'REJEITADA';
        resultadoFinal.classList.remove('text-success');
        resultadoFinal.classList.add('text-danger');
      }
      btnProximo.disabled = true;
    } else {
      resultadoFinal.textContent = '';
      btnProximo.disabled = false;
    }
  }

  function iniciarNovaSimulacao() {
    const dadosAutomato = lerDados(DADOS_CHAVES.DADOS);
    if (!dadosAutomato) {
      alert('Autômato não configurado. Confirme os dados.');
      return false;
    }
    const sentenca = camposExibe.sentencaInput.value.toLowerCase().trim();

    // validar símbolos da sentença contra alfabeto de entrada e proibir '?'
    const alfabeto = dadosAutomato.alfabetoDeEntrada || [];
    for (const c of sentenca) {
      if (c === '?') {
        alert("O símbolo '?' não é permitido na sentença.");
        return false;
      }
      if (!alfabeto.includes(c)) {
        alert(`Símbolo inválido na sentença: '${c}'. Use apenas o alfabeto de entrada.`);
        return false;
      }
    }

    simulacao = {
      passoNumero: 0,
      historico: [],
      configuracaoAtual: inicializarConfiguracao(sentenca),
      terminou: false,
      aceitou: null
    };
    salvarSimulacaoNoStorage();
    atualizarInterface();
    return true;
  }

  btnProximo.addEventListener('click', () => {
    const dadosAutomato = lerDados(DADOS_CHAVES.DADOS);
    if (!dadosAutomato) {
      alert('Automato não configurado. Confirme os dados.');
      return;
    }
    if (!simulacao || !simulacao.configuracaoAtual) {
      const ok = iniciarNovaSimulacao();
      if (!ok) return;
    }
    if (simulacao.terminou) return;

    const cfg = simulacao.configuracaoAtual;
    const resultado = window.calculoAutomato.passoSimulacao(dadosAutomato, {
      estadoAtual: cfg.estadoAtual,
      entradaRestante: cfg.entradaRestante,
      pilha: cfg.pilha.slice()
    });

    if (resultado.aplicou) {
      simulacao.passoNumero += 1;
      const registro = {
        passo: simulacao.passoNumero,
        estado: resultado.configuracaoAnterior.estadoAtual,
        entradaRestante: resultado.configuracaoAnterior.entradaRestante,
        pilha: resultado.configuracaoAnterior.pilha.slice(),
        transicao: resultado.transicaoAplicada
      };
      simulacao.historico.push(registro);
      simulacao.configuracaoAtual = {
        estadoAtual: resultado.configuracaoAtual.estadoAtual,
        entradaRestante: resultado.configuracaoAtual.entradaRestante,
        pilha: resultado.configuracaoAtual.pilha.slice()
      };

      if (window.calculoAutomato.verificaAceitacao(dadosAutomato, simulacao.configuracaoAtual)) {
        simulacao.terminou = true;
        simulacao.aceitou = true;
      }
    } else {
      simulacao.passoNumero += 1;
      const registro = {
        passo: simulacao.passoNumero,
        estado: resultado.configuracaoAnterior.estadoAtual,
        entradaRestante: resultado.configuracaoAnterior.entradaRestante,
        pilha: resultado.configuracaoAnterior.pilha.slice(),
        transicao: '— nenhuma transição aplicável —'
      };
      simulacao.historico.push(registro);
      simulacao.terminou = true;
      simulacao.aceitou = false;
    }

    salvarSimulacaoNoStorage();
    atualizarInterface();
  });

  btnResetSim.addEventListener('click', () => {
    if (!confirm('Resetar simulação? O histórico será perdido.')) return;
    removerDados(DADOS_CHAVES.SIM);
    simulacao = { passoNumero: 0, historico: [], configuracaoAtual: null, terminou: false, aceitou: null };
    limparExibicao();
    btnProximo.disabled = false;
    resultadoFinal.textContent = '';
  });

  btnLimparTudo.addEventListener('click', () => {
    if (!confirm('Confirmar limpeza de todos os dados (automato, transições e simulação)?')) return;
    limparTudoStorage();
    // limpar UI
    document.getElementById('corpoTabelaTransicoes').innerHTML = '';
    document.getElementById('alfabetoEntradaDisplay').value = '';
    document.getElementById('sentencaInput').value = '';
    simulacao = { passoNumero: 0, historico: [], configuracaoAtual: null, terminou: false, aceitou: null };
    limparExibicao();
    alert('Dados removidos.');
  });

  // inicializar UI com dados salvos
  function carregarUIInicial() {
    const dados = lerDados(DADOS_CHAVES.DADOS);
    if (dados) {
      camposExibe.alfabetoEntradaDisplay.value = Array.isArray(dados.alfabetoDeEntrada) ? dados.alfabetoDeEntrada.join(',') : '';
      camposExibe.adicionarTransicaoButton.disabled = false;
    }
    simulacao = lerDados(DADOS_CHAVES.SIM) || simulacao;
    // renderizar transições existentes: pede ao modulo de transições que re-renderize (já o faz ao load)
    // (se listaDeTransicoes existirem, validaTransicoes.js renderizou)
    atualizarInterface();
  }

  carregarUIInicial();

})();
