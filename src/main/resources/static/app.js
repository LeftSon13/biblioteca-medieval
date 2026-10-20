// SESSÃO 6 — O navegador guarda os dados carregados para desenhar a estante.
const estado = {
    livros: [],
    categorias: [],
    autores: [],
    temporizadorNotificacao: null
};

const coresCapas = ["#6b3f38", "#38554c", "#4b4568", "#8b6634", "#3c526d"];

document.addEventListener("DOMContentLoaded", carregarDados);

async function carregarDados() {
    try {
        const respostas = await Promise.all([
            requisicaoApi("/api/livros"),
            requisicaoApi("/api/categorias"),
            requisicaoApi("/api/autores")
        ]);

        estado.livros = respostas[0];
        estado.categorias = respostas[1];
        estado.autores = respostas[2];

        desenharCategorias();
        desenharAutores();
        desenharResumo();
        desenharLivros();
        mostrarMensagemPagina("");
    } catch (erro) {
        mostrarMensagemPagina("Não foi possível carregar o acervo. " + erro.message, true);
    }
}

// SESSÃO 6 — Esta função centraliza chamadas HTTP e mensagens de erro da API.
async function requisicaoApi(caminho, configuracao = {}) {
    const resposta = await fetch(caminho, {
        ...configuracao,
        headers: {
            "Content-Type": "application/json",
            ...(configuracao.headers || {})
        }
    });

    if (!resposta.ok) {
        let detalheErro = null;
        try {
            detalheErro = await resposta.json();
        } catch {
            detalheErro = null;
        }

        const mensagemErro = detalheErro && (detalheErro.detail || detalheErro.message);
        throw new Error(mensagemErro || ("Erro HTTP " + resposta.status));
    }

    if (resposta.status === 204) {
        return null;
    }

    return resposta.json();
}

function desenharResumo() {
    document.getElementById("totalLivros").textContent = estado.livros.length;
    document.getElementById("totalCategorias").textContent = estado.categorias.length;

    const unidades = estado.livros.reduce(function (total, livro) {
        return total + Number(livro.quantidade || 0);
    }, 0);
    document.getElementById("totalEstoque").textContent = unidades;
    atualizarContador(estado.livros.length);
}

function atualizarContador(quantidade) {
    const palavra = quantidade === 1 ? "registro" : "registros";
    document.getElementById("contadorResultados").textContent = quantidade + " " + palavra;
}

function desenharCategorias() {
    const filtro = document.getElementById("filtroCategoria");
    const categoriaAtual = filtro.value;
    filtro.innerHTML = '<option value="">Todas as categorias</option>';

    estado.categorias.forEach(function (categoria) {
        const opcao = document.createElement("option");
        opcao.value = categoria.id;
        opcao.textContent = categoria.nome;
        filtro.append(opcao);
    });
    filtro.value = categoriaAtual;

    const seletorLivro = document.getElementById("categoriaLivro");
    const categoriaEscolhida = seletorLivro.value;
    seletorLivro.innerHTML = '<option value="">Escolha uma categoria</option>';

    estado.categorias.forEach(function (categoria) {
        const opcao = document.createElement("option");
        opcao.value = categoria.id;
        opcao.textContent = categoria.nome;
        seletorLivro.append(opcao);
    });
    seletorLivro.value = categoriaEscolhida;
}

function desenharAutores() {
    const lista = document.getElementById("listaAutores");
    const idsJaSelecionados = new Set(
        Array.from(document.querySelectorAll('input[name="autoresIds"]:checked')).map(function (caixa) {
            return caixa.value;
        })
    );
    lista.innerHTML = "";

    if (estado.autores.length === 0) {
        const ajuda = document.createElement("span");
        ajuda.className = "ajuda-campo";
        ajuda.textContent = "Ainda não há autores cadastrados.";
        lista.append(ajuda);
        return;
    }

    estado.autores.forEach(function (autor) {
        const rotulo = document.createElement("label");
        const caixa = document.createElement("input");
        const nome = document.createElement("span");
        rotulo.className = "opcao-autor";
        caixa.type = "checkbox";
        caixa.name = "autoresIds";
        caixa.value = autor.id;
        caixa.checked = idsJaSelecionados.has(String(autor.id));
        nome.textContent = autor.nome;
        rotulo.append(caixa, nome);
        lista.append(rotulo);
    });
}

// SESSÃO 6 — O filtro acontece no navegador e não altera os dados do banco.
function desenharLivros() {
    const grade = document.getElementById("listaLivros");
    const busca = document.getElementById("campoBusca").value.trim().toLocaleLowerCase("pt-BR");
    const categoriaSelecionada = document.getElementById("filtroCategoria").value;

    const livrosFiltrados = estado.livros.filter(function (livro) {
        const autores = (livro.autores || []).map(function (autor) {
            return autor.nome;
        }).join(" ");
        const textoLivro = (livro.titulo + " " + autores).toLocaleLowerCase("pt-BR");
        const combinaBusca = textoLivro.includes(busca);
        const combinaCategoria = !categoriaSelecionada
            || String(livro.categoria && livro.categoria.id) === categoriaSelecionada;
        return combinaBusca && combinaCategoria;
    });

    atualizarContador(livrosFiltrados.length);

    if (livrosFiltrados.length === 0) {
        const tituloVazio = estado.livros.length === 0
            ? "A estante ainda está vazia"
            : "Nenhum volume encontrado";
        const textoVazio = estado.livros.length === 0
            ? "Cadastre o primeiro livro para iniciar o acervo do reino."
            : "Tente mudar o texto da busca ou a categoria selecionada.";
        grade.innerHTML = '<div class="vazio">'
            + '<div class="vazio-icone" aria-hidden="true">▤</div>'
            + "<strong>" + tituloVazio + "</strong>"
            + "<p>" + textoVazio + "</p>"
            + "</div>";
        return;
    }

    grade.innerHTML = livrosFiltrados.map(criarCartaoLivro).join("");
}

function criarCartaoLivro(livro) {
    const indiceCor = Math.abs(Number(livro.id) || 0) % coresCapas.length;
    const autores = (livro.autores || []).map(function (autor) {
        return autor.nome;
    }).join(", ");
    const descricao = livro.detalhe && livro.detalhe.descricao
        ? livro.detalhe.descricao
        : "Sem detalhe informado.";
    const categoria = livro.categoria && livro.categoria.nome
        ? livro.categoria.nome
        : "Sem categoria";
    const id = Number(livro.id);

    return '<article class="cartao-livro">'
        + '<div class="capa-livro" style="--cor-capa: ' + coresCapas[indiceCor] + '">'
        + '<span class="capa-simbolo" aria-hidden="true">✦</span>'
        + "</div>"
        + '<div class="conteudo-livro">'
        + '<div class="linha-livro-topo">'
        + '<span class="categoria-tag">' + escaparHtml(categoria) + "</span>"
        + '<span class="ajuda-campo">TOMO #' + id + "</span>"
        + "</div>"
        + '<h3 class="titulo-livro">' + escaparHtml(livro.titulo) + "</h3>"
        + '<p class="autores-livro">' + (autores ? escaparHtml(autores) : "Autor não informado") + "</p>"
        + '<p class="descricao-livro">' + escaparHtml(descricao) + "</p>"
        + '<div class="dados-livro">'
        + "<span><strong>" + formatarMoeda(livro.preco) + "</strong></span>"
        + '<span>Estoque: <strong>' + Number(livro.quantidade) + "</strong></span>"
        + "</div>"
        + '<div class="acoes-livro">'
        + '<button class="botao botao-livro" type="button" data-editar="' + id + '">Editar registro</button>'
        + '<button class="botao botao-livro excluir" type="button" data-excluir="' + id + '">Excluir</button>'
        + "</div>"
        + "</div>"
        + "</article>";
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(Number(valor || 0));
}

// Texto vindo do banco é escapado antes de entrar no HTML da página.
function escaparHtml(valor) {
    const caracteres = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };
    return String(valor === null || valor === undefined ? "" : valor)
        .replace(/[&<>"']/g, function (caractere) {
            return caracteres[caractere];
        });
}

function mostrarMensagemPagina(texto, erro = false) {
    const mensagem = document.getElementById("mensagemPagina");
    mensagem.textContent = texto;
    mensagem.hidden = texto.length === 0;
    mensagem.classList.toggle("erro", erro);
}

function mostrarNotificacao(texto, erro = false) {
    const notificacao = document.getElementById("notificacao");
    notificacao.textContent = texto;
    notificacao.classList.toggle("erro", erro);
    notificacao.classList.add("visivel");
    clearTimeout(estado.temporizadorNotificacao);
    estado.temporizadorNotificacao = setTimeout(function () {
        notificacao.classList.remove("visivel");
    }, 3500);
}

function abrirFormularioLivro(livro = null) {
    const formulario = document.getElementById("formularioLivro");
    formulario.reset();
    document.getElementById("livroId").value = livro ? livro.id : "";
    document.getElementById("tituloDialogo").textContent =
        livro ? "Editar registro do livro" : "Cadastrar novo livro";
    document.getElementById("salvarLivro").textContent =
        livro ? "Salvar alterações" : "Salvar no acervo";
    document.getElementById("excluirLivro").hidden = !livro;
    document.getElementById("campoNovaCategoria").hidden = true;
    document.getElementById("campoNovoAutor").hidden = true;
    desenharCategorias();
    desenharAutores();

    if (livro) {
        document.getElementById("tituloLivro").value = livro.titulo;
        document.getElementById("precoLivro").value = livro.preco;
        document.getElementById("quantidadeLivro").value = livro.quantidade;
        document.getElementById("categoriaLivro").value =
            livro.categoria ? livro.categoria.id : "";
        document.getElementById("descricaoLivro").value =
            livro.detalhe ? livro.detalhe.descricao : "";

        const idsAutores = new Set((livro.autores || []).map(function (autor) {
            return String(autor.id);
        }));
        document.querySelectorAll('input[name="autoresIds"]').forEach(function (caixa) {
            caixa.checked = idsAutores.has(caixa.value);
        });
    }

    document.getElementById("dialogoLivro").showModal();
}

function fecharFormularioLivro() {
    const dialogo = document.getElementById("dialogoLivro");
    if (dialogo.open) dialogo.close();
}

document.getElementById("abrirNovoLivro").addEventListener("click", function () {
    abrirFormularioLivro();
});
document.getElementById("fecharDialogo").addEventListener("click", fecharFormularioLivro);
document.getElementById("cancelarDialogo").addEventListener("click", fecharFormularioLivro);
document.getElementById("campoBusca").addEventListener("input", desenharLivros);
document.getElementById("filtroCategoria").addEventListener("change", desenharLivros);

document.getElementById("listaLivros").addEventListener("click", async function (evento) {
    const botaoEditar = evento.target.closest("[data-editar]");
    const botaoExcluir = evento.target.closest("[data-excluir]");

    if (botaoEditar) {
        const id = Number(botaoEditar.dataset.editar);
        const livro = estado.livros.find(function (item) {
            return Number(item.id) === id;
        });
        if (livro) abrirFormularioLivro(livro);
    }

    if (botaoExcluir) {
        await excluirLivro(Number(botaoExcluir.dataset.excluir));
    }
});

// SESSÃO 6 — Ao salvar, o JavaScript transforma o formulário em JSON para a API.
document.getElementById("formularioLivro").addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const id = document.getElementById("livroId").value;
    const autoresIds = Array.from(
        document.querySelectorAll('input[name="autoresIds"]:checked')
    ).map(function (caixa) {
        return Number(caixa.value);
    });

    const livro = {
        titulo: document.getElementById("tituloLivro").value.trim(),
        preco: Number(document.getElementById("precoLivro").value),
        quantidade: Number(document.getElementById("quantidadeLivro").value),
        categoriaId: Number(document.getElementById("categoriaLivro").value),
        descricao: document.getElementById("descricaoLivro").value.trim(),
        autoresIds: autoresIds
    };

    try {
        await requisicaoApi(
            id ? "/api/livros/" + id : "/api/livros",
            {
                method: id ? "PUT" : "POST",
                body: JSON.stringify(livro)
            }
        );
        fecharFormularioLivro();
        await carregarDados();
        mostrarNotificacao(id ? "As alterações foram salvas." : "O livro entrou para o acervo.");
    } catch (erro) {
        mostrarNotificacao(erro.message, true);
    }
});

async function excluirLivro(id) {
    if (!window.confirm("Deseja retirar este livro do acervo?")) return;

    try {
        await requisicaoApi("/api/livros/" + id, { method: "DELETE" });
        fecharFormularioLivro();
        await carregarDados();
        mostrarNotificacao("O livro foi retirado do acervo.");
    } catch (erro) {
        mostrarNotificacao(erro.message, true);
    }
}

document.getElementById("excluirLivro").addEventListener("click", async function () {
    const id = Number(document.getElementById("livroId").value);
    if (id) await excluirLivro(id);
});

document.getElementById("alternarNovaCategoria").addEventListener("click", function () {
    const campos = document.getElementById("campoNovaCategoria");
    campos.hidden = !campos.hidden;
    if (!campos.hidden) document.getElementById("nomeNovaCategoria").focus();
});

document.getElementById("salvarNovaCategoria").addEventListener("click", async function () {
    const campo = document.getElementById("nomeNovaCategoria");
    const nome = campo.value.trim();
    if (!nome) {
        mostrarNotificacao("Digite o nome da categoria.", true);
        return;
    }

    try {
        const categoria = await requisicaoApi("/api/categorias", {
            method: "POST",
            body: JSON.stringify({ nome: nome })
        });
        await carregarDados();
        document.getElementById("categoriaLivro").value = categoria.id;
        campo.value = "";
        document.getElementById("campoNovaCategoria").hidden = true;
        mostrarNotificacao("Categoria adicionada.");
    } catch (erro) {
        mostrarNotificacao(erro.message, true);
    }
});

document.getElementById("alternarNovoAutor").addEventListener("click", function () {
    const campos = document.getElementById("campoNovoAutor");
    campos.hidden = !campos.hidden;
    if (!campos.hidden) document.getElementById("nomeNovoAutor").focus();
});

document.getElementById("salvarNovoAutor").addEventListener("click", async function () {
    const campo = document.getElementById("nomeNovoAutor");
    const nome = campo.value.trim();
    if (!nome) {
        mostrarNotificacao("Digite o nome do autor.", true);
        return;
    }

    try {
        const autor = await requisicaoApi("/api/autores", {
            method: "POST",
            body: JSON.stringify({ nome: nome })
        });
        await carregarDados();
        const caixaAutor = document.querySelector(
            'input[name="autoresIds"][value="' + Number(autor.id) + '"]'
        );
        if (caixaAutor) caixaAutor.checked = true;
        campo.value = "";
        document.getElementById("campoNovoAutor").hidden = true;
        mostrarNotificacao("Autor adicionado e selecionado.");
    } catch (erro) {
        mostrarNotificacao(erro.message, true);
    }
});
