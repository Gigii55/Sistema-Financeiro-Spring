
package com.ifpr.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ifpr.backend.entity.Carteira;
import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.entity.Usuario;
import com.ifpr.backend.entity.enums.PapelCarteira;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class CarteiraService {

  @Autowired
  private CarteiraRepository repository;

  @Autowired
  private CarteiraMembroRepository membroRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  @Transactional
  public Carteira inserir(Carteira carteira, Long usuarioId) {

    Usuario dono = usuarioRepository.findById(usuarioId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

    carteira.setId(null);
    carteira.setDono(dono);

    Carteira carteiraSalva = repository.save(carteira);

    CarteiraMembro membro = new CarteiraMembro();

    membro.setCarteira(carteiraSalva);
    membro.setUsuario(dono);
    membro.setPapel(PapelCarteira.DONO);

    membroRepository.save(membro);

    return carteiraSalva;
  }

  public Carteira inserir(Carteira carteira) {
    return inserir(carteira, carteira.getDono().getId());
  }

  public List<Carteira> listarTodos(Long usuarioId) {
    return repository.buscarCarteirasDoUsuario(usuarioId);
  }

  public Carteira buscarPorId(UUID id) {
    return repository.findById(id)
.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carteira não encontrada."));
  }

  public Carteira buscarPorId(UUID id, Long usuarioId) {

    Carteira carteira = buscarPorId(id);

    boolean participa = membroRepository.findByCarteiraIdAndUsuarioId(id,usuarioId).isPresent();

    if (!participa && carteira.getDono().getId() != usuarioId) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso não permitido.");
    }

    return carteira;
  }

  public void remover(UUID id, Long usuarioId) {

    Carteira carteira = buscarPorId(id);

    if (carteira.getDono().getId() != usuarioId) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o dono pode excluir a carteira.");
    }

    repository.delete(carteira);
  }

  public Carteira alterar(Carteira carteira, Long usuarioId) {

    Carteira carteiraBD = buscarPorId(carteira.getId());

    if (carteiraBD.getDono().getId() != usuarioId) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o dono pode alterar a carteira.");
    }

    carteiraBD.setNome(carteira.getNome());
    carteiraBD.setDescricao(carteira.getDescricao());

    return repository.save(carteiraBD);
  }
}
