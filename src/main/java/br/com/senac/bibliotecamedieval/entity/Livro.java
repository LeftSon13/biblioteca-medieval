package br.com.senac.bibliotecamedieval.entity;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

// SESSÃO 2 — Livro é a entidade principal do cadastro.
@Entity
@Table(name = "livros")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    // BigDecimal representa valores monetários com precisão decimal.
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer quantidade;

    // Muitos livros podem usar a mesma categoria: cada livro aponta para uma categoria.
    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    // Cada livro tem um detalhe próprio. A exclusão do livro leva seu detalhe junto.
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "detalhe_id", nullable = false, unique = true)
    private DetalheLivro detalhe;

    // A tabela de ligação permite associar vários autores a vários livros.
    @ManyToMany
    @JoinTable(
        name = "livros_autores",
        joinColumns = @JoinColumn(name = "livro_id"),
        inverseJoinColumns = @JoinColumn(name = "autor_id")
    )
    private Set<Autor> autores = new LinkedHashSet<>();

    public Livro() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public DetalheLivro getDetalhe() {
        return detalhe;
    }

    public void setDetalhe(DetalheLivro detalhe) {
        this.detalhe = detalhe;
    }

    public Set<Autor> getAutores() {
        return autores;
    }

    public void setAutores(Set<Autor> autores) {
        this.autores = autores;
    }
}
