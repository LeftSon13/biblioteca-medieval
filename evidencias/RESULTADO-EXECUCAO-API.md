# Resultado da execução da API

**Data:** 20/10/2026
**API:** `http://localhost:8080`
**Coleção:** `postman/Biblioteca-Medieval.postman_collection.json`
**Executor desta evidência:** Newman, compatível com coleções Postman. O Postman Desktop 12.33.0 está instalado no computador para exploração manual; esta execução registrada foi feita no terminal, não na interface gráfica.

## Resultado observado

- 16 requisições executadas;
- 16 scripts de teste e 16 asserções aprovadas;
- 0 falhas;
- duração registrada: aproximadamente 1,5 segundo;
- respostas exercitadas: `201 Created`, `200 OK`, `409 Conflict`, `204 No Content` e `404 Not Found`.

O fluxo criou uma categoria, dois autores e um livro relacionado a eles; listou, consultou e atualizou o livro; verificou que categoria e autores vinculados não podem ser excluídos; e removeu os dados temporários ao final.

## Como repetir

1. Inicie o PostgreSQL com `docker compose up -d`.
2. Inicie a aplicação com `.\mvnw.cmd spring-boot:run`.
3. Em outro terminal, execute:

       npx --yes newman run postman/Biblioteca-Medieval.postman_collection.json --reporters cli

O arquivo [execucao-newman.txt](execucao-newman.txt) contém a saída completa registrada desta execução. Esta evidência é de execução pelo Newman, não uma captura da interface gráfica do Postman.
