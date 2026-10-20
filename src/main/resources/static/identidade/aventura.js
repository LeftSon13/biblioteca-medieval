const cenaEntrada = document.querySelector('#telaEntrada');
const cenaSala = document.querySelector('#telaSala');
const telaAcervo = document.querySelector('#telaAcervo');
const imagemPortao = document.querySelector('#imagemPortao');
const imagemSala = document.querySelector('#imagemSala');
const imagemAcervo = document.querySelector('#imagemAcervo');
const dialogoLivro = document.querySelector('#dialogoLivro');
const dialogoFormulario = document.querySelector('#dialogoFormulario');
const dialogoIndices = document.querySelector('#dialogoIndices');
const dialogoExcluir = document.querySelector('#dialogoExcluir');
const formularioLivro = document.querySelector('#formularioLivro');
const aprendizEntrada = document.querySelector('#aprendizEntrada');
const listaTomos = document.querySelector('#listaTomos');
const campoBusca = document.querySelector('#buscarLivro');
const filtroCategoria = document.querySelector('#filtrarCategoria');
const notificacao = document.querySelector('#notificacao');
const textoNotificacao = document.querySelector('#textoNotificacao');
const aprendizDaSala = document.querySelector('#falarAprendiz');
const corpoAprendiz = document.querySelector('#corpoAprendiz');
const aprendizDaFicha = document.querySelector('#aprendizFicha');
const aprendizFormulario = document.querySelector('#aprendizFormulario');
const falasDoAprendiz = [
    'Um livro tem seu próprio detalhe. A categoria pode reunir vários volumes.',
    'Um tomo pode ter vários autores, e cada autor pode participar de outros tomos.',
    'Dica de explorador: aperte E para visitar as estantes ou R para registrar um livro.',
    'Cada capa guarda título, preço, quantidade, categoria, detalhe e seus autores.'
];

let livros = [];
let categorias = [];
let autores = [];
let livroSelecionado = null;
let falaAnterior = -1;
let temporizadorNotificacao;
let temporizadorAprendiz;
let temporizadorLivroRecente;
const acoesComPausa = new Map();
let localDoAprendiz = 'centro';
let ultimaRotinaAprendiz = '';

function movimentoDesativado() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
        || document.body.classList.contains('movimento-pausado');
}

function iniciarAcaoComPausa(chave) {
    const acao = acoesComPausa.get(chave);
    if (!acao || movimentoDesativado()) return;
    acao.inicio = performance.now();
    acao.temporizador = window.setTimeout(() => {
        acoesComPausa.delete(chave);
        acao.executar();
    }, acao.tempoRestante);
}

function agendarAcaoComPausa(chave, executar, duracao) {
    cancelarAcaoComPausa(chave);
    acoesComPausa.set(chave, { executar, tempoRestante: duracao, inicio: 0, temporizador: null });
    iniciarAcaoComPausa(chave);
}

function cancelarAcaoComPausa(chave) {
    const acao = acoesComPausa.get(chave);
    if (acao?.temporizador) window.clearTimeout(acao.temporizador);
    acoesComPausa.delete(chave);
}

function pausarAcoesComPausa() {
    acoesComPausa.forEach((acao) => {
        if (!acao.temporizador) return;
        window.clearTimeout(acao.temporizador);
        acao.temporizador = null;
        acao.tempoRestante = Math.max(0, acao.tempoRestante - (performance.now() - acao.inicio));
    });
}

function retomarAcoesComPausa() {
    acoesComPausa.forEach((_, chave) => iniciarAcaoComPausa(chave));
}

// A URL permite comparar a mesma experiência com luz de vela ou luz azul.
function definirTema(temaEscolhido = new URLSearchParams(window.location.search).get('tema')) {
    const tema = temaEscolhido === 'noturna' ? 'noturna' : 'acolhedora';
    document.body.dataset.tema = tema;

    const arquivoPortao = tema === 'noturna' ? 'portao-noturno.png' : 'portao-acolhedor.png';
    const arquivoSala = tema === 'noturna' ? 'biblioteca-noturna.png' : 'biblioteca-acolhedora.png';
    imagemPortao.src = `assets/${arquivoPortao}`;
    imagemSala.src = `assets/${arquivoSala}`;
    imagemAcervo.src = `assets/${arquivoSala}`;

    document.querySelectorAll('[data-clima]').forEach((link) => {
        link.onclick = (evento) => {
            evento.preventDefault();
            definirTema(link.dataset.clima);
        };
        if (link.dataset.clima === tema) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    const urlAtualizada = new URL(window.location.href);
    urlAtualizada.searchParams.set('tema', tema);
    window.history.replaceState(null, '', urlAtualizada);
}

function entrarNoSalao(animar = false) {
    cancelarAcaoComPausa('entrada');
    if (animar && !movimentoDesativado()) {
        aprendizEntrada.classList.remove('caminhando-portao');
        void aprendizEntrada.offsetWidth;
        aprendizEntrada.classList.add('caminhando-portao');
        cenaEntrada.classList.add('porta-abrindo');
        agendarAcaoComPausa('entrada', () => {
            cenaEntrada.classList.remove('porta-abrindo');
            aprendizEntrada.classList.remove('caminhando-portao');
            mostrarSalao();
        }, 950);
        return;
    }
    cenaEntrada.classList.remove('porta-abrindo');
    aprendizEntrada.classList.remove('caminhando-portao');
    mostrarSalao();
}

function mostrarSalao() {
    cenaEntrada.hidden = true;
    cenaSala.hidden = false;
    telaAcervo.hidden = true;
    document.querySelector('#falaSala').textContent = '“Bem-vindo ao salão. Posso mostrar as estantes ou ajudar a registrar um novo tomo.”';
    animarAprendiz('animando-aceno');
    document.querySelector('#abrirAcervo').focus();
    programarVidaDoSalao();
}

function abrirAcervo() {
    if (!cenaEntrada.hidden || !telaAcervo.hidden) return;
    window.clearTimeout(temporizadorAprendiz);
    if (movimentoDesativado()) {
        mostrarAcervo();
        return;
    }
    cancelarAcaoComPausa('navegacao');
    caminharComAprendiz('estantes');
    agendarAcaoComPausa('navegacao', mostrarAcervo, 1900);
}

function mostrarAcervo() {
    telaAcervo.hidden = false;
    aplicarFiltros();
    window.setTimeout(() => campoBusca.focus(), 80);
}

function fecharAcervo() {
    telaAcervo.hidden = true;
    document.querySelector('#abrirAcervo').focus();
    voltarAprendizAoCentro();
    programarVidaDoSalao();
}

function mostrarNotificacao(mensagem, erro = false) {
    textoNotificacao.textContent = mensagem;
    notificacao.classList.remove('visivel', 'festejando', 'erro');
    void notificacao.offsetWidth;
    notificacao.classList.add('visivel');
    notificacao.classList.toggle('erro', erro);
    window.clearTimeout(temporizadorNotificacao);
    temporizadorNotificacao = window.setTimeout(() => notificacao.classList.remove('visivel'), 4200);
    if (!erro) {
        notificacao.classList.add('festejando');
        if (!cenaSala.hidden && telaAcervo.hidden && !document.querySelector('dialog[open]')) {
            animarAprendiz('animando-celebracao');
        }
    }
}

function animarAprendiz(estado) {
    const animacoes = ['indo-estantes', 'indo-mesa', 'indo-centro', 'animando-repouso', 'animando-leitura', 'animando-celebracao', 'animando-aceno', 'animando-escrita'];
    aprendizDaSala.classList.remove(...animacoes);
    if (!estado.startsWith('indo-')) ultimaRotinaAprendiz = estado;
    if (movimentoDesativado()) return;
    void corpoAprendiz.offsetWidth;
    aprendizDaSala.classList.add(estado);
}

function destacarPonto(local) {
    document.querySelector('#examinarEstantes').classList.toggle('zona-aprendiz', local === 'estantes');
    document.querySelector('#registrarNaMesa').classList.toggle('zona-aprendiz', local === 'mesa');
    aprendizDaSala.dataset.dica = local === 'estantes' ? 'ACERVO' : local === 'mesa' ? 'MESA DO ESCRIVÃO' : 'CONVERSAR';
}

function caminharComAprendiz(destino) {
    if (movimentoDesativado()) return;
    window.clearTimeout(temporizadorAprendiz);
    aprendizDaSala.classList.remove('perto-estantes', 'perto-mesa');
    const classe = destino === 'estantes' ? 'indo-estantes' : 'indo-mesa';
    animarAprendiz(classe);
    aprendizDaSala.dataset.destino = destino;
}

function voltarAprendizAoCentro() {
    if (localDoAprendiz === 'centro' || movimentoDesativado()) return;
    aprendizDaSala.classList.remove('perto-estantes', 'perto-mesa');
    animarAprendiz('indo-centro');
    aprendizDaSala.dataset.destino = 'centro';
}

corpoAprendiz.addEventListener('animationend', (evento) => {
    if (evento.animationName === 'caminhada-oito') {
        localDoAprendiz = aprendizDaSala.dataset.destino || 'centro';
        aprendizDaSala.classList.remove('indo-estantes', 'indo-mesa', 'indo-centro');
        aprendizDaSala.classList.toggle('perto-estantes', localDoAprendiz === 'estantes');
        aprendizDaSala.classList.toggle('perto-mesa', localDoAprendiz === 'mesa');
        destacarPonto(localDoAprendiz);
    }
    if (evento.animationName === 'ler-volume') aprendizDaSala.classList.remove('animando-leitura');
    if (evento.animationName === 'repouso-oito') aprendizDaSala.classList.remove('animando-repouso');
    if (evento.animationName === 'festejar') aprendizDaSala.classList.remove('animando-celebracao');
    if (evento.animationName === 'acenar-oito') aprendizDaSala.classList.remove('animando-aceno');
    if (evento.animationName === 'escrever-oito') aprendizDaSala.classList.remove('animando-escrita');
});

aprendizFormulario.addEventListener('animationend', (evento) => {
    if (evento.animationName === 'escrever-oito') aprendizFormulario.classList.remove('escrevendo');
});

document.querySelector('.sprite-notificacao').addEventListener('animationend', (evento) => {
    if (evento.animationName === 'festejar') notificacao.classList.remove('festejando');
});

function programarVidaDoSalao() {
    window.clearTimeout(temporizadorAprendiz);
    if (movimentoDesativado() || cenaSala.hidden || !telaAcervo.hidden || document.hidden || document.querySelector('dialog[open]')) return;
    const proximoMomento = 6500 + Math.random() * 7000;
    temporizadorAprendiz = window.setTimeout(() => {
        if (!cenaSala.hidden && telaAcervo.hidden && !document.querySelector('dialog[open]') && !document.hidden && !movimentoDesativado()) {
            // Pequenas ações variadas mantêm o aprendiz presente sem repetir uma fala automaticamente.
            const rotinasPossiveis = localDoAprendiz === 'mesa'
                ? ['animando-escrita', 'animando-repouso', 'animando-escrita']
                : localDoAprendiz === 'estantes'
                    ? ['animando-leitura', 'animando-repouso', 'animando-leitura']
                    : ['animando-repouso', 'animando-leitura', 'animando-aceno'];
            const rotinasSemRepetir = rotinasPossiveis.filter((rotina) => rotina !== ultimaRotinaAprendiz);
            const rotina = rotinasSemRepetir[Math.floor(Math.random() * rotinasSemRepetir.length)];
            ultimaRotinaAprendiz = rotina;
            animarAprendiz(rotina);
        }
        programarVidaDoSalao();
    }, proximoMomento);
}

function atualizarPausaDoMovimento(pausado) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sincronizarControlesMovimento();
        return;
    }
    document.body.classList.toggle('movimento-pausado', pausado);
    if (pausado) {
        window.clearTimeout(temporizadorAprendiz);
        pausarAcoesComPausa();
        document.getAnimations().forEach((animacao) => animacao.pause());
    } else {
        document.getAnimations().forEach((animacao) => animacao.play());
        retomarAcoesComPausa();
        if (!cenaSala.hidden) programarVidaDoSalao();
    }
    sincronizarControlesMovimento();
}

function sincronizarControlesMovimento() {
    const preferenciaSistema = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pausado = preferenciaSistema || document.body.classList.contains('movimento-pausado');
    document.querySelectorAll('[data-controle-movimento]').forEach((botao) => {
        botao.disabled = preferenciaSistema;
        botao.setAttribute('aria-pressed', String(pausado));
        botao.setAttribute('aria-label', preferenciaSistema
            ? 'Animações reduzidas pela preferência do sistema'
            : pausado ? 'Retomar animações' : 'Pausar animações');
        botao.querySelector('.icone-pausa use').setAttribute('href', pausado ? '#icone-reproduzir' : '#icone-pausa');
        botao.querySelector('.texto-pausa').textContent = preferenciaSistema
            ? 'MOV. REDUZIDO'
            : pausado ? 'RETOMAR' : 'PAUSAR';
    });
}

function escaparHtml(texto) {
    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// SESSÃO 6 — A interface trabalha com nomes, mas a API entrega objetos ligados por ids.
function prepararLivroParaTela(livro) {
    const categoria = livro.categoria ?? {};
    const detalhe = livro.detalhe ?? {};
    return {
        id: Number(livro.id),
        titulo: livro.titulo ?? '',
        preco: Number(livro.preco ?? 0),
        quantidade: Number(livro.quantidade ?? 0),
        categoriaId: Number(categoria.id ?? 0),
        categoria: categoria.nome ?? 'Sem categoria',
        detalhe: detalhe.descricao ?? '',
        autoresIds: (livro.autores ?? []).map((autor) => Number(autor.id)),
        autores: (livro.autores ?? []).map((autor) => autor.nome),
        capa: ['vinho', 'verde', 'azul'][Math.abs(Number(livro.id)) % 3]
    };
}

// Centraliza o fetch e trata respostas sem conteúdo, como o DELETE (HTTP 204).
async function requisitarApi(caminho, configuracao = {}) {
    const resposta = await fetch(caminho, {
        ...configuracao,
        headers: {
            'Content-Type': 'application/json',
            ...(configuracao.headers ?? {})
        }
    });

    if (!resposta.ok) {
        let corpoErro = {};
        try {
            corpoErro = await resposta.json();
        } catch {
            corpoErro = {};
        }
        throw new Error(corpoErro.detail || corpoErro.message || corpoErro.title || `Erro HTTP ${resposta.status}`);
    }

    if (resposta.status === 204) return null;
    return resposta.json();
}

async function carregarAcervo() {
    const estado = document.querySelector('#estadoApi');
    const botaoTentar = document.querySelector('#tentarCarregar');
    estado.hidden = false;
    botaoTentar.hidden = true;
    estado.textContent = 'O aprendiz está consultando as estantes...';
    listaTomos.setAttribute('aria-busy', 'true');

    try {
        const [livrosApi, categoriasApi, autoresApi] = await Promise.all([
            requisitarApi('/api/livros'),
            requisitarApi('/api/categorias'),
            requisitarApi('/api/autores')
        ]);
        livros = livrosApi.map(prepararLivroParaTela);
        categorias = categoriasApi;
        autores = autoresApi;
        renderizarOpcoesTaxonomia();
        renderizarIndices();
        estado.hidden = true;
        botaoTentar.hidden = true;
        document.querySelector('#totalLivrosSala').textContent = String(livros.length);
        document.querySelector('#totalCategoriasSala').textContent = String(categorias.length);
        aplicarFiltros();
        return true;
    } catch (erro) {
        livros = [];
        categorias = [];
        autores = [];
        renderizarOpcoesTaxonomia();
        renderizarIndices();
        document.querySelector('#totalLivrosSala').textContent = '0';
        document.querySelector('#totalCategoriasSala').textContent = '0';
        estado.textContent = `Não foi possível abrir o acervo: ${erro.message}. Confira se o banco e o servidor estão ativos e tente novamente.`;
        estado.hidden = false;
        botaoTentar.hidden = false;
        aplicarFiltros();
        return false;
    } finally {
        listaTomos.removeAttribute('aria-busy');
    }
}

function renderizarOpcoesTaxonomia() {
    const categoriaSelecionada = filtroCategoria.value;
    filtroCategoria.replaceChildren(new Option('TODAS AS CATEGORIAS', ''));
    categorias.forEach((categoria) => filtroCategoria.add(new Option(categoria.nome, String(categoria.id))));
    filtroCategoria.value = categoriaSelecionada;

    const seletorCategoria = formularioLivro.elements.categoriaId;
    const categoriaDoFormulario = seletorCategoria.value;
    seletorCategoria.replaceChildren(new Option('Escolha uma categoria', ''));
    categorias.forEach((categoria) => seletorCategoria.add(new Option(categoria.nome, String(categoria.id))));
    seletorCategoria.value = categoriaDoFormulario;

    const autoresSelecionados = new Set(
        [...document.querySelectorAll('input[name="autoresIds"]:checked')].map((caixa) => caixa.value)
    );
    const lista = document.querySelector('#listaAutores');
    lista.replaceChildren();
    if (autores.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.className = 'ajuda-campo';
        mensagem.textContent = 'Ainda não há autores cadastrados. Você pode criar um aqui.';
        lista.append(mensagem);
        return;
    }

    autores.forEach((autor) => {
        const rotulo = document.createElement('label');
        const caixa = document.createElement('input');
        const nome = document.createElement('span');
        rotulo.className = 'opcao-autor';
        caixa.type = 'checkbox';
        caixa.name = 'autoresIds';
        caixa.value = String(autor.id);
        caixa.checked = autoresSelecionados.has(caixa.value);
        nome.textContent = autor.nome;
        rotulo.append(caixa, nome);
        lista.append(rotulo);
    });
}

function informarErroNoFormulario(mensagem) {
    const aviso = document.querySelector('#erroFormulario');
    aviso.textContent = mensagem;
    aviso.hidden = false;
}

function limparErroNoFormulario() {
    const aviso = document.querySelector('#erroFormulario');
    aviso.textContent = '';
    aviso.hidden = true;
}

function renderizarIndices() {
    const montarLista = (elemento, itens, vazio) => {
        elemento.replaceChildren();
        if (itens.length === 0) {
            const mensagem = document.createElement('p');
            mensagem.textContent = vazio;
            elemento.append(mensagem);
            return;
        }
        itens.forEach((item) => {
            const linha = document.createElement('p');
            linha.textContent = item.nome;
            elemento.append(linha);
        });
    };
    montarLista(document.querySelector('#indiceCategorias'), categorias, 'Nenhuma categoria cadastrada.');
    montarLista(document.querySelector('#indiceAutores'), autores, 'Nenhum autor cadastrado.');
}

function renderizarLivros() {
    const textoBusca = normalizar(campoBusca.value.trim());
    const categoriaEscolhida = filtroCategoria.value;
    const encontrados = livros.filter((livro) => {
        const textoLivro = normalizar(`${livro.titulo} ${livro.categoria} ${livro.detalhe} ${livro.autores.join(' ')}`);
        const combinaBusca = textoLivro.includes(textoBusca);
        const combinaCategoria = !categoriaEscolhida || String(livro.categoriaId) === categoriaEscolhida;
        return combinaBusca && combinaCategoria;
    });

    document.querySelector('#livrosVisiveis').textContent = String(encontrados.length).padStart(2, '0');
    const mensagemVazia = document.querySelector('#semTomos');
    mensagemVazia.hidden = encontrados.length > 0;
    document.querySelector('#mensagemSemTomos').textContent = livros.length === 0
        ? 'As estantes ainda estão vazias. Vá até a mesa do escrivão para registrar o primeiro tomo.'
        : 'As estantes não encontraram nenhum tomo com esse nome. Ajuste a busca ou a categoria.';

    listaTomos.innerHTML = encontrados.map((livro) => {
        const idSeguro = Number(livro.id);
        const autores = escaparHtml(livro.autores.join(' e '));
        const capa = ['vinho', 'verde', 'azul'].includes(livro.capa) ? livro.capa : 'vinho';
        const linhasCapa = quebrarTitulo(livro.titulo.toLocaleUpperCase('pt-BR'));
        const seloDaCapa = { vinho: 'icone-livro-fechado', verde: 'icone-pena', azul: 'icone-lua' }[capa];
        return `
            <article class="tomo" data-categoria="${livro.categoriaId}">
                <button class="capa-tomo capa-${capa}" data-detalhe="${idSeguro}" type="button" aria-label="Abrir ${escaparHtml(livro.titulo)}">
                    <span class="runa" aria-hidden="true"><svg class="icone-pixel"><use href="#${seloDaCapa}"></use></svg></span><span class="nome-capa">${linhasCapa}</span><span class="lombada-capa"></span><span class="brilho-capa"></span>
                </button>
                <div class="info-tomo">
                    <div class="linha-tomo"><span class="tag-tomo">${escaparHtml(livro.categoria.toLocaleUpperCase('pt-BR'))}</span><span class="qualidade">REGISTRO · ${String(idSeguro).padStart(3, '0')}</span></div>
                    <h3>${escaparHtml(livro.titulo)}</h3>
                    <p class="autores-tomo">AUTORIA · ${autores}</p>
                    <p class="sinopse-tomo">${escaparHtml(livro.detalhe)}</p>
                    <div class="inventario-dados"><span>VALOR <b>${formatarPreco(livro.preco)}</b></span><span>ESTOQUE <b>${escaparHtml(livro.quantidade)}</b></span></div>
                    <button class="acao-inspecionar" data-detalhe="${idSeguro}" type="button">INSPECIONAR O TOMO <svg class="icone-pixel" aria-hidden="true"><use href="#icone-seta-direita"></use></svg></button>
                </div>
            </article>`;
    }).join('');
}

function quebrarTitulo(titulo) {
    // Só controla as linhas da arte da capa; o título legível permanece no cartão.
    const palavras = titulo.split(/\s+/);
    const linhas = [];
    let linha = '';
    palavras.forEach((palavra) => {
        if ((linha + ' ' + palavra).trim().length > 13 && linha) {
            linhas.push(linha);
            linha = palavra;
        } else {
            linha = (linha + ' ' + palavra).trim();
        }
    });
    if (linha) linhas.push(linha);
    return linhas.map(escaparHtml).join('<br>');
}

function normalizar(texto) {
    return texto.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function abrirFicha(id) {
    const livro = livros.find((item) => item.id === Number(id));
    if (!livro) return;
    livroSelecionado = livro;
    document.querySelector('#detalheTitulo').textContent = livro.titulo;
    document.querySelector('#detalheAutores').textContent = `AUTORIA · ${livro.autores.join(' · ')}`;
    document.querySelector('#detalheCategoria').textContent = livro.categoria;
    document.querySelector('#detalhePreco').textContent = formatarPreco(livro.preco);
    document.querySelector('#detalheQuantidade').textContent = String(livro.quantidade);
    document.querySelector('#detalheDescricao').textContent = livro.detalhe;
    dialogoLivro.showModal();
    aprendizDaFicha.classList.remove('lendo');
    void aprendizDaFicha.offsetWidth;
    if (!movimentoDesativado()) aprendizDaFicha.classList.add('lendo');
}

function aplicarFiltros() {
    renderizarLivros();
}

function abrirFormulario(livro = null) {
    cancelarAcaoComPausa('escrita-formulario');
    formularioLivro.reset();
    limparErroNoFormulario();
    document.querySelector('#tituloFormulario').textContent = livro ? 'Alterar registro do volume' : 'Registrar novo volume';
    formularioLivro.elements.titulo.value = livro?.titulo ?? '';
    formularioLivro.elements.preco.value = livro?.preco ?? '';
    formularioLivro.elements.quantidade.value = livro?.quantidade ?? '';
    renderizarOpcoesTaxonomia();
    formularioLivro.elements.categoriaId.value = livro?.categoriaId ?? '';
    formularioLivro.elements.detalhe.value = livro?.detalhe ?? '';
    const autoresDoLivro = new Set((livro?.autoresIds ?? []).map(String));
    document.querySelectorAll('input[name="autoresIds"]').forEach((caixa) => {
        caixa.checked = autoresDoLivro.has(caixa.value);
    });
    formularioLivro.dataset.idLivro = livro?.id ?? '';
    dialogoFormulario.showModal();
    aprendizFormulario.classList.remove('escrevendo');
    if (!movimentoDesativado()) animarEscriba();
    window.setTimeout(() => formularioLivro.elements.titulo.focus(), 50);
}

function animarEscriba() {
    if (!dialogoFormulario.open || movimentoDesativado()) return;
    aprendizFormulario.classList.remove('escrevendo');
    void aprendizFormulario.offsetWidth;
    aprendizFormulario.classList.add('escrevendo');
}

function fecharDialogo(dialogo, foco = null) {
    if (dialogo.open) dialogo.close();
    if (foco?.isConnected) foco.focus();
}

function focarLivroOuBusca(idLivro = null, realcarLivro = false) {
    const seletor = idLivro ? `[data-detalhe="${Number(idLivro)}"]` : '[data-detalhe]';
    const capaEncontrada = listaTomos.querySelector(`.capa-tomo${seletor}`);
    (capaEncontrada ?? campoBusca).focus();
    if (realcarLivro && capaEncontrada) {
        const tomo = capaEncontrada.closest('.tomo');
        tomo.classList.remove('tomo-recente');
        void tomo.offsetWidth;
        tomo.classList.add('tomo-recente');
        window.clearTimeout(temporizadorLivroRecente);
        temporizadorLivroRecente = window.setTimeout(() => tomo.classList.remove('tomo-recente'), 2300);
    }
}

function registrarLivroNaMesa() {
    if (movimentoDesativado()) {
        abrirFormulario();
        return;
    }
    cancelarAcaoComPausa('navegacao');
    caminharComAprendiz('mesa');
    agendarAcaoComPausa('navegacao', () => abrirFormulario(), 1900);
}

async function cadastrarCategoria() {
    const campo = document.querySelector('#novaCategoria');
    const nome = campo.value.trim();
    if (!nome) {
        informarErroNoFormulario('Escreva o nome da categoria antes de cadastrar.');
        campo.focus();
        return;
    }
    try {
        const categoria = await requisitarApi('/api/categorias', {
            method: 'POST',
            body: JSON.stringify({ nome })
        });
        await carregarAcervo();
        formularioLivro.elements.categoriaId.value = String(categoria.id);
        campo.value = '';
        mostrarNotificacao(`A categoria “${categoria.nome}” foi descoberta no acervo.`);
    } catch (erro) {
        informarErroNoFormulario(erro.message);
    }
}

async function cadastrarAutor() {
    const campo = document.querySelector('#novoAutor');
    const nome = campo.value.trim();
    if (!nome) {
        informarErroNoFormulario('Escreva o nome do autor antes de cadastrar.');
        campo.focus();
        return;
    }
    try {
        const autor = await requisitarApi('/api/autores', {
            method: 'POST',
            body: JSON.stringify({ nome })
        });
        await carregarAcervo();
        const caixaAutor = document.querySelector(`input[name="autoresIds"][value="${Number(autor.id)}"]`);
        if (caixaAutor) caixaAutor.checked = true;
        campo.value = '';
        mostrarNotificacao(`“${autor.nome}” foi adicionado e selecionado como autor.`);
    } catch (erro) {
        informarErroNoFormulario(erro.message);
    }
}

async function salvarLivro(evento) {
    evento.preventDefault();
    limparErroNoFormulario();
    const dados = new FormData(formularioLivro);
    const id = formularioLivro.dataset.idLivro;
    const livro = {
        titulo: String(dados.get('titulo')).trim(),
        preco: Number(dados.get('preco')),
        quantidade: Number(dados.get('quantidade')),
        categoriaId: Number(dados.get('categoriaId')),
        descricao: String(dados.get('detalhe')).trim(),
        autoresIds: dados.getAll('autoresIds').map(Number)
    };
    const botaoSalvar = formularioLivro.querySelector('[type="submit"]');
    botaoSalvar.disabled = true;
    botaoSalvar.textContent = 'SALVANDO...';
    try {
        await requisitarApi(id ? `/api/livros/${id}` : '/api/livros', {
            method: id ? 'PUT' : 'POST',
            body: JSON.stringify(livro)
        });
        fecharDialogo(dialogoFormulario);
        formularioLivro.reset();
        formularioLivro.dataset.idLivro = '';
        filtroCategoria.value = '';
        campoBusca.value = '';
        await carregarAcervo();
        focarLivroOuBusca(Number(id) || livros[0]?.id, true);
        mostrarNotificacao(id ? 'As alterações foram guardadas no acervo.' : 'O novo tomo foi guardado no acervo.');
    } catch (erro) {
        informarErroNoFormulario(erro.message);
    } finally {
        botaoSalvar.disabled = false;
        botaoSalvar.textContent = id ? 'Salvar alterações' : 'Guardar no acervo';
    }
}

async function excluirLivroDoAcervo() {
    const id = Number(dialogoExcluir.dataset.idLivro);
    const botaoExcluir = document.querySelector('#confirmarExclusao');
    const aviso = document.querySelector('#erroExclusao');
    aviso.textContent = '';
    aviso.hidden = true;
    botaoExcluir.disabled = true;
    try {
        await requisitarApi(`/api/livros/${id}`, { method: 'DELETE' });
        livroSelecionado = null;
        fecharDialogo(dialogoExcluir);
        fecharDialogo(dialogoLivro);
        await carregarAcervo();
        focarLivroOuBusca();
        mostrarNotificacao('O tomo foi retirado do acervo.');
    } catch (erro) {
        aviso.textContent = erro.message;
        aviso.hidden = false;
    } finally {
        botaoExcluir.disabled = false;
    }
}

document.querySelector('#abrirPortoes').addEventListener('click', () => entrarNoSalao(true));
document.querySelector('#pularEntrada').addEventListener('click', () => entrarNoSalao(false));
document.querySelectorAll('[data-controle-movimento]').forEach((botao) => {
    botao.addEventListener('click', () => {
        const animacoesEstaoPausadas = document.body.classList.contains('movimento-pausado');
        atualizarPausaDoMovimento(!animacoesEstaoPausadas);
    });
});
document.querySelector('#voltarEntrada').addEventListener('click', () => {
    cancelarAcaoComPausa('navegacao');
    window.clearTimeout(temporizadorAprendiz);
    cenaSala.hidden = true;
    cenaEntrada.hidden = false;
    cenaEntrada.classList.remove('porta-abrindo');
    aprendizEntrada.classList.remove('caminhando-portao');
    cancelarAcaoComPausa('entrada');
    document.querySelector('#abrirPortoes').focus();
});

document.querySelector('#examinarEstantes').addEventListener('click', abrirAcervo);
document.querySelector('#abrirAcervo').addEventListener('click', abrirAcervo);
document.querySelector('#fecharAcervo').addEventListener('click', fecharAcervo);
document.querySelector('#registrarNaMesa').addEventListener('click', registrarLivroNaMesa);
document.querySelector('#abrirCadastro').addEventListener('click', registrarLivroNaMesa);
document.querySelector('#novoTomo').addEventListener('click', () => abrirFormulario());
document.querySelector('#abrirIndices').addEventListener('click', () => dialogoIndices.showModal());
document.querySelector('#cadastrarCategoria').addEventListener('click', cadastrarCategoria);
document.querySelector('#cadastrarAutor').addEventListener('click', cadastrarAutor);
document.querySelector('#tentarCarregar').addEventListener('click', carregarAcervo);
document.querySelector('#novaCategoria').addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        cadastrarCategoria();
    }
});
document.querySelector('#novoAutor').addEventListener('keydown', (evento) => {
    if (evento.key === 'Enter') {
        evento.preventDefault();
        cadastrarAutor();
    }
});
aprendizDaSala.addEventListener('click', () => {
    const falasLivres = falasDoAprendiz.map((_, indice) => indice).filter((indice) => indice !== falaAnterior);
    const indice = falasLivres[Math.floor(Math.random() * falasLivres.length)];
    falaAnterior = indice;
    document.querySelector('#falaSala').textContent = `“${falasDoAprendiz[indice]}”`;
    animarAprendiz('animando-aceno');
    programarVidaDoSalao();
});

formularioLivro.addEventListener('input', (evento) => {
    if (!evento.target.matches('[name="titulo"], [name="preco"], [name="quantidade"], [name="detalhe"]')) return;
    agendarAcaoComPausa('escrita-formulario', animarEscriba, 750);
});

dialogoFormulario.addEventListener('close', () => {
    cancelarAcaoComPausa('escrita-formulario');
    aprendizFormulario.classList.remove('escrevendo');
    if (!cenaSala.hidden && telaAcervo.hidden) programarVidaDoSalao();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        window.clearTimeout(temporizadorAprendiz);
    } else if (!cenaSala.hidden && telaAcervo.hidden) {
        programarVidaDoSalao();
    }
});

listaTomos.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-detalhe]');
    if (botao) abrirFicha(botao.dataset.detalhe);
});
campoBusca.addEventListener('input', aplicarFiltros);
filtroCategoria.addEventListener('change', aplicarFiltros);

document.querySelector('#editarLivro').addEventListener('click', () => {
    const livroAtual = livroSelecionado;
    fecharDialogo(dialogoLivro);
    if (livroAtual) abrirFormulario(livroAtual);
});
document.querySelector('#excluirLivro').addEventListener('click', () => {
    if (!livroSelecionado) return;
    dialogoExcluir.dataset.idLivro = livroSelecionado.id;
    document.querySelector('#erroExclusao').hidden = true;
    document.querySelector('#erroExclusao').textContent = '';
    dialogoExcluir.showModal();
});
document.querySelector('#confirmarExclusao').addEventListener('click', excluirLivroDoAcervo);
document.querySelectorAll('[data-cancelar-exclusao]').forEach((botao) => {
    botao.addEventListener('click', () => fecharDialogo(dialogoExcluir));
});

formularioLivro.addEventListener('submit', salvarLivro);

document.querySelectorAll('[data-fechar-livro]').forEach((botao) => {
    botao.addEventListener('click', () => fecharDialogo(dialogoLivro));
});
document.querySelectorAll('[data-fechar-form]').forEach((botao) => {
    botao.addEventListener('click', () => fecharDialogo(dialogoFormulario));
});
document.querySelector('[data-fechar-indice]').addEventListener('click', () => fecharDialogo(dialogoIndices));

// Fechar clicando no fundo mantém o comportamento esperado de uma janela modal.
[dialogoLivro, dialogoFormulario, dialogoIndices, dialogoExcluir].forEach((dialogo) => {
    dialogo.addEventListener('click', (evento) => {
        if (evento.target === dialogo) dialogo.close();
    });
});

document.addEventListener('keydown', (evento) => {
    const alvo = evento.target;
    if (document.querySelector('dialog[open]')) return;
    const estaDigitando = alvo instanceof Element && alvo.matches('input, textarea, select, [contenteditable="true"]');
    if (estaDigitando) return;

    if (evento.ctrlKey && evento.key.toLowerCase() === 'f' && !cenaSala.hidden) {
        evento.preventDefault();
        if (telaAcervo.hidden) abrirAcervo();
        else campoBusca.focus();
        return;
    }

    if (!cenaSala.hidden && telaAcervo.hidden) {
        if (evento.key.toLowerCase() === 'e') abrirAcervo();
        if (evento.key.toLowerCase() === 'r') registrarLivroNaMesa();
    }
});

window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (evento) => {
    if (evento.matches) {
        window.clearTimeout(temporizadorAprendiz);
        pausarAcoesComPausa();
        document.getAnimations().forEach((animacao) => animacao.pause());
    } else if (!document.body.classList.contains('movimento-pausado')) {
        document.getAnimations().forEach((animacao) => animacao.play());
        retomarAcoesComPausa();
        if (!cenaSala.hidden) programarVidaDoSalao();
    }
    sincronizarControlesMovimento();
});

definirTema();
sincronizarControlesMovimento();
carregarAcervo();
