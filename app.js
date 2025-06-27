document.getElementById("orcamentoForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const produto = document.getElementById("produto").value;
  const largura = parseFloat(document.getElementById("largura").value);
  const altura = parseFloat(document.getElementById("altura").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!produto || isNaN(largura) || isNaN(altura) || isNaN(quantidade)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const area = largura * altura * quantidade;

  // Simulação de valor por m² por tipo de produto
  const tabelaPreco = {
    portao: 300,
    escada: 450,
    guarda: 250,
    janela: 200,
  };

  const precoUnitario = tabelaPreco[produto] || 0;
  const total = precoUnitario * area;

  const resultadoHTML = `
    <h3>Orçamento Gerado</h3>
    <p><strong>Produto:</strong> ${produto}</p>
    <p><strong>Largura:</strong> ${largura.toFixed(2)} m</p>
    <p><strong>Altura:</strong> ${altura.toFixed(2)} m</p>
    <p><strong>Quantidade:</strong> ${quantidade}</p>
    <p><strong>Área total:</strong> ${area.toFixed(2)} m²</p>
    <p><strong>Preço por m²:</strong> R$ ${precoUnitario.toFixed(2)}</p>
    <p><strong>Total:</strong> <span style="color: green; font-size: 1.2em;">R$ ${total.toFixed(2)}</span></p>
  `;

  document.getElementById("resultado").innerHTML = resultadoHTML;
});
