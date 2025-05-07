window.onload = function () {
    const formulario = document.getElementById("formularioAlerta");
    formulario.addEventListener("submit", enviarFormulario);
    carregarAlertasSalvos();
    monitoramento();
    carregarProdutos();
};

function carregarProdutos() {
    fetch("https://api-odinline.odiloncorrea.com/produto")
        .then(res => {
            if (!res.ok) {
                throw new Error("Erro ao carregar produtos.");
            }
            return res.json();
        })
        .then(produtos => {
            const select = document.getElementById("idProduto");
            select.innerHTML = '<option value="">Selecione um produto</option>';

            produtos.forEach(produto => {
                const option = document.createElement("option");
                option.value = produto.id;
                option.textContent = `${produto.id} - ${produto.descricao}`;
                select.appendChild(option);
            });
        })
        .catch(err => {
            alert("Erro ao carregar produtos: " + err.message);
        });
}

function enviarFormulario(evento) {
    evento.preventDefault();

    const idProduto = document.getElementById("idProduto").value;
    const valorDesejado = parseFloat(document.getElementById("valor").value);
    const acao = document.getElementById("acao").value;

    if (!idProduto || isNaN(valorDesejado)) {
        alert("Por favor, selecione um produto e informe o valor desejado.");
        return;
    }

    fetch("https://api-odinline.odiloncorrea.com/produto/" + idProduto)
        .then(res => {
            if (!res.ok) {
                throw new Error("Produto não encontrado.");
            }
            return res.json();
        })
        .then(produto => {
            let alertas = JSON.parse(localStorage.getItem("alertas")) || [];
            if (alertas.some(a => a.id === produto.id)) {
                alert("Este produto já está com alerta ativo.");
                return;
            }

            const alerta = {
                id: produto.id,
                descricao: produto.descricao,
                valorDesejado: valorDesejado,
                acao: acao
            };

            alertas.push(alerta);
            localStorage.setItem("alertas", JSON.stringify(alertas));
            adicionarNaTabela(alerta);
        })
        .catch(erro => {
            alert("Erro: " + erro.message);
        });
}


function adicionarNaTabela(alerta) {
    const tabela = document.querySelector("#tabelaAlertas tbody");
    const linha = document.createElement("tr");
    linha.setAttribute("data-id", alerta.id);
    linha.innerHTML = `
        <td>${alerta.id}</td>
        <td>${alerta.descricao}</td>
        <td>${alerta.valorDesejado.toFixed(2)}</td>
        <td>${alerta.acao}</td>
    `;
    tabela.appendChild(linha);
}


function carregarAlertasSalvos() {
    const alertas = JSON.parse(localStorage.getItem("alertas")) || [];
    alertas.forEach(adicionarNaTabela);
}

function monitoramento() {
    setInterval(() => {
        const alertas = JSON.parse(localStorage.getItem("alertas")) || [];

        alertas.forEach(alerta => {
            fetch("https://api-odinline.odiloncorrea.com/produto/" + alerta.id)
                .then(res => {
                    if (!res.ok) throw new Error();
                    return res.json();
                })
                .then(produto => {
                    if (produto.valor <= alerta.valorDesejado) {
                        if (alerta.acao === "comprar") {
                            let compras = JSON.parse(localStorage.getItem("compras")) || [];
                            compras.push({
                                id: produto.id,
                                descricao: produto.descricao,
                                valor: produto.valor
                            });
                            localStorage.setItem("compras", JSON.stringify(compras));

                            alert(`O produto "${produto.descricao}" foi comprado automaticamente por R$ ${produto.valor.toFixed(2)}.`);

                            removerDaTabelaEStorage(produto.id);
                            window.location.href = "compras.html";
                        } else if (alerta.acao === "alertar") {
                            alert(`O produto "${produto.descricao}" atingiu o valor desejado!`);

                            removerDaTabelaEStorage(produto.id);
                        }
                    }
                })
                .catch(() => {
                    console.log(`Erro ao verificar o produto ID ${alerta.id}`);
                });
        });
    }, 10000);
}


async function carregarProdutos() {
    const usuario = JSON.parse(localStorage.getItem("usuarioAutenticado"));
    const select = document.getElementById("idProduto");
    select.innerHTML = '<option value="" disabled selected>Selecione um Produto</option>';

    try {
        const resposta = await fetch(`https://api-odinline.odiloncorrea.com/produto/${usuario.chave}/usuario`);
        const produtos = await resposta.json();

        localStorage.setItem("mapaProdutos", JSON.stringify(produtos));

        produtos.forEach(produto => {
            const option = document.createElement("option");
            option.value = produto.id;
            option.textContent = produto.descricao;
            select.appendChild(option);
        });
    } catch (error) {
        alert("Erro ao carregar produtos.");
        console.error(error);
    }
}

function removerDaTabelaEStorage(idProduto) {
    const linha = document.querySelector(`tr[data-id='${idProduto}']`);
    if (linha) linha.remove();

    let alertas = JSON.parse(localStorage.getItem("alertas")) || [];
    alertas = alertas.filter(a => a.id !== idProduto);
    localStorage.setItem("alertas", JSON.stringify(alertas));
}

