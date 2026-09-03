package com.ifpr.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.entity.Carteira;
import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.entity.enums.PapelCarteira;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;

@Service
public class CarteiraService {

    @Autowired
    private CarteiraRepository repository;

    @Autowired
    private CarteiraMembroRepository membroRepository;

    public Carteira inserir(Carteira carteira) {

    Carteira carteiraSalva = repository.save(carteira);

    CarteiraMembro membro = new CarteiraMembro();

    membro.setCarteira(carteiraSalva);
    membro.setUsuario(carteiraSalva.getDono());
    membro.setPapel(PapelCarteira.DONO);

    membroRepository.save(membro);

    return carteiraSalva;
}
    public List<Carteira> listarTodos() {
        return repository.findAll();
    }

    public Carteira buscarPorId(UUID id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Carteira não encontrada"));
    }

    public void remover(UUID id) {
        Carteira carteira = buscarPorId(id);
        repository.delete(carteira);
    }

    public Carteira alterar(Carteira carteira) {

        Carteira carteiraBD = buscarPorId(carteira.getId());

        carteiraBD.setDono(carteira.getDono());
        carteiraBD.setNome(carteira.getNome());
        carteiraBD.setDescricao(carteira.getDescricao());

        return repository.save(carteiraBD);
    }
}