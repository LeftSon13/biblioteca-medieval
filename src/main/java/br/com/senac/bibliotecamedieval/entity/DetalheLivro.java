package br.com.senac.bibliotecamedieval.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// SESSÃO 2 — O enunciado exige um detalhe por livro, mas não define seus campos.
// "descricao" é uma escolha didática para guardar um texto livre sobre o livro.
@Entity
@Table(name = "detalhes_livro")
public class DetalheLivro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String descricao;

    public DetalheLivro() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
