# Guia de estudo — Biblioteca Medieval

O projeto está organizado em sessões. Leia uma sessão por vez e tente explicar a ideia com suas palavras antes de seguir para a próxima.
## Contexto da atividade

Este material acompanha uma atividade do curso Jovem Programador do Senac SC, na UC4 — Back-End de Projetos Web, instruída pelo professor Marcos. O objetivo é praticar o CRUD de livros com Java, Spring Boot, JPA e PostgreSQL usando Docker para iniciar o banco.

Os exemplos e comentários são um roteiro para estudar as partes do projeto. Antes de apresentar, tente explicar o que cada entidade representa, como os relacionamentos funcionam e qual operação HTTP é usada em cada etapa do CRUD.

## Sessão 1 — Preparar a aplicação

**Ideia:** o Docker inicia o PostgreSQL; o Spring Boot inicia a API e encontra automaticamente os componentes do projeto.

**Onde olhar:**

- BibliotecaMedievalApplication.java;
- compose.yaml;
- pom.xml;
- src/main/resources/application.properties.

**Perguntas para revisar:**

1. Qual serviço e volume são definidos no compose.yaml?
2. Qual método inicia o programa Java?
3. Qual parte do application.properties informa onde está o PostgreSQL?

## Sessão 2 — Representar os dados

**Ideia:** uma entidade é uma classe que o JPA relaciona com uma tabela.

**Onde olhar:**

- entity/Livro.java;
- entity/Categoria.java;
- entity/DetalheLivro.java;
- entity/Autor.java.

**Relações do enunciado:**

- @ManyToOne: vários livros podem usar uma categoria;
- @OneToOne: um livro tem um detalhe;
- @ManyToMany: livros podem ter vários autores e autores podem escrever vários livros.

**Perguntas para revisar:**

1. Por que cada entidade tem um id?
2. Qual tabela guarda a associação entre livro e autor?
3. O que acontece com o detalhe quando o livro é excluído?

## Sessão 3 — Acessar os dados

**Ideia:** o repositório é a ponte entre o código Java e as tabelas. Ao estender JpaRepository, ele recebe operações comuns sem precisar escrevê-las uma a uma.

**Onde olhar:**

- repository/LivroRepository.java;
- repository/CategoriaRepository.java;
- repository/AutorRepository.java;
- dto/LivroRequest.java.

**Perguntas para revisar:**

1. Qual tipo de entidade o LivroRepository manipula?
2. Por que o pedido de livro recebe ids de categoria e autores?
3. O que o cliente envia dentro de autoresIds?

## Sessão 4 — Aplicar as regras do cadastro

**Ideia:** o serviço valida os dados, localiza os relacionamentos e pede ao repositório para salvar.

**Onde olhar:**

- service/LivroService.java.

**Perguntas para revisar:**

1. Por que a categoria é buscada antes de salvar o livro?
2. Como o serviço responde quando um id de autor não existe?
3. Qual é a diferença entre cadastrar e atualizar?

## Sessão 5 — Receber pedidos HTTP

**Ideia:** o controller liga métodos HTTP a métodos Java. A URL e o verbo informam a operação solicitada pelo cliente.

**Onde olhar:**

- controller/LivroController.java;
- controller/CategoriaController.java;
- controller/AutorController.java.

**Desafio de leitura:** encontre no código qual anotação representa cada operação:

- listar livros;
- buscar um livro;
- cadastrar livro;
- atualizar livro;
- excluir livro.

As categorias e os autores também podem ser excluídos pelos seus controllers, desde que não estejam sendo usados por livros. Nesse caso, a API responde `409 Conflict` para proteger o relacionamento.

## Sessão 6 — Entender a interface

**Ideia:** o navegador mostra os formulários e chama a API com fetch.

**Onde olhar:**

- resources/static/identidade/aventura.html: estrutura das cenas, painéis e formulários;
- resources/static/identidade/aventura.css: cenários, componentes, ícones e animações por frames;
- resources/static/identidade/aventura.js: busca, desenho das listas e chamadas HTTP;
- resources/static/acervo.html, style.css e app.js: painel CRUD anterior, mantido como alternativa.

**Perguntas para revisar:**

1. Qual função busca livros, categorias e autores quando a aventura é aberta?
2. Qual verbo HTTP é usado para salvar um livro novo? E para atualizar?
3. Como a tela envia os ids de autores para o Java?

A tela inicial do servidor redireciona para a aventura conectada à API. O mockup de `/identidade/index.html` continua apenas como referência visual com livros fictícios.

## Sessão 7 — Praticar com Postman

Siga a ordem para criar os relacionamentos:

1. POST /api/categorias com {"nome":"Fantasia"};
2. POST /api/autores com {"nome":"Autoria de exemplo"};
3. use os ids retornados no POST /api/livros;
4. confira o livro em GET /api/livros;
5. atualize o livro com PUT /api/livros/{id};
6. exclua-o com DELETE /api/livros/{id};
7. exclua a categoria e os autores sem uso com DELETE /api/categorias/{id} e DELETE /api/autores/{id}.

**JSON de livro:**

    {
      "titulo": "O livro do reino",
      "preco": 39.90,
      "quantidade": 5,
      "categoriaId": 1,
      "descricao": "Uma breve descrição do volume.",
      "autoresIds": [1]
    }

Os valores 1 são exemplos. Use os ids devolvidos pela sua própria API.

## Sessão 8 — Explique o fluxo completo

Tente narrar este caminho sem olhar primeiro para as classes:

    Postman ou navegador → Controller → Service → Repository → PostgreSQL

Na volta, o resultado percorre o caminho de retorno e é convertido para JSON.
