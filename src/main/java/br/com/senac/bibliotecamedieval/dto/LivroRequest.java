package br.com.senac.bibliotecamedieval.dto;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

// SESSÃO 3 — Este objeto descreve o JSON que o cliente envia à API.
// Para os relacionamentos, o cliente envia ids já cadastrados.
public class LivroRequest {

    private String titulo;
    private BigDecimal preco;
    private Integer quantidade;
    private Long categoriaId;
    private String descricao;
    private Set<Long> autoresIds = new LinkedHashSet<>();

    public LivroRequest() {
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

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Set<Long> getAutoresIds() {
        return autoresIds;
    }

    public void setAutoresIds(Set<Long> autoresIds) {
        this.autoresIds = autoresIds;
    }
}
