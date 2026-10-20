# Uso de inteligência artificial e aprendizagem

Este projeto foi desenvolvido no contexto de uma atividade do curso Jovem Programador do Senac SC, na UC4 — Back-End de Projetos Web, instruída pelo professor Marcos.

Ferramentas de inteligência artificial foram usadas como apoio ao longo do trabalho para pesquisar referências, planejar e revisar a estrutura, elaborar e comentar partes do código, organizar a documentação, criar e ajustar a direção visual e conferir a coleção de requisições. O uso da ferramenta não significa que o estudante já domina todos os trechos: o objetivo é revisar o material, entender as decisões e conseguir explicar o fluxo antes de apresentar.

Não foi localizada uma regra pública específica desta turma sobre o formato obrigatório de declaração de IA. Esta nota registra o uso de forma transparente; as orientações dadas pelo professor para a atividade devem prevalecer. Se ele pedir outro formato, esta declaração deve ser ajustada.

## Roteiro para estudar antes de apresentar

Use as perguntas como revisão e responda com suas próprias palavras. Esta lista é um roteiro de estudo, não uma declaração de que todas as respostas já foram dominadas.

1. Como o pedido percorre `Controller → Service → Repository → PostgreSQL`?
2. O que `@ManyToOne`, `@OneToOne` e `@ManyToMany` representam nas entidades deste projeto?
3. Por que o cadastro do livro recebe os ids da categoria e dos autores?
4. Quais endpoints implementam cadastrar, listar, consultar, atualizar e excluir livros?
5. Por que a API responde `409 Conflict` ao tentar remover categoria ou autor ainda relacionado?
6. Como Docker inicia o banco, e como a aplicação Spring Boot se conecta a ele?
7. O enunciado diz que cada livro tem um detalhe, mas não define os campos. Por que aqui o detalhe foi representado por `descricao`?
8. O que a coleção Postman verifica e quais dados temporários ela remove?

Consulte também o [Guia de estudo](GUIA-DE-ESTUDO.md), que aponta as classes e pastas relacionadas a cada etapa.
