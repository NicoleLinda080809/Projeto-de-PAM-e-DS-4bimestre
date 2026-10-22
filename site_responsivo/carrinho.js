
const CHAVE_CARRINHO = "violet_carrinho";

const imagens = {
    avatar: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    estranho: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg",
    aranha: "https://image.tmdb.org/t/p/w500/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    mario: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg"
};

let carrinho = JSON.parse(localStorage.getItem(CHAVE_CARRINHO) || "[]");

const lista = document.getElementById("itens-carrinho");
const vazio = document.getElementById("carrinho-vazio");
const quantidadeItens = document.getElementById("quantidade-itens");
const subtotalElemento = document.getElementById("subtotal");
const taxaElemento = document.getElementById("taxa");
const totalElemento = document.getElementById("total");
const botaoFinalizar = document.getElementById("finalizar");

function dinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function salvarCarrinho() {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function renderizarCarrinho() {
    lista.innerHTML = "";

    vazio.classList.toggle("oculto", carrinho.length > 0);
    lista.classList.toggle("oculto", carrinho.length === 0);

    let unidades = 0;
    let subtotal = 0;

    carrinho.forEach((item, indice) => {
        unidades += item.quantidade;
        subtotal += item.preco * item.quantidade;

        const artigo = document.createElement("article");
        artigo.className = "item-carrinho";

        artigo.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}">

            <div class="item-info">
                <h3>${item.nome}</h3>
                <p>Ingresso de cinema</p>

                <span class="item-preco">
                    ${dinheiro(item.preco)} / unidade
                </span>

                <div class="item-acoes">
                    <div class="quantidade">
                        <button type="button"
                            data-acao="diminuir"
                            data-indice="${indice}"
                            aria-label="Diminuir quantidade">
                            <i data-lucide="minus"></i>
                        </button>

                        <span>${item.quantidade}</span>

                        <button type="button"
                            data-acao="aumentar"
                            data-indice="${indice}"
                            aria-label="Aumentar quantidade">
                            <i data-lucide="plus"></i>
                        </button>
                    </div>

                    <button type="button" class="remover"
                        data-acao="remover"
                        data-indice="${indice}">
                        <i data-lucide="trash-2"></i>
                        Remover
                    </button>
                </div>
            </div>
        `;

        lista.appendChild(artigo);
    });

    // Exemplo de taxa de serviço: 10% do subtotal.
    // Ajuste conforme as regras reais do seu projeto.
    const taxa = subtotal > 0 ? subtotal * 0.10 : 0;
    const total = subtotal + taxa;

    quantidadeItens.textContent =
        `${unidades} ${unidades === 1 ? "item" : "itens"}`;

    subtotalElemento.textContent = dinheiro(subtotal);
    taxaElemento.textContent = dinheiro(taxa);
    totalElemento.textContent = dinheiro(total);

    botaoFinalizar.disabled = carrinho.length === 0;

    salvarCarrinho();

    if (window.lucide) {
        lucide.createIcons();
    }
}

lista.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button[data-acao]");

    if (!botao) return;

    const indice = Number(botao.dataset.indice);
    const item = carrinho[indice];

    if (!item) return;

    switch (botao.dataset.acao) {
        case "aumentar":
            item.quantidade++;
            break;

        case "diminuir":
            item.quantidade--;

            if (item.quantidade <= 0) {
                carrinho.splice(indice, 1);
            }
            break;

        case "remover":
            carrinho.splice(indice, 1);
            break;
    }

    renderizarCarrinho();
});

botaoFinalizar.addEventListener("click", () => {
    if (carrinho.length === 0) return;

    alert("O próximo passo é integrar a finalização do pedido.");
});

// Disponibiliza uma função para o catálogo adicionar ingressos.
window.adicionarAoCarrinho = function (filme) {
    const existente = carrinho.find(item => item.id === filme.id);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            ...filme,
            quantidade: 1
        });
    }

    renderizarCarrinho();
};

renderizarCarrinho();
