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
import br.com.senac.bibliotecamedieval.entity.Autor;
import br.com.senac.bibliotecamedieval.repository.AutorRepository;
import br.com.senac.bibliotecamedieval.repository.LivroRepository;

// SESSÃO 5 — Autores são cadastrados uma vez e podem ser reutilizados em livros.
@RestController
@RequestMapping("/api/autores")
public class AutorController {

    private final AutorRepository autorRepository;
    private final LivroRepository livroRepository;

    public AutorController(AutorRepository autorRepository, LivroRepository livroRepository) {
        this.autorRepository = autorRepository;
        this.livroRepository = livroRepository;
    }

    @GetMapping
    public List<Autor> listar() {
        return autorRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Autor> cadastrar(@RequestBody NomeRequest requisicao) {
        if (requisicao == null || requisicao.getNome() == null || requisicao.getNome().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe o nome do autor."
            );
        }

        Autor autor = new Autor(requisicao.getNome().trim());
        return ResponseEntity.status(HttpStatus.CREATED).body(autorRepository.save(autor));
    }

    // DELETE: remove o autor somente quando ele não estiver ligado a livros.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        Autor autor = autorRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Autor não encontrado."
            ));

        if (livroRepository.existsByAutores_Id(id)) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "O autor está vinculado a um ou mais livros."
            );
        }

        autorRepository.delete(autor);
        return ResponseEntity.noContent().build();
    }
}
