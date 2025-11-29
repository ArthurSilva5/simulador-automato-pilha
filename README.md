# Simulador de Autômato de Pilha (AP)

Simulador web interativo para autômatos de pilha (Pushdown Automaton), desenvolvido em JavaScript puro com HTML e Bootstrap 5.

## 🚀 Como Executar

1. **Abra o arquivo `index.html`** em qualquer navegador web moderno (Chrome, Firefox, Edge, etc.)

2. **Configure o autômato:**
   - Preencha o **Alfabeto de Entrada** (ex: `a,b`)
   - Preencha a **Lista de Estados** (ex: `q0,q1,q2`)
   - Preencha o **Estado Inicial** (ex: `q0`)
   - Preencha os **Estados Finais** (ex: `q1,q2`)
   - Preencha o **Alfabeto da Pilha** (ex: `A,B`)
   - Clique em **"Confirmar Autômato"**

3. **Adicione as transições:**
   - Preencha os campos de transição:
     - **Estado Atual**: estado de origem
     - **Próximo Estado**: estado de destino
     - **Lido da Fita**: símbolo lido da entrada (`?` = teste de vazio, `e` = movimento vazio/ε)
     - **Lido da Pilha**: símbolo lido da pilha (`?` = teste de vazio, `e` = movimento vazio/ε)
     - **Gravado na Pilha**: símbolos gravados na pilha (`e` = ε/nada)
   - Clique em **"Adicionar"** para cada transição

4. **Execute uma sentença:**
   - Digite a **sentença** a ser verificada no campo de entrada
   - Clique em **"Iniciar Execução"**
   - Clique em **"Próximo Passo"** para executar passo a passo
   - O resultado (ACEITA/REJEITADA) será exibido ao final

5. **Resetar:**
   - Clique em **"Resetar Tudo"** para limpar todos os dados e começar novamente

## 📝 Símbolos Especiais

- **`?`**: Teste de vazio (verifica se entrada/pilha está vazia)
- **`e`**: Movimento vazio/épsilon (não lê nada, mas não testa se está vazio)
- **`ε`**: Representação visual do épsilon na exibição

## 📋 Exemplo de Uso

**Autômato para reconhecer a^n b^n:**

1. **Alfabeto de Entrada:** `a,b`
2. **Lista de Estados:** `q0,q1,qf`
3. **Estado Inicial:** `q0`
4. **Estados Finais:** `qf`
5. **Alfabeto da Pilha:** `A`

**Transições:**
- `q0 → q0`: Lido `a`, Lido pilha `e`, Gravado `A`
- `q0 → q1`: Lido `b`, Lido pilha `A`, Gravado `e`
- `q1 → q1`: Lido `b`, Lido pilha `A`, Gravado `e`
- `q1 → q2`: Lido `e`, Lido pilha `e`, Gravado `e`
- `q2 → qf`: Lido `e`, Lido pilha `e`, Gravado `e`

**Teste com:** `aaabbb` (deve ser ACEITA)

## 🎯 Requisitos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Nenhuma instalação adicional necessária
- Funciona offline após o carregamento inicial
