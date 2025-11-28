// validaCalculoAutomato.js
// Funções que representam o motor do autômato (aplicáveis pela exibição)

(function () {

  function transicaoAplicavel(transicao, estadoAtual, entradaRestante, pilha) {
    if (transicao.estadoAtual !== estadoAtual) return false;

    const simboloEntrada = transicao.simboloEntrada || '';
    const precisaConsumir = simboloEntrada !== '' && simboloEntrada !== 'e' && simboloEntrada !== '?';
    if (precisaConsumir) {
      if (entradaRestante.length === 0) return false;
      if (entradaRestante[0] !== simboloEntrada) return false;
    }
    // se simboloEntrada === '?' aplica apenas se entradaRestante vazia
    if (simboloEntrada === '?') {
      if (entradaRestante.length !== 0) return false;
    }

    const simboloPilha = transicao.simboloPilha || '';
    const precisaChecarPilha = simboloPilha !== '' && simboloPilha !== 'e' && simboloPilha !== '?';
    if (precisaChecarPilha) {
      if (pilha.length === 0) return false;
      const topo = pilha[pilha.length - 1];
      if (topo !== simboloPilha) return false;
    }
    // se simboloPilha === '?' aplica apenas se pilha vazia
    if (simboloPilha === '?') {
      if (pilha.length !== 0) return false;
    }

    return true;
  }

  function aplicarTransicao(transicao, entradaRestante, pilha) {
    let novaEntrada = entradaRestante;
    let novaPilha = pilha.slice();

    const simboloEntrada = transicao.simboloEntrada || '';
    if (simboloEntrada !== '' && simboloEntrada !== 'e' && simboloEntrada !== '?') {
      novaEntrada = novaEntrada.slice(1);
    }

    const simboloPilha = transicao.simboloPilha || '';
    if (simboloPilha !== '' && simboloPilha !== 'e' && simboloPilha !== '?') {
      novaPilha.pop();
    }

    const escrita = transicao.simbolosPilha || '';
    if (!(escrita === '' || escrita === 'e')) {
      // empilha de forma que o primeiro caractere da string escrita fique por último (topo)
      for (let i = escrita.length - 1; i >= 0; i--) {
        const s = escrita[i];
        if (s && s !== ',') novaPilha.push(s);
      }
    }

    const proximoEstado = transicao.proximoEstado;
    const descricao = montarDescricaoTransicao(transicao);
    return { novoEstado: proximoEstado, novaEntrada, novaPilha, descricao };
  }

  function montarDescricaoTransicao(transicao) {
    const leFita = transicao.simboloEntrada && transicao.simboloEntrada !== '' ? transicao.simboloEntrada : 'e';
    const lePilha = transicao.simboloPilha && transicao.simboloPilha !== '' ? transicao.simboloPilha : 'e';
    const escrevePilha = transicao.simbolosPilha && transicao.simbolosPilha !== '' ? transicao.simbolosPilha : 'e';
    return `(${transicao.estadoAtual} → ${transicao.proximoEstado}, leitura: ${leFita}, pop: ${lePilha}, push: ${escrevePilha})`;
  }

  function passoSimulacao(dadosAutomato, configuracaoAtual) {
    const listaDeTransicoes = dadosAutomato.listaDeTransicoes || [];
    const estadoAtual = configuracaoAtual.estadoAtual;
    const entradaRestante = configuracaoAtual.entradaRestante;
    const pilha = configuracaoAtual.pilha;

    for (const tr of listaDeTransicoes) {
      if (transicaoAplicavel(tr, estadoAtual, entradaRestante, pilha)) {
        const aplicado = aplicarTransicao(tr, entradaRestante, pilha);
        const novaConfig = {
          estadoAtual: aplicado.novoEstado,
          entradaRestante: aplicado.novaEntrada,
          pilha: aplicado.novaPilha
        };
        return {
          aplicou: true,
          configuracaoAnterior: configuracaoAtual,
          configuracaoAtual: novaConfig,
          transicaoAplicada: aplicado.descricao
        };
      }
    }

    return {
      aplicou: false,
      configuracaoAnterior: configuracaoAtual,
      mensagem: 'Nenhuma transição aplicável'
    };
  }

  function verificaAceitacao(dadosAutomato, configuracao) {
    const estaEmFinal = (dadosAutomato.listaDeEstadosFinais || []).includes(configuracao.estadoAtual);
    const entradaVazia = configuracao.entradaRestante.length === 0;
    return estaEmFinal && entradaVazia;
  }

  // exporta para uso pela UI
  window.calculoAutomato = {
    passoSimulacao,
    verificaAceitacao,
    montarDescricaoTransicao
  };

})();
