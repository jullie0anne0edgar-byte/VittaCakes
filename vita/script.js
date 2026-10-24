const WHATSAPP_VITA_CAKES = "5586998525470";

const produtos = {
    "prestigio": {
        nome: "Prestígio",
        preco: 14.00
    },
    "chocolate-meio-amargo": {
        nome: "Chocolate meio amargo",
        preco: 14.00
    },
    "casadinho": {
        nome: "Casadinho",
        preco: 15.00
    },
    "ninho-geleia-morango": {
        nome: "Ninho com geleia de morango",
        preco: 15.00
    },
    "creme-ninho": {
        nome: "Creme de Ninho",
        preco: 14.00
    },
    "tortinha-limao": {
        nome: "Tortinha de limão",
        preco: 15.00
    },
    "mousse-maracuja-trufado": {
        nome: "Mousse de maracujá trufado",
        preco: 15.00
    }
};

function obterCarrinho() {
    try {
        return JSON.parse(localStorage.getItem("vitaCakesCarrinho")) || {};
    } catch (erro) {
        return {};
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem("vitaCakesCarrinho", JSON.stringify(carrinho));
    atualizarContadores();
}

function formatarPreco(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function adicionarProduto(id) {
    const carrinho = obterCarrinho();

    if (!produtos[id]) return;

    if (!carrinho[id]) {
        carrinho[id] = 0;
    }

    carrinho[id]++;

    salvarCarrinho(carrinho);

    alert(produtos[id].nome + " foi adicionado ao seu pedido!");
}

function alterarQuantidade(id, alteracao) {
    const carrinho = obterCarrinho();

    if (!carrinho[id]) return;

    carrinho[id] += alteracao;

    if (carrinho[id] <= 0) {
        delete carrinho[id];
    }

    salvarCarrinho(carrinho);
    mostrarCarrinho();
}

function removerProduto(id) {
    const carrinho = obterCarrinho();
    delete carrinho[id];

    salvarCarrinho(carrinho);
    mostrarCarrinho();
}

function atualizarContadores() {
    const carrinho = obterCarrinho();

    const quantidade = Object.values(carrinho)
        .reduce((total, item) => total + item, 0);

    document.querySelectorAll(".contador").forEach(elemento => {
        elemento.textContent = quantidade;
    });
}

function mostrarCarrinho() {
    const lista = document.getElementById("lista-carrinho");

    if (!lista) return;

    const carrinho = obterCarrinho();
    let total = 0;
    let html = "";

    for (const id in carrinho) {
        if (!produtos[id]) continue;

        const produto = produtos[id];
        const quantidade = carrinho[id];
        const subtotal = produto.preco * quantidade;

        total += subtotal;

        html += `
            <article class="item-carrinho">
                <div>
                    <h3>${produto.nome}</h3>
                    <p>${formatarPreco(produto.preco)} por unidade</p>

                    <div class="controles-quantidade">
                        <button type="button"
                            onclick="alterarQuantidade('${id}', -1)"
                            aria-label="Diminuir quantidade">−</button>

                        <span>${quantidade}</span>

                        <button type="button"
                            onclick="alterarQuantidade('${id}', 1)"
                            aria-label="Aumentar quantidade">+</button>
                    </div>
                </div>

                <div>
                    <strong>${formatarPreco(subtotal)}</strong>
                    <br>
                    <button type="button" class="botao-remover"
                        onclick="removerProduto('${id}')">
                        Remover
                    </button>
                </div>
            </article>
        `;
    }

    if (html === "") {
        html = `
            <div class="vazio">
                <p>Seu pedido ainda está vazio.</p>
                <p>Escolha seus doces no cardápio para começar!</p>
            </div>
        `;
    }

    lista.innerHTML = html;

    const totalElemento = document.getElementById("total-pedido");

    if (totalElemento) {
        totalElemento.textContent = formatarPreco(total);
    }

    atualizarContadores();
}

function encomendarProduto(nome) {
    const mensagem =
        `Olá! Gostaria de informações sobre uma encomenda na Vita Cakes.\n` +
        `Produto: ${nome}\n` +
        `Poderia me informar os sabores, valores e disponibilidade?`;

    const url = "https://wa.me/" + WHATSAPP_VITA_CAKES +
        "?text=" + encodeURIComponent(mensagem);

    window.open(url, "_blank");
}

function finalizarPedido(evento) {
    evento.preventDefault();

    const carrinho = obterCarrinho();
    const ids = Object.keys(carrinho).filter(id => produtos[id]);

    if (ids.length === 0) {
        alert("Seu pedido está vazio. Adicione produtos pelo cardápio.");
        return;
    }

    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const entrega = document.getElementById("entrega").value;
    const endereco = document.getElementById("endereco").value.trim();
    const pagamento = document.getElementById("pagamento").value;
    const observacoes = document.getElementById("observacoes").value.trim();

    if (!nome || !telefone || !entrega || !pagamento) {
        alert("Preencha os campos obrigatórios antes de continuar.");
        return;
    }

    if (entrega === "Entrega a combinar" && !endereco) {
        alert("Informe o endereço para combinar a entrega.");
        return;
    }

    let total = 0;
    let mensagem = "Olá! Gostaria de fazer um pedido na Vita Cakes. 🍰\n\n";

    mensagem += `Nome: ${nome}\n`;
    mensagem += `Telefone: ${telefone}\n`;
    mensagem += `Recebimento: ${entrega}\n`;

    if (endereco) {
        mensagem += `Endereço: ${endereco}\n`;
    }

    mensagem += `Pagamento: ${pagamento}\n\n`;
    mensagem += "MEU PEDIDO:\n";

    ids.forEach(id => {
        const produto = produtos[id];
        const quantidade = carrinho[id];
        const subtotal = produto.preco * quantidade;

        total += subtotal;

        mensagem +=
            `• ${produto.nome} — ${quantidade} unidade(s) — ` +
            `${formatarPreco(subtotal)}\n`;
    });

    mensagem += `\nTotal dos produtos: ${formatarPreco(total)}\n`;
    mensagem += "Entrega, se houver, a combinar.\n";

    if (observacoes) {
        mensagem += `\nObservações: ${observacoes}\n`;
    }

    mensagem += "\nAguardo a confirmação do pedido. Obrigado(a)!";

    const url = "https://wa.me/" + WHATSAPP_VITA_CAKES +
        "?text=" + encodeURIComponent(mensagem);

    window.open(url, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarContadores();
    mostrarCarrinho();

    const formulario = document.getElementById("form-pedido");

    if (formulario) {
        formulario.addEventListener("submit", finalizarPedido);
    }
});