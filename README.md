# Biblioteca Medieval

Aplicação de estudo para a atividade de cadastro de livros com Java, Spring Boot, JPA e PostgreSQL. O projeto contém uma API REST e uma interface em HTML, CSS e JavaScript servida pelo próprio Spring Boot.

**Escopo do curso:** o backend fica simples e cobre o enunciado — livros, categorias, autores e seus relacionamentos. O principal espaço para experimentar e destacar o projeto é o frontend; só ampliaremos a API se uma interação visual realmente precisar disso.
## Contexto acadêmico

- Curso: Jovem Programador — Senac SC;
- Unidade Curricular: UC4 — Back-End de Projetos Web;
- Professor: Marcos;
- Atividade: CRUD de livros para praticar API REST, Spring Boot, JPA e PostgreSQL.

O cadastro contempla título, preço, quantidade, categoria, detalhe e autores. A atividade exercita relações um-para-um, muitos-para-um e muitos-para-muitos. A descrição foi escolhida como representação simples do detalhe do livro, pois o enunciado não especifica outros campos para esse objeto.

## Apresentação no GitHub Pages

A página pública apresenta a atividade e oferece um mockup visual interativo com livros fictícios:

https://leftson13.github.io/biblioteca-medieval/

O GitHub Pages hospeda somente essa apresentação e a prévia visual. O CRUD conectado ao PostgreSQL deve ser iniciado localmente seguindo este README.

## Requisitos

- Java 21 ou superior compatível com a versão do Spring Boot usada no projeto;
- Docker Desktop com Docker Compose;
- Maven Wrapper incluído na pasta do projeto.

## Preparar o banco com Docker

O serviço PostgreSQL usa a imagem oficial postgres:17. O banco e o usuário são criados automaticamente quando o volume de dados é inicializado pela primeira vez. A porta do computador é 55436 porque a porta padrão 5432 já está sendo usada por outro contêiner.

Na pasta biblioteca-medieval, inicie o banco:

    docker compose up -d

Confira o estado:

    docker compose ps

O contêiner deve aparecer como healthy. O volume biblioteca-medieval-dados preserva os registros entre reinicializações.

Dados para conectar pelo pgAdmin, se desejar:

- Host: localhost
- Porta: 55436
- Banco: biblioteca_medieval
- Usuário: biblioteca
- Senha local de estudo: biblioteca

Essas credenciais são apenas para o ambiente local desta atividade.

O Hibernate cria as tabelas com base nas entidades quando a aplicação inicia. O modo spring.jpa.hibernate.ddl-auto=update é uma escolha didática para o ambiente local desta atividade.

## Iniciar

Com o banco em execução, abra um terminal na pasta biblioteca-medieval. As variáveis DB_USERNAME e DB_PASSWORD têm os mesmos valores padrão da configuração Docker. Se você decidir alterá-los, defina-as antes de iniciar tanto o Compose quanto a aplicação.

    .\mvnw.cmd spring-boot:run

Depois, abra http://localhost:8080. A página inicial apresenta a aventura em pixel art conectada à API.

Outras páginas úteis:

- `/identidade/aventura.html?tema=acolhedora` — entrada da aventura com luz de vela;
- `/identidade/aventura.html?tema=noturna` — o mesmo salão com iluminação azul noturna, aprovada para manter a composição da versão à luz de vela;
- `/acervo.html` — painel CRUD anterior, preservado como alternativa;
- `/identidade/index.html?tema=acolhedora` — mockup antigo de identidade, com dados fictícios.

Para parar o contêiner mantendo os dados:

    docker compose stop

Para iniciá-lo novamente:

    docker compose start

## Organização do código

- entity: classes que representam as tabelas e relações;
- repository: interfaces que oferecem operações JPA;
- service: regras para cadastrar e atualizar livros;
- controller: endereços HTTP da API;
- dto: formato JSON que a API recebe;
- resources/static: interface medieval em pixel art; `/` abre a aventura e `/acervo.html` mantém o painel de CRUD anterior.

O roteiro didático com as sessões de estudo está em GUIA-DE-ESTUDO.md.

## Endpoints principais

| Método | Endereço | Ação |
|---|---|---|
| GET | /api/livros | Listar todos os livros |
| GET | /api/livros/{id} | Buscar livro pelo id |
| POST | /api/livros | Cadastrar livro |
| PUT | /api/livros/{id} | Atualizar livro |
| DELETE | /api/livros/{id} | Excluir livro |
| GET | /api/categorias | Listar categorias |
| POST | /api/categorias | Cadastrar categoria |
| DELETE | /api/categorias/{id} | Excluir categoria sem livros vinculados |
| GET | /api/autores | Listar autores |
| POST | /api/autores | Cadastrar autor |
| DELETE | /api/autores/{id} | Excluir autor sem livros vinculados |

As rotas DELETE de categorias e autores respondem `204 No Content` quando a exclusão funciona, `404 Not Found` quando o id não existe e `409 Conflict` quando ainda há livros usando o cadastro. Assim, a API evita quebrar os relacionamentos.

## Testar com Postman

Importe postman/Biblioteca-Medieval.postman_collection.json no Postman e execute as requisições na ordem apresentada. A coleção cadastra uma categoria, dois autores e um livro, demonstra consulta e atualização, verifica o bloqueio de exclusão enquanto existem relacionamentos e termina removendo os dados temporários.
## Exemplo de uso no Postman

Primeiro, cadastre uma categoria:

    POST http://localhost:8080/api/categorias
    Content-Type: application/json

    {
      "nome": "Fantasia"
    }

Depois, cadastre um autor:

    POST http://localhost:8080/api/autores
    Content-Type: application/json

    {
      "nome": "Autoria de exemplo"
    }

Use os ids devolvidos nas respostas para cadastrar um livro:

    POST http://localhost:8080/api/livros
    Content-Type: application/json

    {
      "titulo": "O livro do reino",
      "preco": 39.90,
      "quantidade": 5,
      "categoriaId": 1,
      "descricao": "Uma breve descrição do volume.",
      "autoresIds": [1]
    }

Para a atualização, use o mesmo JSON em PUT /api/livros/{id}. Para exclusão, envie DELETE /api/livros/{id} sem corpo.

Depois de excluir os livros de teste, você também pode limpar as categorias e os autores que não usa mais:

    DELETE http://localhost:8080/api/categorias/1
    DELETE http://localhost:8080/api/autores/1

Troque `1` pelos ids retornados nos seus cadastros. Se algum deles ainda estiver ligado a um livro, a API responde `409 Conflict`; exclua ou atualize esse livro primeiro.

## Decisão didática sobre detalhe

O enunciado informa que cada livro possui um detalhe, mas não especifica os campos dele. Para tornar o cadastro utilizável, este projeto representa o detalhe com uma propriedade descricao. Essa propriedade é uma decisão de implementação, não um campo declarado literalmente no enunciado.
