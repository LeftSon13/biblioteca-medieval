// Prévia interativa para comparar o clima visual; estes dados são fictícios.
const parametros = new URLSearchParams(window.location.search);
const temaEscolhido = parametros.get("tema") === "noturna" ? "noturna" : "acolhedora";
document.body.dataset.tema = temaEscolhido;

const temas = {
    acolhedora: {
        imagem: "assets/biblioteca-acolhedora.png",
        descricao: "Biblioteca de castelo em pixel art iluminada por velas",
        etiqueta: "DIREÇÃO A · LUZ DE VELA",
        titulo: "Aconchegante · Biblioteca Medieval"
    },
    noturna: {
        imagem: "assets/biblioteca-noturna.png",
        descricao: "Biblioteca de castelo em pixel art iluminada pela lua",
        etiqueta: "DIREÇÃO B · NOITE AZULADA",
        titulo: "Noturna · Biblioteca Medieval"
    }
};

const temaAtual = temas[temaEscolhido];
document.title = `${temaAtual.titulo} — mockup visual`;
document.getElementById("imagemAmbiente").src = temaAtual.imagem;
document.getElementById("imagemAmbiente").alt = temaAtual.descricao;
document.getElementById("etiquetaClima").textContent = temaAtual.etiqueta;
document.querySelectorAll("[data-opcao-tema]").forEach(function (opcao) {
    if (opcao.dataset.opcaoTema === temaEscolhido) {
        opcao.classList.add("selecionado");
        opcao.setAttribute("aria-current", "page");
    }
});

const livrosExemplo = [
    { titulo: "As Crônicas do Reino", autores: "Lia Monteiro", categoria: "Fantasia", preco: "R$ 39,90", quantidade: "5 exemplares", descricao: "Uma jornada por terras antigas, pactos e castelos esquecidos." },
    { titulo: "Mapas do Mundo Antigo", autores: "Caio Ferreira", categoria: "História", preco: "R$ 52,00", quantidade: "2 exemplares", descricao: "Rotas, reinos e caminhos traçados por viajantes de outras eras." },
    { titulo: "O Bosque das Lanternas", autores: "Clara Nunes e Lia Monteiro", categoria: "Aventura", preco: "R$ 34,50", quantidade: "8 exemplares", descricao: "Dois viajantes seguem luzes misteriosas através da floresta." }
];

const entradaBusca = document.getElementById("buscarLivro");
const filtroCategoria = document.getElementById("filtrarCategoria");
const cartoesLivro = Array.from(document.querySelectorAll(".cartao-livro"));
const quantidadeVisivel = document.getElementById("quantidadeVisivel");
const mensagemVazia = document.getElementById("mensagemVazia");

function filtrarAcervo() {
    const busca = entradaBusca.value.trim().toLocaleLowerCase("pt-BR");
    const categoria = filtroCategoria.value;
    let quantidade = 0;

    cartoesLivro.forEach(function (cartao) {
        const correspondeBusca = cartao.dataset.busca.includes(busca);
        const correspondeCategoria = !categoria || cartao.dataset.categoria === categoria;
        const deveMostrar = correspondeBusca && correspondeCategoria;
        cartao.hidden = !deveMostrar;
        if (deveMostrar) quantidade++;
    });

    quantidadeVisivel.textContent = String(quantidade).padStart(2, "0");
    mensagemVazia.hidden = quantidade > 0;
}

entradaBusca.addEventListener("input", filtrarAcervo);
filtroCategoria.addEventListener("change", filtrarAcervo);

const dialogoFicha = document.getElementById("dialogoFicha");
document.querySelectorAll("[data-livro]").forEach(function (botao) {
    botao.addEventListener("click", function () {
        const livro = livrosExemplo[Number(botao.dataset.livro)];
        document.getElementById("tituloFicha").textContent = livro.titulo;
        document.getElementById("fichaAutores").textContent = `Por ${livro.autores}`;
        document.getElementById("fichaCategoria").textContent = livro.categoria;
        document.getElementById("fichaPreco").textContent = livro.preco;
        document.getElementById("fichaQuantidade").textContent = livro.quantidade;
        document.getElementById("fichaDescricao").textContent = livro.descricao;
        dialogoFicha.showModal();
    });
});

const dialogoNovoLivro = document.getElementById("dialogoNovoLivro");
document.getElementById("abrirNovoLivro").addEventListener("click", function () {
    dialogoNovoLivro.showModal();
});

document.querySelectorAll("[data-fechar]").forEach(function (botao) {
    botao.addEventListener("click", function () {
        botao.closest("dialog").close();
    });
});

const formularioLivro = document.getElementById("formularioLivro");
const notificacao = document.getElementById("notificacao");
let temporizadorNotificacao;

formularioLivro.addEventListener("submit", function (evento) {
    evento.preventDefault();
    dialogoNovoLivro.close();
    notificacao.textContent = "Este é um mockup visual: os campos serão ligados ao CRUD quando a interface final for construída.";
    notificacao.classList.add("visivel");
    window.clearTimeout(temporizadorNotificacao);
    temporizadorNotificacao = window.setTimeout(function () {
        notificacao.classList.remove("visivel");
    }, 4200);
});
