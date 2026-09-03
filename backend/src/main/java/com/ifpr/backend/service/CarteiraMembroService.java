package com.ifpr.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.dto.AdicionarMembroDTO;
import com.ifpr.backend.entity.Carteira;
import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.entity.Usuario;
import com.ifpr.backend.entity.enums.PapelCarteira;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class CarteiraMembroService {

    @Autowired
    private CarteiraMembroRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CarteiraRepository carteiraRepository;

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

    public CarteiraMembro adicionarMembro(UUID carteiraId, AdicionarMembroDTO dados) {

    Carteira carteira = carteiraRepository.findById(carteiraId).orElseThrow(() -> new RuntimeException("Carteira não encontrada"));

    Usuario usuario = usuarioRepository.findByEmail(dados.getEmail()).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    CarteiraMembro membro = new CarteiraMembro();
    membro.setCarteira(carteira);
    membro.setUsuario(usuario);
    membro.setPapel(dados.getPapel());
    return repository.save(membro);
}

public CarteiraMembro alterarPapel(UUID carteiraId, Long usuarioId, PapelCarteira novoPapel) {
    CarteiraMembro membro = repository.findByCarteiraIdAndUsuarioId(carteiraId, usuarioId).orElseThrow(() -> new RuntimeException("Membro não encontrado"));
    membro.setPapel(novoPapel);
    return repository.save(membro);
}
public void removerMembro(UUID carteiraId, Long usuarioId) {
    CarteiraMembro membro = repository.findByCarteiraIdAndUsuarioId(carteiraId, usuarioId).orElseThrow(() -> new RuntimeException("Membro não encontrado"));
    repository.delete(membro);
}
}