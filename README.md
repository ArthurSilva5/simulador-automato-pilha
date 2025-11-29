# Simulador de Autômato de Pilha (AP)

Simulador web interativo para autômatos de pilha (Pushdown Automaton), desenvolvido em JavaScript puro com HTML e Bootstrap 5. Permite configurar um autômato completo, definir transições e executar sentenças passo a passo.

## 📋 Índice

- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquivos JavaScript](#arquivos-javascript)
- [Ordem de Execução](#ordem-de-execução)
- [Fluxo de Funcionamento](#fluxo-de-funcionamento)
- [Requisitos Atendidos](#requisitos-atendidos)

## 📁 Estrutura do Projeto

```
Trabalho_Automato_Pilha/
├── index.html                    # Interface principal
├── scripts/
│   ├── global.js                 # Variáveis globais e memória
│   ├── validaEntradas.js         # Validação dos dados do autômato
│   ├── validaTransicoes.js       # Validação e gerenciamento de transições
│   ├── validaCalculoAutomato.js  # Lógica de execução do autômato
│   └── exibeResultado.js         # Exibição visual dos resultados
└── README.md                     # Este arquivo
```

## 📄 Arquivos JavaScript

### 1. `global.js` - Gerenciamento de Memória

**Responsabilidade:** Armazenar e gerenciar as variáveis globais do sistema.

**Variáveis Globais:**
- `dadosAutomato`: Objeto contendo a configuração do autômato (alfabeto de entrada, estados, estado inicial, estados finais, alfabeto da pilha)
- `listaTransicoes`: Array com todas as transições definidas pelo usuário
- `execucao`: Objeto representando o estado atual da execução (estado atual, entrada restante, pilha, transição aplicada)
- `historicoPassos`: Array com o histórico completo de todos os passos executados

**Funções:**
- `limparMemoria()`: Reseta todas as variáveis globais para seus valores iniciais

**Carregamento:** Primeiro arquivo carregado, fornece as variáveis base para todos os outros módulos.

---

### 2. `validaEntradas.js` - Validação dos Dados do Autômato

**Responsabilidade:** Validar e processar os dados de configuração do autômato inseridos pelo usuário.

**Funções Principais:**

#### `validarAlfabeto(alfabeto, nomeCampo)`
- Valida se o alfabeto não está vazio
- Separa os símbolos por vírgula
- Remove espaços em branco
- Verifica se não contém símbolos proibidos ("e" e "?")
- Retorna objeto com `valido` (boolean) e `simbolos` (array) ou `mensagem` (string de erro)

#### `validarEstados(listaEstados)`
- Valida se a lista de estados não está vazia
- Processa e limpa os estados
- Verifica se não contém símbolos proibidos
- Retorna objeto com `valido` e `estados` ou `mensagem`

#### `validarEstadoInicial(estadoInicial, listaEstados)`
- Verifica se o estado inicial não está vazio
- Confirma que o estado inicial existe na lista de estados
- Retorna objeto com `valido` ou `mensagem`

#### `validarEstadosFinais(listaEstadosFinais, listaEstados)`
- Valida se há pelo menos um estado final
- Verifica se todos os estados finais existem na lista de estados
- Retorna objeto com `valido` e `estadosFinais` ou `mensagem`

#### `confirmarAutomato()`
- Função principal chamada ao clicar no botão "Confirmar Autômato"
- Executa todas as validações em sequência
- Bloqueia alterações durante execução
- Armazena os dados validados em `dadosAutomato`
- Exibe mensagem de sucesso ou erro

**Carregamento:** Segundo arquivo carregado, necessário para validar os dados antes de criar transições.

---

### 3. `validaTransicoes.js` - Gerenciamento de Transições

**Responsabilidade:** Validar, adicionar, remover e exibir as transições do autômato.

**Funções Principais:**

#### `validarTransicao(estadoAtual, proximoEstado, lidoFita, lidoPilha, gravadoPilha)`
- Verifica se os dados do autômato foram confirmados
- Valida se os estados existem na lista de estados
- Valida símbolos de leitura da fita (permite "?", "e" ou símbolos do alfabeto)
- Valida símbolos de leitura da pilha (permite "?", "e" ou símbolos do alfabeto da pilha)
- Valida símbolos de gravação na pilha (permite "e" para épsilon ou símbolos do alfabeto da pilha)
- Retorna objeto com `valido` ou `mensagem`

#### `adicionarTransicao()`
- Função chamada ao clicar no botão "Adicionar"
- Bloqueia adição durante execução
- Lê valores dos campos de entrada
- Valida a transição
- Cria objeto de transição e adiciona à `listaTransicoes`
- Limpa os campos de entrada
- Atualiza a tabela de exibição

#### `atualizarTabelaTransicoes()`
- Atualiza a tabela HTML com todas as transições
- Formata símbolos especiais ("?" e "e" → "ε")
- Desabilita botões de remover durante execução
- Exibe mensagem quando não há transições

#### `removerTransicao(indice)`
- Remove uma transição da lista pelo índice
- Bloqueia remoção durante execução
- Atualiza a tabela após remoção

#### `validarTransicoesParaExecucao()`
- Verifica se há pelo menos uma transição antes de executar
- Retorna objeto com `valido` ou `mensagem`

**Carregamento:** Terceiro arquivo carregado, necessário para gerenciar transições antes da execução.

---

### 4. `validaCalculoAutomato.js` - Lógica de Execução

**Responsabilidade:** Implementar a lógica de execução do autômato passo a passo.

**Funções Principais:**

#### `validarSentenca(sentenca)`
- Verifica se o autômato foi configurado
- Valida se todos os símbolos da sentença pertencem ao alfabeto de entrada
- Retorna objeto com `valido` ou `mensagem`

#### `verificarAceitacao()`
- Verifica se a sentença foi aceita
- Condições: entrada vazia E estado atual é final
- Retorna `true` se aceita, `false` caso contrário

#### `verificarRejeicao()`
- Verifica se a sentença foi rejeitada
- Primeiro verifica se não foi aceita
- Procura por transições aplicáveis no estado atual
- Se não encontrar nenhuma transição aplicável, retorna `true` (rejeitada)

#### `encontrarTransicaoAplicavel()`
- Busca uma transição que possa ser aplicada no estado atual
- Verifica condições de entrada:
  - `"?"`: testa se entrada está vazia
  - `"e"`: movimento vazio (sempre aplicável)
  - Símbolo específico: verifica se entrada começa com esse símbolo
- Verifica condições de pilha:
  - `"?"`: testa se pilha está vazia
  - `"e"`: movimento vazio (sempre aplicável)
  - Símbolo específico: verifica se topo da pilha é esse símbolo
- Retorna a primeira transição aplicável encontrada ou `null`

#### `aplicarTransicao(transicao)`
- Aplica uma transição ao estado atual da execução
- Consome entrada se necessário (não é "?" nem "e")
- Remove da pilha se necessário (não é "?" nem "e")
- Adiciona à pilha se necessário (não é "e")
- Atualiza o estado atual para o próximo estado

#### `formatarTransicao(transicao)`
- Formata uma transição para exibição
- Converte "e" para "ε" e mantém "?" como "?"
- Retorna string formatada: `(estadoAtual → proximoEstado, leitura: X, lido da pilha: Y, gravado na pilha: Z)`

#### `bloquearCamposAutomato()` / `desbloquearCamposAutomato()`
- Bloqueia/desbloqueia todos os campos de entrada durante execução
- Previne alterações durante o processamento

#### `iniciarExecucao()`
- Função chamada ao clicar em "Iniciar Execução"
- Valida autômato, transições e sentença
- Inicializa objeto `execucao` com estado inicial
- Limpa histórico de passos
- Bloqueia campos
- Limpa exibição (não mostra informações ainda)

#### `gerarProximoPasso()`
- Função chamada ao clicar em "Próximo Passo"
- Adiciona passo inicial se for o primeiro passo
- Verifica aceitação/rejeição antes de processar
- Encontra e aplica transição aplicável
- Adiciona passo ao histórico
- Verifica aceitação/rejeição após aplicar
- Exibe alertas quando aceita/rejeita
- Atualiza exibição

#### `adicionarPassoAoHistorico()`
- Adiciona o estado atual ao histórico de passos
- Captura estado, entrada, pilha e transição aplicada
- Usado para exibir o histórico completo

#### `limparExibicao()`
- Limpa todos os elementos de exibição
- Reseta tabela de passos
- Usado ao iniciar execução ou resetar

#### `resetarExecucao()`
- Reseta a execução atual
- Desbloqueia campos
- Limpa exibição

**Carregamento:** Quarto arquivo carregado, implementa a lógica principal de execução.

---

### 5. `exibeResultado.js` - Exibição Visual

**Responsabilidade:** Atualizar a interface visual com os resultados da execução.

**Funções Principais:**

#### `formatarPilha(pilha)`
- Formata array de pilha para exibição em texto
- Retorna "(vazia)" se pilha estiver vazia
- Retorna símbolos separados por espaço

#### `exibirPilha(pilha)`
- Atualiza o elemento visual da pilha
- Exibe pilha verticalmente (topo no topo)
- Mostra "(vazia)" quando apropriado

#### `exibirEstadoAtual()`
- Atualiza a seção "Estado Atual da Execução"
- Exibe estado atual, entrada restante e transição aplicada
- Busca última transição do histórico para exibir

#### `exibirTabelaPassos()`
- Atualiza a tabela de histórico de passos
- Cria uma linha para cada passo executado
- Exibe número do passo, estado, entrada, pilha e transição
- Mostra mensagem quando não há passos

#### `exibirResultadoFinal()`
- Atualiza o resultado final (ACEITA/REJEITADA)
- Usa cores diferentes (verde para aceita, vermelho para rejeitada)
- Limpa resultado quando ainda em execução

#### `exibirExecucao()`
- Função principal de exibição
- Chama todas as funções de exibição em sequência
- Atualiza estado atual, pilha, tabela e resultado

**Carregamento:** Quinto e último arquivo carregado, responsável pela apresentação visual.

---

## 🔄 Ordem de Execução

### 1. Carregamento da Página

```
1. index.html carrega
2. global.js → Define variáveis globais
3. validaEntradas.js → Prepara validações de entrada
4. validaTransicoes.js → Prepara gerenciamento de transições
5. validaCalculoAutomato.js → Prepara lógica de execução
6. exibeResultado.js → Prepara exibição visual
```

### 2. Configuração do Autômato

```
1. Usuário preenche campos:
   - Alfabeto de entrada
   - Lista de estados
   - Estado inicial
   - Estados finais
   - Alfabeto da pilha

2. Usuário clica em "Confirmar Autômato"
   → confirmarAutomato() (validaEntradas.js)
   → Valida cada campo sequencialmente
   → Armazena em dadosAutomato (global.js)
```

### 3. Definição de Transições

```
1. Usuário preenche campos de transição:
   - Estado atual
   - Próximo estado
   - Lido da fita
   - Lido da pilha
   - Gravado na pilha

2. Usuário clica em "Adicionar"
   → adicionarTransicao() (validaTransicoes.js)
   → validarTransicao() verifica dados
   → Adiciona à listaTransicoes (global.js)
   → atualizarTabelaTransicoes() atualiza visual
```

### 4. Início da Execução

```
1. Usuário digita sentença
2. Usuário clica em "Iniciar Execução"
   → iniciarExecucao() (validaCalculoAutomato.js)
   → validarTransicoesParaExecucao() verifica transições
   → validarSentenca() valida sentença
   → Cria objeto execucao (global.js)
   → bloquearCamposAutomato() bloqueia campos
   → limparExibicao() limpa visual
```

### 5. Execução Passo a Passo

```
1. Usuário clica em "Próximo Passo"
   → gerarProximoPasso() (validaCalculoAutomato.js)
   
2. Primeiro passo:
   → Adiciona passo inicial ao histórico
   → exibirExecucao() atualiza visual
   
3. Passos subsequentes:
   → verificarAceitacao() verifica se aceita
   → verificarRejeicao() verifica se rejeita
   → encontrarTransicaoAplicavel() busca transição
   → aplicarTransicao() aplica transição
   → adicionarPassoAoHistorico() registra passo
   → verificarAceitacao() verifica novamente
   → exibirExecucao() atualiza visual
   → Alert se aceita/rejeita
```

### 6. Fluxo de Aplicação de Transição

```
1. encontrarTransicaoAplicavel():
   - Itera sobre listaTransicoes
   - Para cada transição:
     a. Verifica se estado atual coincide
     b. Verifica condição de entrada:
        - "?" → entrada deve estar vazia
        - "e" → sempre verdadeiro (movimento vazio)
        - Símbolo → entrada deve começar com símbolo
     c. Verifica condição de pilha:
        - "?" → pilha deve estar vazia
        - "e" → sempre verdadeiro (movimento vazio)
        - Símbolo → topo da pilha deve ser símbolo
     d. Se ambas condições satisfeitas → retorna transição

2. aplicarTransicao(transicao):
   - Se lidoFita não é "?" nem "e":
     → Remove primeiro caractere da entrada
   - Se lidoPilha não é "?" nem "e":
     → Remove topo da pilha
   - Se gravadoPilha não é "e":
     → Adiciona símbolos à pilha (invertidos)
   - Atualiza estado para proximoEstado
```

### 7. Exibição de Resultados

```
1. exibirExecucao() (exibeResultado.js):
   → exibirEstadoAtual() atualiza estado atual
   → exibirPilha() atualiza visual da pilha
   → exibirTabelaPassos() atualiza histórico
   → exibirResultadoFinal() atualiza resultado
```

### 8. Reset

```
1. Usuário clica em "Resetar Tudo"
   → limparMemoria() (global.js) limpa variáveis
   → desbloquearCamposAutomato() libera campos
   → limparExibicao() limpa visual
   → Limpa campos HTML
```

---

## 🔀 Fluxo de Funcionamento Completo

---

## ✅ Requisitos Atendidos

### Requisitos Essenciais

- ✅ **Especificação completa do autômato:**
  - Alfabeto de entrada
  - Lista de estados
  - Estado inicial
  - Estados finais
  - Alfabeto da pilha
  - Transições entre estados (tabela)

- ✅ **Execução passo-a-passo:**
  - Campo para informar sentença
  - Botão "Próximo Passo" para execução controlada

- ✅ **Exibição durante execução:**
  - Estado em execução
  - Situação da pilha (visual)
  - Situação da entrada
  - Transição aplicada

- ✅ **Resultado final:**
  - Exibição de ACEITA ou REJEITADA
  - Alert confirmando resultado

### Práticas Adotadas

- ✅ Botão do próximo passo
- ✅ Exibição da pilha a cada passo
- ✅ Organização por funções (sem classes)
- ✅ Bootstrap 5 (sem CSS extra)
- ✅ Código limpo e direto
- ✅ Variáveis em PT-BR com camelCase
- ✅ Nomes de variáveis esclarecedores

---

## 📝 Notas Técnicas

### Símbolos Especiais

- **"?"**: Teste de vazio (verifica se entrada/pilha está vazia)
- **"e"**: Movimento vazio/épsilon (não lê, mas não testa vazio)
- **"ε"**: Representação visual do épsilon na exibição

### Estrutura de Dados

**dadosAutomato:**
```javascript
{
  alfabetoEntrada: ["a", "b"],
  estados: ["q0", "q1", "qf"],
  estadoInicial: "q0",
  estadosFinais: ["qf"],
  alfabetoPilha: ["A", "B"]
}
```

**transicao:**
```javascript
{
  estadoAtual: "q0",
  proximoEstado: "q1",
  lidoFita: "a",      // ou "?" ou "e"
  lidoPilha: "A",     // ou "?" ou "e"
  gravadoPilha: "AB"  // ou "e"
}
```

**execucao:**
```javascript
{
  estado: "q0",
  entrada: "aaabbb",
  pilha: ["A", "A"],
  transicao: null     // ou objeto de transição
}
```

