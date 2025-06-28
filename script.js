
const tabelaPreco = {};
const itens = [];

const sheetID = "1HhXN32p7V9NtzuuG-Xr03uBts_W2yNLBqosnZuWwGn8";
const sheetName = "Página1";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

function carregarProdutos() {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      const json = JSON.parse(data.substr(47).slice(0, -2));
      const produtos = json.table.rows.map(row => {
        const produto = row.c[0]?.v;
        const preco = parseFloat(row.c[1]?.v);
        if (produto && preco) {
          tabelaPreco[produto.toLowerCase()] = preco;
          return produto;
        }
        return null;
      }).filter(Boolean);

      const select = document.getElementById("produto");
      select.innerHTML = "<option value=''>Selecione</option>";
      produtos.forEach(prod => {
        const opt = document.createElement("option");
        opt.value = prod.toLowerCase();
        opt.textContent = prod;
        select.appendChild(opt);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar produtos:", err);
      alert("Erro ao carregar produtos da planilha.");
    });
}

carregarProdutos();

function adicionarItem() {
  const cliente = document.getElementById("cliente").value;
  const produto = document.getElementById("produto").value.toLowerCase();
  const largura = parseFloat(document.getElementById("largura").value);
  const altura = parseFloat(document.getElementById("altura").value);
  const comprimento = parseFloat(document.getElementById("comprimento").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!cliente || !produto || isNaN(largura) || isNaN(altura) || isNaN(quantidade)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const area = largura * altura * quantidade;
  const precoUnitario = tabelaPreco[produto] || 0;
  const valor = area * precoUnitario;

  const item = {
    produto,
    largura,
    altura,
    comprimento,
    quantidade,
    area: area.toFixed(2),
    valor: valor.toFixed(2),
  };

  itens.push(item);

  const dataAtual = new Date();
  const dataFormatada = dataAtual.toISOString().slice(0, 10).replace(/-/g, '');
  const numeroAleatorio = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  const referencia = `ORC-${dataFormatada}-${numeroAleatorio}`;

  document.getElementById("cabecalhoOrcamento").innerHTML = `
    <p><strong>Referência:</strong> ${referencia}</p>
    <p><strong>Cliente:</strong> ${cliente}</p>
    <hr>
  `;

  window.clienteAtual = cliente;
  window.referenciaAtual = referencia;

  renderizarItens();
}

function renderizarItens() {
  const container = document.getElementById("itensOrcamento");
  if (itens.length === 0) {
    container.innerHTML = "<p>Nenhum item adicionado.</p>";
    return;
  }

  let html = "<table border='1' width='100%' cellpadding='5' cellspacing='0'>";
  html += "<tr><th>Produto</th><th>Largura</th><th>Altura</th><th>Comprimento</th><th>Qtd</th><th>Área</th><th>Valor</th></tr>";
  itens.forEach(item => {
    html += `<tr>
      <td>${item.produto}</td>
      <td>${item.largura}</td>
      <td>${item.altura}</td>
      <td>${item.comprimento || '-'}</td>
      <td>${item.quantidade}</td>
      <td>${item.area} m²</td>
      <td>R$ ${item.valor}</td>
    </tr>`;
  });
  html += "</table>";

  container.innerHTML = html;
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(12);
  doc.text("METLAL METALÚRGICA LADEIRA LTDA", 10, 10);
  doc.text("CNPJ: 00.000.000/0001-00", 10, 16);
  doc.text("Rua Jurucê, 78 – Colégio – Rio de Janeiro – RJ", 10, 22);
  doc.text("CEP: 21545-170", 10, 28);

  doc.setFontSize(14);
  doc.text(`Referência: ${window.referenciaAtual || ''}`, 10, 40);
  doc.text(`Cliente: ${window.clienteAtual || ''}`, 10, 48);

  let y = 60;
  itens.forEach((item, index) => {
    doc.setFontSize(12);
    doc.text(`Item ${index + 1}: ${item.produto}, ${item.largura}x${item.altura} (${item.quantidade} un)`, 10, y);
    doc.text(`Área: ${item.area} m² | Valor: R$ ${item.valor}`, 10, y + 6);
    y += 14;
  });

  doc.save("orcamento_METLAL.pdf");
}
