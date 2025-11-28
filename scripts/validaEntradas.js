// validaEntradas.js
// Valida e organiza os dados iniciais do autômato

(function () {
  const btnConfirmar = document.getElementById('confirmarDadosEntradaButton');
  const btnAdicionarTransicao = document.getElementById('adicionarTransicaoButton');

  const campos = {
    alfabetoEntradaInput: document.getElementById('alfabetoEntradaInput'),
    estadosInput: document.getElementById('estadosInput'),
    estadoInicialInput: document.getElementById('estadoInicialInput'),
    estadosFinaisInput: document.getElementById('estadosFinaisInput'),
    alfabetoPilhaInput: document.getElementById('alfabetoPilhaInput'),
    alfabetoEntradaDisplay: document.getElementById('alfabetoEntradaDisplay')
  };

  // desabilita botão adicionar transição quando campos mudarem
  ['alfabetoEntradaInput','estadosInput','estadoInicialInput','estadosFinaisInput','alfabetoPilhaInput'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      btnAdicionarTransicao.disabled = true;
    });
  });

  btnConfirmar.addEventListener('click', () => {
    const dadosValidados = validarDadosEntrada();
    if (dadosValidados) {
      salvarDados(DADOS_CHAVES.DADOS, dadosValidados);
      btnAdicionarTransicao.disabled = false;
      campos.alfabetoEntradaDisplay.value = dadosValidados.alfabetoDeEntrada.join(',');
      alert('Dados do autômato validados e salvos. Agora adicione transições.');
    } else {
      btnAdicionarTransicao.disabled = true;
      alert('Corrija os campos para confirmar os dados.');
    }
  });

  function validarDadosEntrada() {
    const alfabetoEntrada = campos.alfabetoEntradaInput.value.toLowerCase().trim();
    const estados = campos.estadosInput.value.toLowerCase().trim();
    const estadoInicial = campos.estadoInicialInput.value.toLowerCase().trim();
    const estadosFinais = campos.estadosFinaisInput.value.toLowerCase().trim();
    const alfabetoPilha = campos.alfabetoPilhaInput.value.toLowerCase().trim();

    if (!todosCamposPreenchidos(alfabetoEntrada, estados, estadoInicial, estadosFinais, alfabetoPilha)) return false;
    if (!validarAlfabetos(alfabetoEntrada, alfabetoPilha)) return false;
    if (!validarEstados(estados, estadoInicial, estadosFinais)) return false;

    return organizarDados(alfabetoEntrada, estados, estadoInicial, estadosFinais, alfabetoPilha);
  }

  function todosCamposPreenchidos(...valores) {
    const camposVazios = valores.some(v => v.length === 0);
    if (camposVazios) {
      console.error('Existem campos obrigatórios vazios.');
      return false;
    }
    return true;
  }

  function validarAlfabetos(alfabetoEntrada, alfabetoPilha) {
    const listaEntrada = limparLista(alfabetoEntrada);
    const listaPilha = limparLista(alfabetoPilha);

    // '?' é reservado para transições - proibir nos alfabetos
    if (listaEntrada.includes('?') || listaPilha.includes('?')) {
      console.error("O símbolo '?' é reservado para transições e não pode estar no alfabeto.");
      return false;
    }

    if (listaEntrada.includes('') || listaPilha.includes('')) {
      console.error('Alfabeto contém elementos inválidos.');
      return false;
    }

    if (listaEntrada.includes('e') || listaPilha.includes('e')) {
      console.error("O símbolo 'e' é reservado para epsilon e não pode ser usado no alfabeto.");
      return false;
    }

    return true;
  }

  function validarEstados(estados, estadoInicial, estadosFinais) {
    const listaEstados = limparLista(estados);
    const listaFinais = limparLista(estadosFinais);

    if (estadoInicial.includes(',')) {
      console.error('Somente um estado inicial é permitido.');
      return false;
    }

    if (!listaEstados.includes(estadoInicial)) {
      console.error(`O estado inicial '${estadoInicial}' não existe na lista de estados.`);
      return false;
    }

    const estadosInvalidos = listaFinais.filter(e => !listaEstados.includes(e));
    if (estadosInvalidos.length > 0) {
      console.error('Há estados finais que não existem na lista de estados:', estadosInvalidos);
      return false;
    }

    return true;
  }

  function organizarDados(alfabetoEntrada, estados, estadoInicial, estadosFinais, alfabetoPilha) {
    return {
      listaDeEstados: limparLista(estados),
      listaDeEstadosFinais: limparLista(estadosFinais),
      estadoInicial: estadoInicial,
      alfabetoDeEntrada: limparLista(alfabetoEntrada),
      listaDeAlfabetoPilha: limparLista(alfabetoPilha),
      listaDeTransicoes: []
    };
  }

  function limparLista(texto) {
    return texto.split(',').map(v => v.trim()).filter(v => v.length > 0).filter((v, i, arr) => arr.indexOf(v) === i);
  }

})();
