# Orientação para entrega — Biblioteca Medieval

**Curso:** Jovem Programador — Senac SC
**Unidade Curricular:** UC4 — Back-End de Projetos Web
**Professor:** Marcos
**Atividade:** CRUD de livros com Java, Spring Boot, JPA e PostgreSQL.

## O que está nesta pasta

O pacote contém o código-fonte da API e da interface, o Maven Wrapper, o `compose.yaml` para iniciar o PostgreSQL pelo Docker, as artes e páginas visuais, o roteiro didático, a coleção Postman e as evidências de execução e de apresentação visual. A pasta `.git`, a compilação `target` e caches não fazem parte da entrega.

## Executar localmente

1. Instale Java 21 ou superior compatível com o Spring Boot do projeto e Docker Desktop.
2. Abra um terminal nesta pasta e execute `docker compose up -d`.
3. Inicie a API com `.\mvnw.cmd spring-boot:run`.
4. Acesse `http://localhost:8080`.
5. Importe `postman/Biblioteca-Medieval.postman_collection.json` no Postman Desktop (12.33.0, instalado no computador) para explorar as requisições. A coleção foi executada com Newman, e o resultado está registrado em evidencias. Para reproduzir a execução registrada sem interface gráfica, consulte `evidencias/RESULTADO-EXECUCAO-API.md`.

O GitHub Pages publica uma apresentação estática. O CRUD e a conexão com PostgreSQL são executados localmente.

## Links públicos

- Repositório: https://github.com/LeftSon13/biblioteca-medieval
- Apresentação: https://leftson13.github.io/biblioteca-medieval/
- Mockup acolhedor: https://leftson13.github.io/biblioteca-medieval/identidade/index.html?tema=acolhedora
- Mockup noturno: https://leftson13.github.io/biblioteca-medieval/identidade/index.html?tema=noturna

## Estudo e transparência

Leia `GUIA-DE-ESTUDO.md` e `USO-DE-IA-E-APRENDIZAGEM.md` antes de apresentar. A segunda nota explica como a IA foi usada e sugere perguntas para revisar o código com compreensão.
