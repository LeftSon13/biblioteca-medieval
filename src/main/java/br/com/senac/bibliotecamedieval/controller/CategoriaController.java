package br.com.senac.bibliotecamedieval.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.com.senac.bibliotecamedieval.dto.NomeRequest;
import br.com.senac.bibliotecamedieval.entity.Categoria;
import br.com.senac.bibliotecamedieval.repository.CategoriaRepository;
import br.com.senac.bibliotecamedieval.repository.LivroRepository;

// SESSÃO 5 — Essas rotas preparam categorias que depois serão escolhidas nos livros.
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;
    private final LivroRepository livroRepository;

    public CategoriaController(
        CategoriaRepository categoriaRepository,
        LivroRepository livroRepository
    ) {
        this.categoriaRepository = categoriaRepository;
        this.livroRepository = livroRepository;
    }

    @GetMapping
    public List<Categoria> listar() {
        return categoriaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Categoria> cadastrar(@RequestBody NomeRequest requisicao) {
        if (requisicao == null || requisicao.getNome() == null || requisicao.getNome().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe o nome da categoria."
            );
        }

        Categoria categoria = new Categoria(requisicao.getNome().trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(categoriaRepository.save(categoria));
    }

    // DELETE: remove a categoria somente quando nenhum livro estiver usando-a.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Categoria categoria = categoriaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Categoria não encontrada."
            ));

        if (livroRepository.existsByCategoria_Id(id)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "A categoria está vinculada a um ou mais livros."
            );
        }

        categoriaRepository.delete(categoria);
        return ResponseEntity.noContent().build();
    }
}
