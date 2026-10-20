package br.com.senac.bibliotecamedieval.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.senac.bibliotecamedieval.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
