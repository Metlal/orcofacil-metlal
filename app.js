let tabelaPreco = {};

// ID da planilha (extraído da URL)
const sheetID = "1HhXN32p7V9NtzuuG-Xr03uBts_W2yNLBqosnZuWwGn8";
const sheetName = "Precos METLAL";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${Precos METLAL}`;

// Função para carregar os dados da planilha
function carregarPrecos() {
  return fetch(url)
    .then(res => res.text())
    .then(data => {
      const jsonData = JSON.parse(data.substr(47).slice(0, -2));
      const rows = jsonData.table.rows.;

      rows.forEach(row => {
        const produto = row.c[0]?.v?.toLowerCase();
        const preco = parseFloat(row.c[1]?.v);
        if (produto && preco) {
          tabelaPreco[produto] = preco;
        }
      });
    })
    .catch(err => {
      console.error("Erro ao carregar planilha:", err);
    });
}

// Espera os preços carregarem antes de permitir submissão
carregarPrecos().then(() => {
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
    const precoUnitario = tabelaPreco[produto.toLowerCase()];

    if (!precoUnitario) {
      alert("Produto não encontrado na base de preços.");
      return;
    }

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
});