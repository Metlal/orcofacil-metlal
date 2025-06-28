
let tabelaPreco = {};
let listaItens = [];
const sheetID = "1HhXN32p7V9NtzuuG-Xr03uBts_W2yNLBqosnZuWwGn8";
const sheetName = "Página1";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName}`;

function carregarPrecos() {
  return fetch(url)
    .then(res => res.text())
    .then(data => {
      const jsonData = JSON.parse(data.substr(47).slice(0, -2));
      const rows = jsonData.table.rows;

      const select = document.getElementById("produto");
      select.innerHTML = "";

      rows.forEach(row => {
        const nome = row.c[0]?.v;
        const preco = parseFloat(row.c[1]?.v);
        const tipo = row.c[2]?.v?.toLowerCase();

        if (nome && preco && tipo) {
          const produtoKey = nome.toLowerCase();
          tabelaPreco[produtoKey] = { preco, tipo };

          const option = document.createElement("option");
          option.value = produtoKey;
          option.textContent = nome;
          select.appendChild(option);
        }
      });
    })
    .catch(err => {
      console.error("Erro ao carregar planilha:", err);
      alert("Erro ao carregar os preços. Verifique se a planilha foi publicada.");
    });
}

carregarPrecos();

function adicionarItem() {
  const produto = document.getElementById("produto").value;
  const largura = parseFloat(document.getElementById("largura").value);
  const altura = parseFloat(document.getElementById("altura").value);
  const comprimento = parseFloat(document.getElementById("comprimento").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  if (!produto || isNaN(quantidade)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const dadosProduto = tabelaPreco[produto];
  if (!dadosProduto) {
    alert("Produto não encontrado.");
    return;
  }

  const { preco, tipo } = dadosProduto;
  let subtotal = 0;
  let descricao = "";

  if (tipo === "m2") {
    if (isNaN(largura) || isNaN(altura)) {
      alert("Para produtos por m², informe largura e altura.");
      return;
    }
    const area = largura * altura;
    subtotal = preco * area * quantidade;
    descricao = `Área: ${area.toFixed(2)} m², Preço m²: R$ ${preco.toFixed(2)}`;
  } else if (tipo === "unidade") {
    subtotal = preco * quantidade;
    descricao = `Preço unitário: R$ ${preco.toFixed(2)}`;
  } else if (tipo === "m") {
    if (isNaN(comprimento)) {
      alert("Informe o comprimento para produtos por metro.");
      return;
    }
    subtotal = preco * comprimento * quantidade;
    descricao = `Comprimento: ${comprimento.toFixed(2)} m, Preço por metro: R$ ${preco.toFixed(2)}`;
  } else {
    alert("Tipo de produto inválido.");
    return;
  }

  listaItens.push({
    produto,
    quantidade,
    descricao,
    subtotal
  });

  atualizarLista();
}

function atualizarLista() {
  const container = document.getElementById("itensOrcamento");
  let html = "<h3>Itens do Orçamento</h3><ul>";
  let total = 0;

  listaItens.forEach(item => {
    html += `<li><strong>${item.produto}</strong> (${item.quantidade}): ${item.descricao} – <strong>Subtotal:</strong> R$ ${item.subtotal.toFixed(2)}</li>`;
    total += item.subtotal;
  });

  html += `</ul><p><strong>Total Geral:</strong> R$ ${total.toFixed(2)}</p>`;
  container.innerHTML = html;
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  if (listaItens.length === 0) {
    alert("Adicione ao menos um produto ao orçamento.");
    return;
  }

  doc.setFontSize(12);
  doc.text("METLAL METALÚRGICA LADEIRA LTDA", 10, 10);
  doc.text("CNPJ: 00.000.000/0001-00", 10, 16);
  doc.text("Rua Jurucê, 78 – Colégio – Rio de Janeiro – RJ", 10, 22);
  doc.text("CEP: 21545-170", 10, 28);

  doc.setFontSize(14);
  doc.text("Orçamento Gerado:", 10, 40);

  let y = 50;
  let total = 0;
  listaItens.forEach(item => {
    const linhas = [
      `Produto: ${item.produto}`,
      `Quantidade: ${item.quantidade}`,
      item.descricao,
      `Subtotal: R$ ${item.subtotal.toFixed(2)}`
    ];
    linhas.forEach(l => {
      doc.text(l, 10, y);
      y += 8;
    });
    y += 4;
    total += item.subtotal;
  });

  doc.setFontSize(13);
  doc.text(`Total Geral: R$ ${total.toFixed(2)}`, 10, y + 10);

  doc.save("orcamento_METLAL.pdf");
}
