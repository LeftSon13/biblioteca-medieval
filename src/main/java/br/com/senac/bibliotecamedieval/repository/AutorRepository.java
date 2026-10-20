package br.com.senac.bibliotecamedieval.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.senac.bibliotecamedieval.entity.Autor;

public interface AutorRepository extends JpaRepository<Autor, Long> {
}
