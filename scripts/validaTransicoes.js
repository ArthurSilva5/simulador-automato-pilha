// validaTransicoes.js
// Cria linhas de transição, valida e salva no storage

(function () {
  const btnAdicionar = document.getElementById('adicionarTransicaoButton');
  const corpoTabelaTransicoes = document.getElementById('corpoTabelaTransicoes');

  let listaDeTransicoes = lerDados(DADOS_CHAVES.TRANS) || [];

  // renderiza transições já salvas
  function renderizarTransicoesSalvas() {
    corpoTabelaTransicoes.innerHTML = '';
    listaDeTransicoes.forEach((tr, idx) => {
      const linha = criarLinhaTransicaoComValores(tr, true, idx);
      corpoTabelaTransicoes.appendChild(linha);
    });
  }
  renderizarTransicoesSalvas();

  btnAdicionar.addEventListener('click', (e) => {
    e.preventDefault();
    adicionarLinhaTransicao();
  });

  function adicionarLinhaTransicao() {
    const novaLinha = document.createElement('tr');
    const campos = ['estadoAtual', 'proximoEstado', 'simboloEntrada', 'simboloPilha', 'simbolosPilha'];

    campos.forEach(campo => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.classList.add('form-control', 'form-control-sm');
      input.dataset.campo = campo;

      if (campo === 'simboloEntrada') input.placeholder = "símbolo (ou '?' para vazio, ou e para ε)";
      else if (campo === 'simboloPilha') input.placeholder = "símbolo da pilha (ou '?' para vazio, ou e para ε)";
      else if (campo === 'simbolosPilha') input.placeholder = "ex: A, AB ou e (ε)";
      else input.placeholder = campo;

      td.appendChild(input);
      novaLinha.appendChild(td);
    });

    const tdSalvar = document.createElement('td');
    const btnSalvar = document.createElement('button');
    btnSalvar.textContent = 'Salvar';
    btnSalvar.type = 'button';
    btnSalvar.classList.add('btn', 'btn-sm', 'btn-primary');
    btnSalvar.addEventListener('click', () => salvarTransicao(novaLinha));
    tdSalvar.appendChild(btnSalvar);

    const tdRemover = document.createElement('td');
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.type = 'button';
    btnRemover.classList.add('btn', 'btn-sm', 'btn-danger');
    btnRemover.addEventListener('click', () => novaLinha.remove());
    tdRemover.appendChild(btnRemover);

    novaLinha.appendChild(tdSalvar);
    novaLinha.appendChild(tdRemover);
    corpoTabelaTransicoes.appendChild(novaLinha);
  }

  function criarLinhaTransicaoComValores(tr, desativada, idx) {
    const linha = document.createElement('tr');
    const campos = ['estadoAtual', 'proximoEstado', 'simboloEntrada', 'simboloPilha', 'simbolosPilha'];
    campos.forEach(campo => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.classList.add('form-control', 'form-control-sm');
      input.dataset.campo = campo;
      input.value = tr[campo] || '';
      input.disabled = !!desativada;
      td.appendChild(input);
      linha.appendChild(td);
    });

    const tdSalvar = document.createElement('td');
    const btnSalvar = document.createElement('button');
    btnSalvar.textContent = 'Salvar';
    btnSalvar.type = 'button';
    btnSalvar.classList.add('btn', 'btn-sm', 'btn-primary');
    btnSalvar.addEventListener('click', () => salvarTransicao(linha));
    tdSalvar.appendChild(btnSalvar);

    const tdRemover = document.createElement('td');
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.type = 'button';
    btnRemover.classList.add('btn', 'btn-sm', 'btn-danger');
    btnRemover.addEventListener('click', () => {
      linha.remove();
      listaDeTransicoes = listaDeTransicoes.filter((_, i) => i !== idx);
      salvarDados(DADOS_CHAVES.TRANS, listaDeTransicoes);
    });
    tdRemover.appendChild(btnRemover);

    linha.appendChild(tdSalvar);
    linha.appendChild(tdRemover);
    return linha;
  }

  function salvarTransicao(linha) {
    const dados = lerDados(DADOS_CHAVES.DADOS);
    if (!dados) {
      linha.style.backgroundColor = '#f8d7da';
      alert('O autômato ainda não foi configurado. Confirme os dados iniciais.');
      return;
    }

    const inputs = linha.querySelectorAll('input');
    const transicao = {};
    inputs.forEach(input => transicao[input.dataset.campo] = (input.value || '').trim().toLowerCase());

    const resultado = validarTransicao(transicao, dados);
    if (resultado.valida) {
      listaDeTransicoes.push(transicao);
      salvarDados(DADOS_CHAVES.TRANS, listaDeTransicoes);
      linha.style.backgroundColor = '#d4edda';
      inputs.forEach(input => input.disabled = true);
      inputs.forEach(input => { if (input.value === 'e') input.value = 'ε'; });
    } else {
      linha.style.backgroundColor = '#f8d7da';
      alert(resultado.mensagem || 'Transição inválida.');
    }
  }

  function validarTransicao(transicao, dados) {
    const { listaDeEstados, alfabetoDeEntrada, listaDeAlfabetoPilha } = dados;

    if (!transicao.estadoAtual) return { valida: false, mensagem: 'Informe o estado atual.' };
    if (!listaDeEstados.includes(transicao.estadoAtual)) return { valida: false, mensagem: `Estado atual inválido: '${transicao.estadoAtual}'.` };

    if (!transicao.proximoEstado) return { valida: false, mensagem: 'Informe o próximo estado.' };
    if (!listaDeEstados.includes(transicao.proximoEstado)) return { valida: false, mensagem: `Próximo estado inválido: '${transicao.proximoEstado}'.` };

    const simboloEntrada = transicao.simboloEntrada;
    // aceita '', 'e' (epsilon), '?' (vazio) ou símbolo do alfabeto
    if (simboloEntrada !== '' && simboloEntrada !== 'e' && simboloEntrada !== '?' && !alfabetoDeEntrada.includes(simboloEntrada)) {
      return { valida: false, mensagem: `Símbolo de entrada inválido: '${simboloEntrada}'.` };
    }

    const simboloPilha = transicao.simboloPilha;
    if (simboloPilha !== '' && simboloPilha !== 'e' && simboloPilha !== '?' && !listaDeAlfabetoPilha.includes(simboloPilha)) {
      return { valida: false, mensagem: `Símbolo da pilha inválido: '${simboloPilha}'.` };
    }

    const escrita = transicao.simbolosPilha;
    if (escrita === '') return { valida: true, mensagem: '' };
    if (escrita === 'e') return { valida: true, mensagem: '' };
    // '?' não faz sentido em push
    if (escrita.includes('?')) return { valida: false, mensagem: "O símbolo '?' não é permitido na parte de escrita da pilha." };

    const simbolos = escrita.split('').filter(ch => ch !== ',');
    for (const s of simbolos) {
      if (!listaDeAlfabetoPilha.includes(s)) return { valida: false, mensagem: `Símbolo inválido para gravação na pilha: '${s}'.` };
    }

    return { valida: true, mensagem: '' };
  }

})();
