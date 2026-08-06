package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.exception.ResourceNotFoundException;
import com.ifpr.backend.model.Transacao;
import com.ifpr.backend.repository.TransacaoRepository;

@Service
public class TransacaoService {

    @Autowired
    private TransacaoRepository repository;

    public Transacao inserir(Transacao transacao) {
        return repository.save(transacao);
    }

    public List<Transacao> listarTodos() {
        return repository.findAll();
    }

    public Transacao buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada"));
    }

    public void remover(Long id) {
        Transacao transacao = buscarPorId(id);
        repository.delete(transacao);
    }

    public Transacao alterar(Transacao transacao) {

        Transacao transacaoBD = buscarPorId(transacao.getId());

        transacaoBD.setCarteira(transacao.getCarteira());

        transacaoBD.setCategoria(transacao.getCategoria());

        transacaoBD.setCriadoPor(transacao.getCriadoPor());

        transacaoBD.setTipo(transacao.getTipo());

        transacaoBD.setValor(transacao.getValor());

        transacaoBD.setDescricao(transacao.getDescricao());

        transacaoBD.setData(transacao.getData());

        return repository.save(transacaoBD);
    }
}