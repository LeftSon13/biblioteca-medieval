# Biblioteca Medieval — direção visual aplicada

Este documento registra a direção visual e as decisões da interface atual. A API continua sendo o contrato funcional; a página de aventura usa esse contrato dentro de uma apresentação medieval em pixel art.

## Proposta de conceito

Uma biblioteca instalada dentro de um castelo: a pessoa atravessa um portal, chega às estantes e abre a ficha de um volume como se retirasse um livro da prateleira. A atmosfera é medieval em pixel art; a organização continua sendo a de um catálogo simples, com busca, filtro e ações explícitas.

O nome de trabalho permanece **Biblioteca Medieval**. Brasões, títulos de reino, personagens ou elementos de jogos existentes não serão incorporados; o projeto deve ter ilustrações próprias.

## Dois climas da mesma biblioteca

| Elemento | Aconchegante · luz de vela | Noturna · lua azulada |
|---|---|---|
| Sensação | Leitura, abrigo e descoberta | Silêncio, mistério e exploração |
| Base | Carvão quente `#201814`, madeira `#2B211B` | Marinho `#101827`, ardósia `#192539` |
| Destaques | Âmbar `#D6AD63`, creme `#F0D79D` | Ouro `#E5AE5C`, azul pálido `#A8BAD0` |
| Superfície de leitura | Pergaminho claro `#F0E4C8` | Papel lunar `#E7E5D9` |
| Imagem principal | Velas e madeira em pixel art | Vitral lunar, sombras azuis e velas de acento |
| Link do mockup | `http://localhost:8080/identidade/index.html?tema=acolhedora` | `http://localhost:8080/identidade/index.html?tema=noturna` |

As duas cenas usam a mesma câmera e disposição dos objetos. Assim, a pessoa escolhe o clima sem reaprender a posição das estantes ou da mesa.

## Arte aprovada e aplicada

- **Aprovada pelo usuário:** a nova cena noturna com a mesma composição da cena de velas, salva em `src/main/resources/static/identidade/assets/biblioteca-noturna.png`.
- **Aprovada anteriormente:** ilustração original da biblioteca iluminada por velas, em `src/main/resources/static/identidade/assets/biblioteca-acolhedora.png`.
- A cena noturna de enquadramento antigo foi preservada em `design/previews/biblioteca-noturna-composicao-anterior.png`.
- A proposta noturna aceita permanece em `design/previews/biblioteca-noturna-para-aprovacao.png` como registro do material aprovado.
- Ambas foram criadas para este projeto em pixel art. As referências externas abaixo orientaram a pesquisa, não foram usadas como arquivos ou elementos copiados.

## Frames da experiência

1. **Entrada — “Abrir os portões”**: arte de ambiente, nome da biblioteca e uma ação clara para entrar. A pessoa pode avançar imediatamente; uma animação curta de abertura é um detalhe, não um bloqueio.
2. **Acervo — “Explorar as estantes”**: barra de busca, filtro de categoria, contagem de volumes e cartões/capas com título, autores, preço e quantidade.
3. **Ficha — “Ler o volume”**: diálogo em papel/pergaminho com detalhe, categoria, preço, quantidade e todos os autores; oferece ações de editar e excluir.
4. **Cadastro/edição — “Adicionar ou alterar um volume”**: formulário com título, preço, quantidade, categoria, detalhe e seleção de autores existentes; o formulário deve explicar como criar autor ou categoria.
5. **Retorno — estado de confirmação**: resultado de salvar/excluir, erro da API e lista vazia aparecem com texto claro, sem depender apenas de cor ou movimento.

O mockup mostra o acervo, abre uma ficha de exemplo, filtra livros e exibe um formulário visual. **Ele é uma referência para revisar a identidade; não grava dados nem altera o CRUD.**

## Linguagem visual proposta

- **Moldura:** cantos e divisórias em degraus, filetes de pedra/madeira, pequenos selos e marcadores inspirados em livros iluminados.
- **Pixel art:** cenário principal e pequenos símbolos/capas; evitar textura pixelada por cima de textos e campos.
- **Tipografia:** títulos serifados com sensação de livro antigo; etiquetas, números de inventário e pequenos estados em fonte monoespaçada. Texto de leitura e campos ficam em corpo confortável.
- **Capa de livro:** cor própria por volume, moldura simples e símbolo central; a informação principal continua escrita em texto.
- **Interação:** destacar foco do teclado, separar botão principal de ações secundárias e pedir confirmação antes de excluir.
- **Animação:** abrir portão ao pedir entrada; tirar levemente a capa da estante ao selecionar; desenrolar o pergaminho ao abrir a ficha. Movimentos breves, sem brilho contínuo, respeitando `prefers-reduced-motion`.
- **Responsividade:** no celular, navegação compacta, filtros empilhados e cartões em coluna; manter os campos sem rolagem horizontal.

## Pesquisa usada como direção, não como imitação

- [Eastward — galeria oficial](https://eastwardgame.com/media/): referência de densidade de cenário e contraste de luz em pixel art.
- [NES.css — projeto aberto no GitHub](https://github.com/nostalgic-css/NES.css/): referência de bordas e componentes retrô; o mockup usa CSS próprio e não adiciona essa dependência.
- [Fitzwilliam Museum — paleta de iluminadores](https://colour-illuminated.fitzmuseum.cam.ac.uk/explore/illuminators-palette) e [Getty — Making a Medieval Manuscript](https://www.getty.edu/exhibitions/making-medieval-manuscript/): fontes de referência para pergaminho, pigmentos, ouro e ornamentação de manuscritos.
- [W3C — animação de interação](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) e [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion): base para reduzir movimento solicitado nas preferências do dispositivo.
- [W3C — contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): critério útil ao finalizar texto, etiquetas e controles.

São convenções gerais de direção de arte. O mockup não reutiliza screenshots, logotipos, personagens, assets ou layout identificável de nenhum jogo.

## Decisões de identidade visual

- As duas iluminações ficam disponíveis como temas; a cena noturna com composição alinhada foi aprovada e substituiu a imagem antiga.
- O aprendiz já estabelecido continua sendo a âncora de personagem. Aceno e escrita são novas ações desenhadas para combinar com o mesmo capuz, capa, proporção e paleta.
- A interface é uma aventura por cenas: portal, salão, estantes, ficha e mesa. Busca, filtro e ações explícitas mantêm o CRUD utilizável.

## Interface de aventura atual

A primeira versão da interface tinha aparência de painel com pequenos enfeites. Após o pedido de uma experiência mais parecida com jogo, a proposta foi ampliada para cenários em tela cheia, personagem com animação por frames e pontos de interação em cenas.

- Entrada com portão, diálogo curto e opção para pular a animação.
- Salão principal com pontos de interação para abrir o catálogo, registrar um livro e consultar autores/categorias.
- O aprendiz agora pode ser chamado para conversar, com dicas sobre os relacionamentos e os campos da atividade; ele também muda de estado durante a exploração.
- Catálogo pesquisável e filtrável, com capas ilustradas por CSS e ficha para cada livro.
- Formulário de cadastro e edição, confirmação visual de exclusão e mudança entre luz de vela e noite azulada.
- Seis sequências de oito quadros (repouso, caminhada, leitura, comemoração, aceno e escrita), com proporção consistente.
- Micro movimento de respiração e gestos espontâneos com intervalos variados tiram o aprendiz da pose estática; acenar ao entrar/conversar, ler nas estantes e escrever na mesa ligam animações ao contexto.
- Poeira, fachos e brasas discretas em pixel art criam movimento ambiental; a cena noturna colore as brasas em azul.
- A caminhada até os pontos de interesse dura cerca de 1,8s e abre o painel ao chegar. O desenho vira sem inverter a dica de conversa.
- O formulário mostra um aprendiz escrevendo ao abrir e após uma pausa na digitação. Uma capa salva recebe um brilho curto somente após a resposta bem-sucedida da API.
- A página oferece pausa manual e respeita `prefers-reduced-motion`.
- Livros, categorias e autores vêm da API. Criar, editar e excluir livros persiste no PostgreSQL; categorias e autores podem ser criados no formulário.
- A entrada é uma animação única acionada por “Abrir os portões”. O personagem fica em repouso entre as ações.
- A primeira página do servidor leva à aventura conectada. A interface de CRUD anterior continua acessível em `/acervo.html`; o mockup antigo continua em `/identidade/index.html` para comparação.

Abrir: [Aventura — luz de vela](http://localhost:8080/identidade/aventura.html?tema=acolhedora) · [Aventura — noite azul](http://localhost:8080/identidade/aventura.html?tema=noturna).

A direção, pesquisa, auditoria de consistência e histórico de correções estão em [ITERACOES-DE-DESIGN.md](ITERACOES-DE-DESIGN.md) e [AUDITORIA-VISUAL-E-PESQUISA.md](AUDITORIA-VISUAL-E-PESQUISA.md).

### Personagem, movimentos e ferramentas

- A cena do portão e o salão mantêm a direção de luz quente e luz azul dos primeiros mockups.
- As folhas de personagem estão em `src/main/resources/static/identidade/assets/`: `aprendiz-repouso.png`, `aprendiz-caminhada.png`, `aprendiz-leitura.png`, `aprendiz-celebra.png`, `aprendiz-aceno.png` e `aprendiz-escrita.png`.
- Aseprite ou [LibreSprite](https://github.com/LibreSprite/LibreSprite) são opções para editar quadros e exportar sequências. Consulte a documentação oficial do [Aseprite — animação](https://www.aseprite.org/docs/animation/), [tags](https://www.aseprite.org/docs/tags/) e [sprite sheets](https://www.aseprite.org/docs/sprite-sheet/).
- A implementação atual fica em HTML, CSS e JavaScript nativos. A [Web Animations API da MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) pode servir quando houver sequência complexa que precise de controle pelo JavaScript.
- PixiJS e Phaser foram avaliados, mas adicionariam uma engine ao CRUD escolar. Não são necessários para cenas, sprites e controles acessíveis deste projeto.

### Registro da aprovação da cena noturna

O usuário aprovou a composição noturna de câmera igual à cena de velas e autorizou substituir o arquivo noturno ativo. A cena aprovada está integrada em `biblioteca-noturna.png`; a composição antiga continua arquivada. Ver [AUDITORIA-VISUAL-E-PESQUISA.md](AUDITORIA-VISUAL-E-PESQUISA.md) para evidências, referências e histórico das correções.

### Ícones e controles

- Os ícones da aventura usam SVG inline com viewBox 16×16 e formas alinhadas à grade. A paleta combina sombra de tinta, madeira, ouro, pergaminho e pequenos acentos de cor para que cada objeto seja reconhecível em tamanho reduzido.
- Os botões devem parecer placas pequenas de madeira ou metal com relevo, borda interna e estados visíveis de repouso, foco, hover e pressionamento. Ícones decorativos não substituem rótulos de ação.
- O formato pode ser redesenhado à vontade; a continuidade vem do tema de biblioteca medieval em pixel art, da paleta e da leitura clara.
- Depois de cada revisão, testar controle por teclado e conferir foco visível. Referência consultada: [WAI/W3C — Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance).

### Ordem de entrega combinada

Concluir os ajustes visuais em curso, finalizar a atividade CRUD e o material de estudo do Senac com comentários didáticos, e só então retomar uma expansão mais livre da experiência. Até o material escolar estar pronto, o backend permanece simples e não recebe escopo de jogo.
