window.onload = function carregarLSCompras() {
    var compras = JSON.parse(localStorage.getItem("compras")) || [];

    var tbody = document.querySelector("#tabelaCompras tbody");

    if (compras.length === 0) {
        var linha = document.createElement("tr");
        var celula = document.createElement("td");
        celula.colSpan = 3;
        celula.className = "text-center text-muted";
        celula.innerText = "Nenhum centavo gasto ainda :(";
        linha.appendChild(celula);
        tbody.appendChild(linha);
        return;
    }

    for (var i = 0; i < compras.length; i++) {
        var compra = compras[i];
        var linha = document.createElement("tr");

        var tdId = document.createElement("td");
        tdId.innerText = compra.id;
        linha.appendChild(tdId);

        var tdDescricao = document.createElement("td");
        tdDescricao.innerText = compra.descricao;
        linha.appendChild(tdDescricao);

        var tdValor = document.createElement("td");
        tdValor.innerText = "R$ " + parseFloat(compra.valor).toFixed(2).replace(".", ",");
        linha.appendChild(tdValor);

        tbody.appendChild(linha);
    }
};
