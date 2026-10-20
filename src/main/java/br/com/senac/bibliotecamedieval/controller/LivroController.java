package br.com.senac.bibliotecamedieval.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.senac.bibliotecamedieval.dto.LivroRequest;
import br.com.senac.bibliotecamedieval.entity.Livro;
import br.com.senac.bibliotecamedieval.service.LivroService;

// SESSÃO 5 — O controller recebe pedidos HTTP e chama o serviço.
@RestController
@RequestMapping("/api/livros")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    // READ: devolve todos os livros.
    @GetMapping
    public List<Livro> listar() {
        return livroService.listarTodos();
    }

    // READ: procura um livro pela chave primária.
    @GetMapping("/{id}")
    public ResponseEntity<Livro> buscarPorId(@PathVariable Long id) {
        Optional<Livro> livro = livroService.buscarPorId(id);

        if (livro.isPresent()) {
            return ResponseEntity.ok(livro.get());
        }

        return ResponseEntity.notFound().build();
    }

    // CREATE: o corpo da requisição contém o JSON do novo livro.
    @PostMapping
    public ResponseEntity<Livro> cadastrar(@RequestBody LivroRequest requisicao) {
        Livro livroSalvo = livroService.cadastrar(requisicao);
        return ResponseEntity.status(HttpStatus.CREATED).body(livroSalvo);
    }

    // UPDATE: o id vem na URL e os novos dados vêm no corpo JSON.
    @PutMapping("/{id}")
    public Livro atualizar(
        @PathVariable Long id,
        @RequestBody LivroRequest requisicao
    ) {
        return livroService.atualizar(id, requisicao);
    }

    // DELETE: remove o livro indicado pelo id.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        livroService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
