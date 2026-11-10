
package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.entity.ConviteCarteira;
import com.ifpr.backend.entity.enums.PapelCarteira;
import com.ifpr.backend.entity.enums.StatusConvite;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.ConviteCarteiraRepository;

@Service
public class ConviteCarteiraService {

  @Autowired
  private ConviteCarteiraRepository repository;

  @Autowired
  private CarteiraMembroRepository membroRepository;

  public List<ConviteCarteira> listarPendentes(Long usuarioId) {
    return repository.findByConvidadoIdAndStatus(usuarioId,StatusConvite.PENDENTE);
  }

  @Transactional
  public void aceitarConvite(Long conviteId, Long usuarioId) {

    ConviteCarteira convite = repository.findByIdAndConvidadoId(conviteId,usuarioId).orElseThrow(() -> new RuntimeException("Convite não encontrado."));
    if (convite.getStatus() != StatusConvite.PENDENTE) {
      throw new IllegalStateException("Este convite já foi respondido.");
    }

    boolean jaParticipa = membroRepository.findByCarteiraIdAndUsuarioId(convite.getCarteira().getId(),usuarioId).isPresent();

    if (!jaParticipa) {
      CarteiraMembro membro = new CarteiraMembro();
      membro.setCarteira(convite.getCarteira());
      membro.setUsuario(convite.getConvidado());
      membro.setPapel(PapelCarteira.EDITOR);
      membroRepository.save(membro);
    }
    convite.setStatus(StatusConvite.ACEITO);
    repository.save(convite);
  }

  @Transactional
  public void recusarConvite(Long conviteId, Long usuarioId) {

    ConviteCarteira convite = repository.findByIdAndConvidadoId(conviteId,usuarioId).orElseThrow(() -> new RuntimeException("Convite não encontrado."));

    if (convite.getStatus() != StatusConvite.PENDENTE) {
      throw new IllegalStateException("Este convite já foi respondido.");
    }

    convite.setStatus(StatusConvite.RECUSADO);
    repository.save(convite);
  }
}
