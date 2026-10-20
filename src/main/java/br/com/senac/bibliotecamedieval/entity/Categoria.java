package br.com.senac.bibliotecamedieval.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// SESSÃO 2 — @Entity informa ao JPA que esta classe será guardada no banco.
@Entity
@Table(name = "categorias")
public class Categoria {

    // O id é a chave primária, usada para identificar cada categoria.
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    // O JPA precisa de um construtor vazio para reconstruir objetos do banco.
    public Categoria() {
    }

    public Categoria(String nome) {
        this.nome = nome;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
