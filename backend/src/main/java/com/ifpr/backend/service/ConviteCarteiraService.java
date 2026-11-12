
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
import com.ifpr.backend.entity.ConviteCarteira;
import com.ifpr.backend.entity.Usuario;
import com.ifpr.backend.entity.enums.PapelCarteira;
import com.ifpr.backend.entity.enums.StatusConvite;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.ConviteCarteiraRepository;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class ConviteCarteiraService {

  @Autowired
  private EventoTempoRealService eventoTempoRealService;

  @Autowired
  private ConviteCarteiraRepository repository;

  @Autowired
  private CarteiraMembroRepository membroRepository;

  @Autowired
  private CarteiraRepository carteiraRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  @Transactional
  public ConviteCarteira enviarConvite(UUID carteiraId, String email, Long remetenteId) {

    Carteira carteira = carteiraRepository.findById(carteiraId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Carteira não encontrada."));

    if (carteira.getDono().getId() != remetenteId) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o dono pode enviar convites.");
    }

    if (email == null || email.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe um e-mail.");
    }

    Usuario convidado = usuarioRepository.findByEmail(email.trim())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

    if (convidado.getId() == remetenteId) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Você não pode convidar a si mesmo.");
    }

    boolean jaParticipa = membroRepository
      .findByCarteiraIdAndUsuarioId(carteiraId, convidado.getId())
      .isPresent();

    if (jaParticipa) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Este usuário já participa da carteira.");
    }

    boolean convitePendente = repository.existsByCarteiraIdAndConvidadoIdAndStatus(
      carteiraId,
      convidado.getId(),
      StatusConvite.PENDENTE
    );

    if (convitePendente) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Este usuário já possui um convite pendente.");
    }

    Usuario remetente = usuarioRepository.findById(remetenteId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Remetente não encontrado."));

    ConviteCarteira convite = new ConviteCarteira();

    convite.setCarteira(carteira);
    convite.setConvidado(convidado);
    convite.setRemetente(remetente);
    convite.setStatus(StatusConvite.PENDENTE);

    ConviteCarteira conviteSalvo = repository.save(convite);

    eventoTempoRealService.notificarUsuario(convidado.getId(), "convite-atualizado");

    return conviteSalvo;
  }

  public List<ConviteCarteira> listarPendentes(Long usuarioId) {
    return repository.findByConvidadoIdAndStatus(usuarioId, StatusConvite.PENDENTE);
  }

  @Transactional
  public void aceitarConvite(Long conviteId, Long usuarioId) {

    ConviteCarteira convite = repository.findByIdAndConvidadoId(conviteId, usuarioId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convite não encontrado."));

    if (convite.getStatus() != StatusConvite.PENDENTE) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Este convite já foi respondido.");
    }

    boolean jaParticipa = membroRepository.findByCarteiraIdAndUsuarioId(
      convite.getCarteira().getId(),
      usuarioId
    ).isPresent();

    if (!jaParticipa) {
      CarteiraMembro membro = new CarteiraMembro();

      membro.setCarteira(convite.getCarteira());
      membro.setUsuario(convite.getConvidado());
      membro.setPapel(PapelCarteira.EDITOR);

      membroRepository.save(membro);
    }

    convite.setStatus(StatusConvite.ACEITO);
    repository.save(convite);

    eventoTempoRealService.notificarUsuario(usuarioId, "convite-atualizado");
    eventoTempoRealService.notificarUsuario(usuarioId, "carteira-atualizada");
  }

  @Transactional
  public void recusarConvite(Long conviteId, Long usuarioId) {

    ConviteCarteira convite = repository.findByIdAndConvidadoId(conviteId, usuarioId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Convite não encontrado."));

    if (convite.getStatus() != StatusConvite.PENDENTE) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "Este convite já foi respondido.");
    }

    convite.setStatus(StatusConvite.RECUSADO);
    repository.save(convite);

    eventoTempoRealService.notificarUsuario(usuarioId, "convite-atualizado");
  }
}
