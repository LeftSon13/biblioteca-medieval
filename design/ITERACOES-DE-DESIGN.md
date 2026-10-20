# Diário de iteração visual — Biblioteca Medieval

Este registro separa o pedido do usuário, as decisões de design e o que o protótipo realmente faz. Serve para não repetir caminhos rejeitados e para comparar as próximas versões.

## Iteração 1 — painel de catálogo

**O que havia:** duas composições de catálogo, com variação de luz de vela e noite azulada, ficha, filtros e formulário de demonstração.

**Retorno do usuário:** a página deveria parecer mais um jogo, com animações, frames e movimento; a pixel art deveria ser mais marcante do que ícones decorativos.

**Aprendizado:** mudar cores e molduras não resolve a sensação de jogo. O cenário e a ação precisam conduzir a pessoa de uma cena a outra. Os primeiros mockups foram preservados como referência, sem tratá-los como direção final.

## Iteração 2 — cenas de aventura point-and-click

**Decisão de design:** usar a jornada pelo castelo como camada de apresentação do catálogo: portão → salão → estantes → ficha do livro. A experiência não exige descobrir uma coordenada escondida para operar; cada hotspot também tem um botão nomeado ou uma ação visível.

**Implementado nesta proposta:**

- cenário próprio de entrada e salão, com variantes quente e noturna;
- aprendiz em uma sprite sheet de quatro quadros, animada com `steps()`;
- entrada animada e alternativa “Entrar direto”;
- botões acessíveis por teclado, busca por título/autor, filtro de categoria, ficha, cadastro, edição e confirmação de exclusão;
- estado de movimento reduzido respeitado pela CSS;
- dados de exemplo alteráveis somente na memória da página, sem persistência no PostgreSQL.

**Limite assumido:** a animação de entrada é uma transição visual curta, não uma simulação física de portas. Os registros são fictícios e a interface não faz requisições para o backend.

## Iteração 3 — personagem com estados e feedback

**Novo pedido:** adicionar muito mais sprites do personagem, ampliar os quadros para que as animações pareçam menos repetitivas e tornar a exploração mais divertida.

**Decisão de design:** em vez de repetir a mesma caminhada em todas as situações, usar sequências próprias por estado e reproduzir cada uma quando a pessoa faz algo.

- Caminhada com oito quadros na entrada e quando o aprendiz vai às estantes ou à mesa.
- Repouso com oito quadros, piscadas e pequenas mudanças de postura no salão.
- Leitura de oito quadros ao conversar com o aprendiz, visitar estantes ou abrir a ficha de um livro.
- Comemoração de oito quadros para o retorno de cadastro, edição ou exclusão na prévia.
- Os quatro estados somam 32 quadros. O personagem mantém o mesmo enquadramento entre estados para não mudar de tamanho ao trocar de ação.
- Pequenos momentos de leitura espontânea variam enquanto o salão está aberto; a preferência por movimento reduzido desativa esses momentos.
- O botão “Pausar” interrompe movimentos visuais para quem prefere decidir isso sem mudar as configurações do dispositivo.

**Auditoria e correções:** a revisão estática independente localizou atalhos atuando sob diálogos modais, dupla codificação de caracteres especiais em capas e foco que podia se perder quando a lista era redesenhada. O código passou a ignorar atalhos durante diálogos, escapar os títulos uma vez e devolver o foco a um resultado ou à busca após atualizar a lista.

**Próxima observação visual:** verificar enquadramentos curtos e retrato no navegador aberto. O navegador automatizado compartilhado estava ocupado durante esta iteração, então a responsividade extrema ainda não foi confirmada por captura real.

## Iteração 4 — salão mais vivo e interações com reação

**Novo pedido:** ampliar a sensação de movimento para o conjunto da interface, não só para a caminhada do personagem.

**Ajustes nesta versão:**

- poeira pixelada atravessa o portão e o salão em ritmos diferentes;
- fachos de luz respiram lentamente, enquanto o marcador e os dois pontos de interação pulsam fora de fase;
- o aprendiz agora caminha até a estante ou a mesa antes de abrir o painel correspondente;
- o retrato nas caixas de diálogo usa o rosto do sprite, em vez de um símbolo decorativo;
- repouso, caminhada, leitura e comemoração usam o mesmo tamanho de quadro no salão;
- as animações de ação terminam por evento do sprite. Os temporizadores de navegação e de animação têm responsabilidades separadas, e pausar durante a abertura do portão conclui a entrada em vez de deixar a cena travada.

**Direção aplicada:** preservar o movimento em degraus no personagem e usar transições suaves só em luz, poeira e realce dos pontos clicáveis. A pausa continua congelando as animações; o sistema operacional ainda pode pedir movimento reduzido.

**Validação desta iteração:** revisar sintaxe dos arquivos, empacotamento de recursos e respostas HTTP das duas variantes. A inspeção visual interativa pelo navegador compartilhado segue pendente porque essa sessão já estava em uso; isso não foi tratado como confirmação do enquadramento em celular.

## Iteração 5 — auditoria de consistência e pesquisa aplicada

**Pedido:** pesquisar referências do nicho e auditar a qualidade visual para sugerir novos cenários mais interativos, preservando a identidade já estabelecida.

**Pesquisa e aplicação:**

- Eastward mostrou como luz ambiental pode aprofundar cenários pixelados; aplicamos isso mantendo poeira e fachos discretos, e evitando sobrepor mais molduras ao cenário.
- Book of Hours coloca a biblioteca e a catalogação no centro da atividade; aplicamos a ideia à ficha que abre como livro e ao uso de categorias/autores reais do banco.
- Moonlighter combina uma atividade cotidiana com exploração; adaptamos a escala ao trabalho escolar: salão → estantes/mesa → painel, com retorno claro.
- A auditoria confirmou que a cena noturna atual tem composição diferente da acolhedora. Um estudo de luz azul com enquadramento correspondente foi guardado em `design/previews/` para aprovação visual; ainda não substitui o arquivo do site.
- O sprite-sheet atual do aprendiz mantém o design já estabelecido. Não se usa o desenho novo que o usuário apontou como diferente.
- A entrada deixa o personagem parado até o clique; erros da API não acionam comemoração e aparecem no diálogo ativo.
- A pausa congela a animação, a transição espacial e o tempo restante antes de abrir o painel; ao retomar, a sequência continua.
- A mudança de tema troca os fundos sem recarregar a página nem perder o estado do salão ou do formulário.
- `/` abre a interface conectada à API e `/acervo.html` preserva o painel de CRUD anterior.

**Ideias avaliadas:** lombadas de livros reais reagindo ao cadastro, conversas contextuais do aprendiz e um destaque curto para o livro salvo. Pontuação, missões e minijogos ficaram fora porque desviariam do CRUD e exigiriam regras sem relação com a atividade.

**Registro detalhado:** [AUDITORIA-VISUAL-E-PESQUISA.md](AUDITORIA-VISUAL-E-PESQUISA.md).

**Limite da revisão:** a automação de navegador local não está disponível nesta sessão; foi possível auditar arquivos e artes diretamente, mas não certificar enquadramento por captura real de desktop/celular.

## Iteração 6 — personagem presente e cenário noturno aprovado

**Pedido:** aceitar a substituição da cena noturna e fazer uma repaginação mais forte, com personagem menos estático, sprites de melhor qualidade e interações mais vivas. O backend continua dedicado à atividade do Senac.

**Causa observada no código:** o personagem podia esperar de 14,5 a 25,5 segundos entre gestos; a caminhada durava 0,86s, mas a abertura do painel estava marcada para 0,9s. Além disso, inverter a caminhada aplicava `scaleX(-1)` ao botão inteiro e espelhava a dica de conversa. A auditoria do sprite mostrou ainda que `steps(8)` dividia sete larguras em oito saltos, exibindo bordas de quadros adjacentes.

**Ajustes aplicados:**

- O usuário aprovou a cena noturna de mesma composição da cena de velas. Ela foi colocada no caminho ativo `biblioteca-noturna.png`; a arte antiga ficou arquivada em `design/previews/biblioteca-noturna-composicao-anterior.png`.
- O aprendiz mantém a aparência estabelecida. Duas folhas novas de oito quadros acrescentam aceno e escrita; agora existem seis sequências: repouso, caminhada, leitura, comemoração, aceno e escrita.
- A hitbox e o sprite são elementos separados. A arte pode virar para caminhar às estantes sem inverter a dica de interação.
- As folhas de oito quadros agora avançam em sete intervalos (`steps(7)`), evitando a mistura das bordas dos quadros. A folha do escriba foi refeita com separação transparente entre poses.
- Uma respiração discreta mantém o corpo vivo; gestos espontâneos variam a cada 6,5–13,5 segundos, sem trocar a fala enquanto a pessoa lê.
- Ao chegar à mesa o formulário apresenta o escriba; uma pausa curta após a digitação pode iniciar outra sequência de escrita.
- A caminhada de 1,8s e a abertura do painel de 1,9s ficam sincronizadas. Ao salvar, a capa do registro recebe um brilho curto depois da confirmação da API.
- Brasas sobem pelo salão e mudam de âmbar para azul no tema noturno; pausa e `prefers-reduced-motion` permanecem respeitados.
- O backend e as entidades não mudaram. Não foi adicionada engine ou dependência de animação.

**Pesquisa aplicada:** a [Web Animations API da MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) é uma opção para futuras sequências controladas por JavaScript. Para agora, CSS com `steps()` e sprites mantém a experiência simples. [Aseprite](https://www.aseprite.org/docs/sprite-sheet/) ou [LibreSprite](https://github.com/LibreSprite/LibreSprite) são opções para editar e exportar quadros. [PixiJS](https://pixijs.com/8.x/guides/concepts/architecture) e [Phaser](https://docs.phaser.io/) foram considerados excessivos para este CRUD.

**Auditoria visual no navegador:** a primeira captura do formulário mostrou que uma regra geral de sprite ampliava o escriba e o sobrepunha ao campo de título; uma regra específica corrigiu escala e posição. A captura seguinte revelou o salto entre quadros, então a cadência foi corrigida e a folha de escrita refeita. A versão final foi conferida no salão e no formulário em desktop, e no salão/formulário com viewport 390×844. O formulário rolável não causa rolagem horizontal; a animação ao digitar foi acionada com um rascunho temporário que não foi salvo.

**Validação:** `node --check` passou para os scripts de identidade; `mvnw -q -DskipTests package` concluiu; sete rotas e artes devolveram HTTP 200; a API continuou vazia (`GET /api/livros` retornou `[]`); o navegador não registrou erros de console. Não foi feito POST de livro e o backend permaneceu inalterado.

**Próxima verificação:** após o usuário explorar o resultado, ajustar intensidade das partículas ou frequência dos gestos conforme a preferência visual; conferir manualmente a preferência de movimento reduzido, caso necessário.

## Critérios para a próxima revisão

1. Revisar a cena de vela e a cena noturna aprovada no navegador, conferindo intensidade dos efeitos e legibilidade.
2. Fazer percurso manual no navegador em desktop e celular, conferindo portão, estantes, mesa, ficha, formulário e retornos.
3. Ajustar hotspots com base na captura real e verificar movimento reduzido.
4. Considerar lombadas dinâmicas somente depois de observar a interface conectada com registros reais.

## Referências pesquisadas

As referências orientam princípios de interação, animação e acabamento; nenhuma arte de jogo foi copiada.

- [Eastward — galeria oficial](https://eastwardgame.com/media/): observar cenas pixeladas detalhadas e iluminação ambiental.
- [Moonlighter — página oficial da Digital Sun](https://digitalsungames.com/games/moonlighter/): referência de um espaço cotidiano com atmosfera de aventura; aplicada aqui apenas como inspiração para alternar entre rotina do salão e exploração do acervo.
- [Book of Hours — página oficial da Weather Factory](https://weatherfactory.biz/book-of-hours/): referência de restaurar, organizar e catalogar livros numa biblioteca.
- [Book of Hours — artigo de desenvolvimento](https://weatherfactory.biz/book-of-hours-where-knowledge-goes/): descreve a intenção de tornar os livros elementos consultáveis e retomáveis.
- [Aseprite — tags de animação](https://www.aseprite.org/docs/tags/): organizar ações em sequências nomeadas e usar ciclos próprios para repouso, caminhada, leitura e comemoração.
- [The Darkside Detective — press kit do estúdio/publicador](https://www.akuparagames.com/game/the-darkside-detective/?presskit=1): referência de exploração por locais clicáveis.
- [Thimbleweed Park — decisão sobre legibilidade da interface](https://blog.thimbleweedpark.com/ui_changes.html): texto nítido pode conviver com cenário pixel art.
- [MDN — implementação de sprites CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Images/Implementing_image_sprites) e [MDN — timing `steps()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timing-function): troca discreta de quadros.
- [MDN — aparência nítida de pixel art](https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look) e [MDN — `image-rendering`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/image-rendering): renderização sem suavização.
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion), [W3C — animação disparada por interação](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions) e [W3C — foco visível](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html): movimento opcional e navegação por teclado.
- [Nielsen Norman Group — listagens](https://www.nngroup.com/articles/ecommerce-homepages-listing-pages/): manter informações e filtros disponíveis durante a exploração.

**Aplicação ao projeto:** a recomendação de cenas de aventura com acesso direto ao catálogo é uma decisão nossa para conciliar a ideia visual com os requisitos didáticos da atividade. As páginas citadas não determinam o enunciado nem os campos do CRUD.

## Ajuste de proporção e repaginação dos controles — 20/10/2026

**Feedback visual:** na cena do portão o aprendiz parecia achatado; os ícones estavam com pouco contraste e alguns botões pareciam genéricos. O usuário autorizou manter ou redesenhar os ícones, desde que a linguagem siga a biblioteca medieval em pixel art e fique mais bonita e chamativa.

**Causa encontrada:** o breakpoint de largura mínima de 1500 px aumentava todo elemento `.sprite-personagem` para 142×204. A folha tem quadro de 271,5×724 (3:8), então esse tamanho largo achatava o aprendiz da entrada e também podia distorcer a ficha. A regra genérica saiu do breakpoint; a entrada preserva `aspect-ratio: 3 / 8`, enquanto a escala da cena principal continua definida pelo controle `.personagem-sala`.

**Mudanças visuais:** a família de símbolos SVG 16×16 foi redesenhada com vários tons de contorno, ouro, papel e cor local para cada objeto. Um ícone de fechar passou a ser usado nas fichas, formulário e índice. Os botões de ação, HUD, atalhos, fechamento e hotspots receberam bordas internas, contraste mais claro entre repouso/hover/pressionado e dimensões compactas melhores para toque. O foco de teclado continua visível.

**Pesquisa consultada:** [MDN — `shape-rendering`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering), [WAI/W3C — Focus Appearance](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance) e [Aseprite — Sprite Sheets](https://www.aseprite.org/docs/sprite-sheet/). A decisão é continuar com SVG inline, CSS e JavaScript nativos: preserva a nitidez e cabe no nível didático da fase atual.

**Sequência de trabalho registrada:** (1) terminar estes ajustes visuais; (2) fechar a atividade e o guia de estudo para entrega do Senac, mantendo o backend simples; (3) voltar depois da entrega para ampliar a interface sem ficar presa ao escopo escolar. A expansão tecnológica do frontend fica para essa terceira etapa.

**Validação desta iteração:** `mvnw -q -DskipTests package` concluiu. A página de aventura e o CSS responderam HTTP 200; `GET /api/livros` continuou retornando `[]`; o PostgreSQL do Docker estava saudável. A captura do navegador em tela larga confirmou a proporção do aprendiz na entrada e a nova família de controles no salão em luz de vela e noite azul; o formulário foi aberto sem salvar dados. A console do navegador não mostrou avisos nem erros. A captura em largura móvel fica registrada como pendência de auditoria, pois o navegador compartilhado não aplicou o atalho de zoom usado nesta revisão.
