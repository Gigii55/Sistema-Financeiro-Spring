package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.repository.CarteiraMembroRepository;

@Service
public class CarteiraMembroService {

    @Autowired
    private CarteiraMembroRepository repository;

    public CarteiraMembro inserir( CarteiraMembro carteiraMembro) {
        return repository.save(carteiraMembro);
    }

    public List<CarteiraMembro> listarTodos() {
        return repository.findAll();
    }

    public CarteiraMembro buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Membro da carteira não encontrado"));
    }

    public void remover(Long id) {
        CarteiraMembro membro = buscarPorId(id);
        repository.delete(membro);
    }

    public CarteiraMembro alterar(CarteiraMembro carteiraMembro) {

        CarteiraMembro membroBD = buscarPorId(carteiraMembro.getId());

        membroBD.setCarteira(carteiraMembro.getCarteira());

        membroBD.setUsuario(carteiraMembro.getUsuario());

        membroBD.setPapel(carteiraMembro.getPapel());
        return repository.save(membroBD);
    }
}