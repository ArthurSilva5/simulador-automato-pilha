btnVerificarAutomato = document.getElementById("verificarAutomatoButton");

btnVerificarAutomato.addEventListener("click", () => {

    window.location.href = "resultado.html";

    validarDadosEntrada();

})

function validarDadosEntrada(){
  const alfabetoEntrada = document.getElementById("alfabetoEntradaInput").value;
  const estados = document.getElementById("estadosInput").value;
  const estadoInicial = document.getElementById("estadoInicialInput").value.trim();
  const estadosFinais = document.getElementById("estadosFinaisInput").value;
  const alfabetoPilha = document.getElementById("alfabetoPilhaInput").value;

  // Verifica se algum está vazio
  if (!alfabetoEntrada || !estados || !estadoInicial || !estadosFinais || !alfabetoPilha) {
    return null;
  }

  // Verificar se o estado inicial e os estados finais estão na lista de estados
   
  // Converte campos de listas em arrays
  const dados = {
    alfabetoEntrada: alfabetoEntrada.split(",").map(item => item.trim()),
    estados: estados.split(",").map(item => item.trim()),
    estadoInicial,
    estadosFinais: estadosFinais.split(",").map(item => item.trim()),
    alfabetoPilha: alfabetoPilha.split(",").map(item => item.trim())
  };

  console.log(dados);
}

function estruturarDadosEntrada(){
   // Estruturar os dados para realizar as operações
}