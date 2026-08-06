package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ifpr.backend.model.TokenRedefinicaoSenha;
import com.ifpr.backend.repository.TokenRedefinicaoSenhaRepository;

@Service
public class TokenRedefinicaoSenhaService {

    @Autowired
    private TokenRedefinicaoSenhaRepository repository;

    public TokenRedefinicaoSenha inserir(TokenRedefinicaoSenha token) {
        return repository.save(token);
    }

    public List<TokenRedefinicaoSenha> listarTodos() {
        return repository.findAll();
    }

    public TokenRedefinicaoSenha buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Token de redefinição não encontrado"));
    }

    public void remover(Long id) {
        TokenRedefinicaoSenha token = buscarPorId(id);
        repository.delete(token);
    }

    public TokenRedefinicaoSenha alterar(TokenRedefinicaoSenha token) {

        TokenRedefinicaoSenha tokenBD = buscarPorId(token.getId());

        tokenBD.setUsuario(token.getUsuario());

        tokenBD.setToken(token.getToken());

        tokenBD.setExpiraEm(token.getExpiraEm());

        tokenBD.setUtilizado(token.isUtilizado());

        return repository.save(tokenBD);
    }
}