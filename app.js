<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Orçafácil METLAL</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- LOGO E INFORMAÇÕES DA EMPRESA -->
  <div class="empresa-info" style="text-align: center;">
    <img src="logo-metlal.png" alt="Logo METLAL" width="300">
    <h2>METLAL METALÚRGICA LADEIRA LTDA</h2>
    <p>CNPJ: 00.000.000/0001-00</p>
    <p>Rua Jurucê, 78 – Colégio – Rio de Janeiro – RJ</p>
    <p>CEP: 21545-170</p>
    <hr />
  </div>

  <!-- FORMULÁRIO DE ORÇAMENTO -->
  <form id="orcamentoForm">
    <label for="produto">Produto:</label>
    <select id="produto">
      <option value="">Carregando...</option>
    </select>

    <label for="largura">Largura (m):</label>
    <input type="number" id="largura" step="0.01">

    <label for="altura">Altura (m):</label>
    <input type="number" id="altura" step="0.01">

    <label for="quantidade">Quantidade:</label>
    <input type="number" id="quantidade" min="1" value="1" required>

    <button type="submit">Gerar Orçamento</button>
  </form>

  <!-- RESULTADO -->
  <div id="resultado" style="margin-top: 20px;"></div>

  <!-- BOTÃO PDF -->
  <div style="margin-top: 20px; text-align: center;">
    <button onclick="gerarPDF()">Baixar Orçamento em PDF</button>
  </div>

  <!-- SCRIPTS -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script>
    let tabelaPreco = {};
    const sheetID = "1HhXN32p7V9NtzuuG-Xr03uBts_W2yNLBqosnZuWwGn8";
    const sheetName = "Página1";
    const url = https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?sheet=${sheetName};

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

          console.log("Produtos carregados:", tabelaPreco);
        })
        .catch(err => {
          console.error("Erro ao carregar planilha:", err);
          alert("Erro ao carregar os preços. Verifique se a planilha foi publicada.");
        });
    }

    carregarPrecos().then(() => {
      document.getElementById("orcamentoForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const produto = document.getElementById("produto").value;
        const largura = parseFloat(document.getElementById("largura").value);
        const altura = parseFloat(document.getElementById("altura").value);
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
        let total = 0;
        let detalhes = "";

        if (tipo === "m2") {
          if (isNaN(largura) || isNaN(altura)) {
            alert("Para produtos por m², informe largura e altura.");
            return;
          }
          const area = largura * altura * quantidade;
          total = preco * area;
          detalhes = `
            <p><strong>Largura:</strong> ${largura.toFixed(2)} m</p>
            <p><strong>Altura:</strong> ${altura.toFixed(2)} m</p>
            <p><strong>Área total:</strong> ${area.toFixed(2)} m²</p>
            <p><strong>Preço por m²:</strong> R$ ${preco.toFixed(2)}</p>
          `;
        } else if (tipo === "unidade") {
          total = preco * quantidade;
          detalhes = <p><strong>Preço unitário:</strong> R$ ${preco.toFixed(2)}</p>;
        } else {
          alert("Tipo de produto inválido.");
          return;
        }

        const resultadoHTML = `
          <h3>Orçamento Gerado</h3>
          <p><strong>Produto:</strong> ${produto}</p>
          <p><strong>Quantidade:</strong> ${quantidade}</p>
          ${detalhes}
          <p><strong>Total:</strong> <span style="color: green; font-size: 1.2em;">R$ ${total.toFixed(2)}</span></p>
        `;

        document.getElementById("resultado").innerHTML = resultadoHTML;
      });
    });

    function gerarPDF() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const resultadoHTML = document.getElementById("resultado").innerText;
      if (!resultadoHTML) {
        alert("Nenhum orçamento gerado ainda.");
        return;
      }

      doc.setFontSize(12);
      doc.text("METLAL METALÚRGICA LADEIRA LTDA", 10, 10);
      doc.text("CNPJ: 00.000.000/0001-00", 10, 16);
      doc.text("Rua Jurucê, 78 – Colégio – Rio de Janeiro – RJ", 10, 22);
      doc.text("CEP: 21545-170", 10, 28);

      doc.setFontSize(14);
      doc.text("Orçamento Gerado:", 10, 40);

      const texto = resultadoHTML.split('\n');
      let y = 50;
      texto.forEach(linha => {
        doc.text(linha.trim(), 10, y);
        y += 8;
      });

      doc.save("orcamento_METLAL.pdf");
    }
  </script>

</body>
</html>