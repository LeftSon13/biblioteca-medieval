package br.com.senac.bibliotecamedieval.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import br.com.senac.bibliotecamedieval.dto.LivroRequest;
import br.com.senac.bibliotecamedieval.entity.Autor;
import br.com.senac.bibliotecamedieval.entity.Categoria;
import br.com.senac.bibliotecamedieval.entity.DetalheLivro;
import br.com.senac.bibliotecamedieval.entity.Livro;
import br.com.senac.bibliotecamedieval.repository.AutorRepository;
import br.com.senac.bibliotecamedieval.repository.CategoriaRepository;
import br.com.senac.bibliotecamedieval.repository.LivroRepository;

// SESSÃO 4 — O serviço concentra as regras e deixa o controller mais enxuto.
@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final CategoriaRepository categoriaRepository;
    private final AutorRepository autorRepository;

    // O Spring entrega os repositórios necessários pelo construtor.
    public LivroService(
        LivroRepository livroRepository,
        CategoriaRepository categoriaRepository,
        AutorRepository autorRepository
    ) {
        this.livroRepository = livroRepository;
        this.categoriaRepository = categoriaRepository;
        this.autorRepository = autorRepository;
    }

    @Transactional(readOnly = true)
    public List<Livro> listarTodos() {
        return livroRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Livro> buscarPorId(Long id) {
        return livroRepository.findById(id);
    }

    @Transactional
    public Livro cadastrar(LivroRequest requisicao) {
        validarRequisicao(requisicao);

        Livro livro = new Livro();
        preencherLivro(livro, requisicao);

        return livroRepository.save(livro);
    }

    @Transactional
    public Livro atualizar(Long id, LivroRequest requisicao) {
        validarRequisicao(requisicao);

        Livro livro = livroRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Livro não encontrado."
            ));

        preencherLivro(livro, requisicao);
        return livroRepository.save(livro);
    }

    @Transactional
    public void excluir(Long id) {
        Livro livro = livroRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Livro não encontrado."
            ));

        livroRepository.delete(livro);
    }

    // SESSÃO 4 — Este método traduz os ids recebidos em objetos ligados pelo JPA.
    private void preencherLivro(Livro livro, LivroRequest requisicao) {
        Categoria categoria = categoriaRepository.findById(requisicao.getCategoriaId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "A categoria informada não existe."
            ));

        livro.setTitulo(requisicao.getTitulo().trim());
        livro.setPreco(requisicao.getPreco());
        livro.setQuantidade(requisicao.getQuantidade());
        livro.setCategoria(categoria);

        // O detalhe é criado junto do livro e salvo pela relação CascadeType.ALL.
        DetalheLivro detalhe = livro.getDetalhe();
        if (detalhe == null) {
            detalhe = new DetalheLivro();
        }
        detalhe.setDescricao(requisicao.getDescricao().trim());
        livro.setDetalhe(detalhe);

        livro.setAutores(buscarAutores(requisicao.getAutoresIds()));
    }

    private Set<Autor> buscarAutores(Set<Long> autoresIds) {
        if (autoresIds == null || autoresIds.isEmpty()) {
            return new LinkedHashSet<>();
        }

        List<Autor> autoresEncontrados = autorRepository.findAllById(autoresIds);

        // Se algum id não existir, avisamos o cliente em vez de salvar uma ligação incompleta.
        if (autoresEncontrados.size() != autoresIds.size()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Um ou mais autores informados não existem."
            );
        }

        return new LinkedHashSet<>(autoresEncontrados);
    }

    private void validarRequisicao(LivroRequest requisicao) {
        if (requisicao == null
            || requisicao.getTitulo() == null
            || requisicao.getTitulo().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe o título do livro."
            );
        }

        if (requisicao.getPreco() == null || requisicao.getPreco().signum() < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe um preço igual ou maior que zero."
            );
        }

        if (requisicao.getQuantidade() == null || requisicao.getQuantidade() < 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Informe uma quantidade igual ou maior que zero."
            );
        }

        if (requisicao.getCategoriaId() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Selecione uma categoria."
            );
        }

        if (requisicao.getDescricao() == null || requisicao.getDescricao().isBlank()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Escreva o detalhe do livro."
            );
        }
    }
}
