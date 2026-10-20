package br.com.senac.bibliotecamedieval.dto;

// SESSÃO 3 — Um pedido simples reutilizado ao cadastrar categoria ou autor.
public class NomeRequest {

    private String nome;

    public NomeRequest() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
