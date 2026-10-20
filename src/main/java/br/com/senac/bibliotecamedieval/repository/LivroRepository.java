package br.com.senac.bibliotecamedieval.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.senac.bibliotecamedieval.entity.Livro;

// SESSÃO 3 — JpaRepository já oferece salvar, listar, buscar e excluir por id.
public interface LivroRepository extends JpaRepository<Livro, Long> {

    // Confere se existe algum livro usando a categoria antes de excluí-la.
    boolean existsByCategoria_Id(Long categoriaId);

    // Confere se existe algum livro ligado ao autor antes de excluí-lo.
    boolean existsByAutores_Id(Long autorId);
}
