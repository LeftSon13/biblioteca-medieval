# Auditoria visual e pesquisa de referências

**Data:** 20/10/2026
**Escopo:** identidade pixel art, cenários, personagem, ícones, movimento e apresentação do CRUD.

**Estado desta revisão:** o usuário aprovou substituir a arte noturna pela composição de câmera igual à cena acolhedora. A troca foi aplicada; o arquivo anterior foi preservado em `design/previews/biblioteca-noturna-composicao-anterior.png`.

## Direção do projeto

O produto é um CRUD escolar de livros, categorias e autores apresentado como uma pequena aventura point-and-click dentro de uma biblioteca de castelo. A ambientação deve tornar cada ação do cadastro compreensível: estantes abrem o acervo, a mesa abre o formulário, a capa abre a ficha. O tema é a apresentação do sistema; não exige criar regras de jogo ou entidades de backend que não estejam no enunciado.

**Decisão de escopo:** como esta é uma atividade do curso Jovem Programador do Senac, manter o backend didático e limitado ao que o professor pediu. Priorizar no frontend a exploração visual, animações e feedback; acrescentar endpoint ou regra só se uma interação necessária não puder usar a API atual.

## Referências pesquisadas

| Referência | O que foi observado | Como aplicar aqui |
|---|---|---|
| [Eastward — galeria oficial](https://eastwardgame.com/media/) | Pixel art detalhada ganha profundidade com iluminação 3D, variação de luz e cenas cheias de objetos. | Manter o cenário como peça principal, usar luz e poeira de forma discreta e reservar contraste para botões, rótulos e personagem. Não cobrir o cenário com elementos que não ajudem na navegação. |
| [Book of Hours — site oficial](https://weatherfactory.biz/book-of-hours/) | A biblioteca é o centro da atividade: adquirir, restaurar, catalogar e organizar livros; visitantes também dão contexto ao espaço. | Tratar as capas e fichas como objetos de exploração; mostrar busca, categoria, autores e detalhe sem esconder o CRUD. Um personagem-guia pode ensinar as relações da atividade, sem inventar novos campos ou regras. |
| [Book of Hours — artigo de desenvolvimento](https://weatherfactory.biz/book-of-hours-where-knowledge-goes/) | Os livros são descritos pelos desenvolvedores como elementos aos quais o jogador retorna, em vez de itens consumidos uma vez. | A ficha deve parecer uma leitura retomável: abrir, editar e fechar preservando contexto e foco. A ficha já usa uma composição de livro aberto. |
| [Moonlighter — página oficial do estúdio](https://digitalsungames.com/games/moonlighter/) | O espaço cotidiano do comércio faz parte de um jogo de aventura; a apresentação alterna rotina e exploração. | Nosso loop menor é salão → estantes ou mesa → ficha → salão. A navegação deve ter retorno claro e os movimentos do aprendiz devem ocorrer como resposta a essa escolha. |

Essas observações são referências de alto nível. Não reutilizamos personagens, logos, capturas, cenários ou interface dos jogos.

## Auditoria das artes e do movimento

| Área | Evidência no projeto | Resultado e decisão |
|---|---|---|
| Salão acolhedor | `biblioteca-acolhedora.png` | Referência de luz quente aprovada anteriormente. A composição tem estantes, mesa e velas que sustentam os dois principais pontos de interação. Preservar como âncora visual. |
| Salão noturno anterior | `design/previews/biblioteca-noturna-composicao-anterior.png` | A imagem antiga usava câmera e objetos diferentes. Foi arquivada para manter o histórico visual. |
| Salão noturno atual | `biblioteca-noturna.png` | O usuário aprovou a composição do salão acolhedor iluminada em azul. Ela agora compartilha câmera e posições com a cena de vela, facilitando a comparação dos climas. |
| Aprendiz | Seis folhas de oito quadros: repouso, caminhada, leitura, comemoração, aceno e escrita. | Os novos gestos mantêm o capuz, a capa e as cores do aprendiz existente. A animação percorre os sete intervalos entre oito quadros, sem mostrar bordas de dois sprites ao mesmo tempo. A hitbox foi separada do desenho para virar sem espelhar a dica. |
| Entrada | A folha de caminhada estava em loop desde o carregamento. | Agora ela só anima quando “Abrir os portões” é acionado. O personagem fica em repouso até a ação. |
| Ícones | A aventura usa uma folha SVG interna com brasão, estante, pena, livros, busca, lua, sol e ações. | Usar essa linguagem nas novas ações. Evitar misturar glifos Unicode diferentes como ícones principais. Texto continua identificando a função de cada controle. |
| Movimento ambiental | Poeira, fachos e cinco partículas de brasa criam profundidade sem cobrir controles. | As partículas ficam lentas e discretas; no tema noturno brilham em azul. A pausa manual e `prefers-reduced-motion` continuam valendo. |
| Personagem parecia estático | O ciclo antigo esperava de 14,5 a 25,5 segundos e a caminhada de 0,86s terminava antes de o painel abrir. | Agora o corpo tem micro movimento lento, gestos variáveis a cada 6,5–13,5 segundos, aceno ao entrar/conversar, leitura perto das estantes e escrita junto à mesa. A caminhada e a abertura do painel usam cerca de 1,9s. |
| Cenário versus informação | Acervo, ficha e cadastro usam painéis sobre a cena; capa, título e detalhe vêm da API. | Manter os controles legíveis e funcionais acima da ilustração. O inventário não pode depender de clicar numa coordenada da imagem. |

## Ajustes feitos nesta revisão

- A aventura passa a ser a tela inicial do site em `http://localhost:8080/`.
- A interface CRUD anterior fica preservada em `/acervo.html`.
- A aventura carrega livros, categorias e autores da API e envia cadastros, edição e exclusão ao backend.
- O cabeçalho do salão mostra quantos livros e categorias existem no banco.
- A caminhada até estantes/mesa termina antes da abertura do painel.
- A troca de iluminação acontece no próprio cenário e mantém a cena, o formulário e os dados digitados.
- A pausa congela os movimentos e também suspende a abertura pendente do painel; ao retomar, a sequência continua do ponto em que parou.
- Erros de salvar/cadastrar e de excluir aparecem dentro do diálogo que está aberto, em vez de atrás dele.
- A entrada do personagem é uma ação única acionada pelo usuário, em vez de repetir sem parar.
- Erros recebem estilo de alerta e não acionam a comemoração do personagem.
- Os rótulos de autoria deixaram de depender de um glifo Unicode como ícone.
- Focar uma capa pelo teclado usa o mesmo realce de seleção e foco perceptível que o mouse.
- Ao abrir o cadastro, o escriba faz um gesto de escrita; após uma pausa enquanto os campos são preenchidos, repete a animação uma vez.
- Ao salvar com sucesso, a capa correspondente recebe um brilho breve. O feedback só acontece depois da resposta da API.
- O aprendiz tem hitbox e sprite separados; a dica muda com o lugar e não é espelhada ao caminhar para as estantes.
- A cena noturna aprovada substituiu a arte anterior; a versão anterior ficou arquivada em `design/previews/`.
- O salão usa um único agendador de ações aleatórias, sem alterar falas enquanto a pessoa lê ou usa um formulário.
- A revisão de sprite sheets mostrou que `steps(8)` divide o deslocamento de sete larguras em oito saltos; o resultado mistura quadros adjacentes. As sequências com oito imagens agora usam `steps(7)` para avançar uma célula por salto. A folha de escrita também foi substituída por uma versão com margem transparente entre poses.

## Pesquisa de ferramentas e decisão técnica

- [MDN — Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API) e [Element.animate()](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate): permitem controlar animações no JavaScript, incluindo pausá-las e retomá-las. É uma opção futura para sequências que precisem ser controladas quadro a quadro; esta versão usa CSS `steps()` e o agendador pequeno que já existe.
- [MDN — `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/%40prefers-reduced-motion): respeitado para desligar animações ambientais e simplificar as transições.
- [Aseprite — animação](https://www.aseprite.org/docs/animation/), [tags](https://www.aseprite.org/docs/tags/) e [exportar folhas](https://www.aseprite.org/docs/sprite-sheet/): fluxo indicado para editar quadros, nomear estados e exportar sprite sheets. [LibreSprite](https://github.com/LibreSprite/LibreSprite) é uma alternativa livre.
- [PixiJS](https://pixijs.com/8.x/guides/concepts/architecture) e [Phaser](https://docs.phaser.io/): oferecem renderização Canvas/WebGL e estrutura de jogo. Não foram adicionados: para este CRUD escolar, HTML acessível, CSS e JavaScript já entregam as cenas e sprites sem transformar o exercício em um projeto de engine.

**Conclusão da pesquisa:** continuar com HTML/CSS/JS e sprite sheets de oito quadros. Usar Aseprite ou LibreSprite para evoluir as artes; recorrer à Web Animations API quando uma sequência precisar de controle fino. PixiJS e Phaser ficam fora do escopo atual.

## Próximas ideias, por prioridade

### Próxima etapa recomendada

1. O usuário já aprovou e a cena noturna alinhada à composição quente está no caminho ativo.
2. A auditoria desta versão percorreu o salão, as estantes e o formulário em desktop; também conferiu o salão e o formulário em 390×844. O modal mantém rolagem vertical, e a página móvel não tem rolagem horizontal.
3. Como revisão futura, conferir preferência pessoal sobre o ritmo dos gestos e a intensidade das partículas; ajustar hotspots somente se o uso real mostrar desalinhamento.

### Melhorias futuras dentro do escopo

- **Estante reativa aos registros:** acrescentar lombadas decorativas geradas pelos livros reais do banco, com no máximo algumas capas visíveis e um contador do acervo. A ação visual deve acompanhar o sucesso da API, nunca antecipá-lo.
- **Descoberta com propósito:** a conversa do aprendiz já alterna dicas da atividade por interação, sem trocar o texto automaticamente enquanto a pessoa lê ou preenche o formulário.
- **Retorno visual por ação:** o livro salvo já ganha destaque curto na lista; ficha e formulário devolvem foco a um ponto de continuação; erros aparecem no diálogo ativo.
- **Detalhe visual de capa:** gerar ornamentação simples a partir da categoria/ID do registro, sempre mantendo o título escrito e legível. Não inventar raridade ou classificação que o banco não possui.
- **Som opcional:** considerar pequenos efeitos de página/porta depois que a interface estiver validada; iniciar silenciado e ter controle explícito, para não bloquear nem surpreender a pessoa.

Estas ideias são recomendações, não trabalho obrigatório desta versão. Evitar minijogos, pontuação, missões, inventário ou novos relacionamentos no backend: eles não ajudam a demonstrar o CRUD solicitado.

## Lista curta para futuras auditorias

- A cena, o aprendiz e as capas parecem pertencer ao mesmo mundo e usam a mesma paleta?
- Há algum sprite ou efeito repetindo indefinidamente sem informar algo?
- Cada elemento clicável tem rótulo visível, nome acessível e funcionamento por teclado?
- O usuário sabe em que cena está e como voltar?
- Os dados e feedback visual confirmam o resultado real do backend?
- A lista vazia, carregamento e erro são visualmente claros?
- A página continua utilizável em largura móvel e com movimento reduzido?
- A nova arte preserva a composição aprovada ou está identificada como proposta para revisão?

## Roteiro de fechamento do projeto

Este roteiro foi combinado com o usuário para evitar que a expansão visual atrase a entrega da atividade:

1. **Ajustes visuais atuais:** corrigir a escala do aprendiz e finalizar uma família mais contrastante de ícones e botões, mantendo a biblioteca medieval em pixel art.
2. **Entrega escolar:** revisar a atividade como material de estudo para o Senac, com backend CRUD simples em Spring Boot, JPA e PostgreSQL, nomes em português e comentários didáticos. Explicar o fluxo para que o estudante consiga apresentar o que implementou.
3. **Depois da entrega:** retomar o projeto como experiência interativa com liberdade para ampliar a interface e, se fizer sentido para o novo escopo, reavaliar tecnologias de jogo. PixiJS e Phaser continuam adiados até existir essa necessidade.

Até concluir a etapa escolar, o backend continua limitado ao enunciado. A interface pode receber melhorias visuais dentro do tema, mas não deve inventar regras ou dados de jogo que exijam ampliar a API.

## Auditoria dos sprites e controles — outubro de 2026

**Aprendiz achatado:** o arquivo de repouso mede 2172×724 e contém oito quadros de 271,5×724, proporção de 3:8. `.personagem-entrada` também usa 3:8 em seu tamanho original (96×256), mas o breakpoint largo aplicava a regra genérica `.sprite-personagem { width: 142px; height: 204px; }` ao mesmo elemento, distorcendo a folha para aproximadamente 0,70:1. O tamanho genérico foi removido do breakpoint; a entrada agora declara `aspect-ratio: 3 / 8` e os demais personagens mantêm dimensões próprias.

**Ícones e botões:** os símbolos inline continuam sendo ícones vetoriais em grade de 16×16, agora com planos de sombra, madeira, ouro e pergaminho para aumentar a leitura em fundos escuros. Foi incluído um símbolo pixelado de fechar e os três controles de fechamento da ficha/formulário/índice deixaram de depender do caractere de fonte `×`. Botões principais, HUD, atalhos e hotspots ganharam moldura interna, contraste de estado, relevo de pressionamento e alvo mínimo mais confortável; `:focus-visible` segue explícito para teclado.

**Pesquisa aplicada:** a documentação da [MDN sobre `shape-rendering`](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/shape-rendering) registra `crispEdges` como opção de renderização de formas SVG; a [WAI/W3C sobre aparência do foco](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance) orienta que o indicador seja identificável e tenha contraste. O [guia do Aseprite para sprite sheets](https://www.aseprite.org/docs/sprite-sheet/) mantém a opção de revisar e exportar os quadros manualmente quando a direção de arte voltar a evoluir.

**Critério visual:** os ícones podem ser redesenhados livremente, desde que permaneçam claros, chamativos e coerentes com madeira, pergaminho, metal e luz de vela/noite azul. O desenho não precisa preservar os caminhos antigos; manter o tema e a legibilidade é mais importante que manter a forma anterior.
