
package com.ifpr.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ifpr.backend.entity.Carteira;
import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.entity.Categoria;
import com.ifpr.backend.entity.Transacao;
import com.ifpr.backend.entity.Usuario;
import com.ifpr.backend.entity.enums.PapelCarteira;
import com.ifpr.backend.entity.enums.TipoTransacao;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.CategoriaRepository;
import com.ifpr.backend.repository.TransacaoRepository;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class TransacaoService {

  @Autowired
  private TransacaoRepository repository;

  @Autowired
  private CarteiraRepository carteiraRepository;

  @Autowired
  private CarteiraMembroRepository membroRepository;

  @Autowired
  private UsuarioRepository usuarioRepository;

  @Autowired
  private CategoriaRepository categoriaRepository;

  private void verificarPermissao(UUID carteiraId, Long usuarioId, boolean editar) {

    Carteira carteira = carteiraRepository.findById(carteiraId).orElseThrow(() -> 
    new ResponseStatusException(HttpStatus.NOT_FOUND, "Carteira não encontrada."));

    if (carteira.getDono().getId() == usuarioId) {
      return;
    }

    CarteiraMembro membro = membroRepository.findByCarteiraIdAndUsuarioId(carteiraId, usuarioId).orElseThrow(() ->
     new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não participa desta carteira."));

    if (editar && membro.getPapel() != PapelCarteira.DONO && membro.getPapel() != PapelCarteira.EDITOR) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para modificar esta carteira.");
    }
  }

  private Categoria verificarCategoria(Categoria categoria, Long usuarioId) {

    if (categoria == null) {
      return null;
    }

    Categoria categoriaBD = categoriaRepository.findById(categoria.getId()).orElseThrow(() -> 
    new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoria não encontrada."));

    if (categoriaBD.getUsuario().getId() != usuarioId) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Esta categoria não pertence ao usuário.");
    }

    return categoriaBD;
  }

  @Transactional
  public Transacao inserir(Transacao transacao, Long usuarioId) {

    if (transacao.getCarteira() == null || transacao.getCarteira().getId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe uma carteira.");
    }

    UUID carteiraId = transacao.getCarteira().getId();

    verificarPermissao(carteiraId, usuarioId, true);

    Carteira carteira = carteiraRepository.findById(carteiraId).orElseThrow(() -> 
    new ResponseStatusException(HttpStatus.NOT_FOUND, "Carteira não encontrada."));

    Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow(() -> 
    new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado."));

    transacao.setId(null);
    transacao.setCarteira(carteira);
    transacao.setCriadoPor(usuario);
    transacao.setCategoria(verificarCategoria(transacao.getCategoria(), usuarioId));

    return repository.save(transacao);
  }

  public List<Transacao> listarTodos(Long usuarioId) {
    return repository.buscarTransacoesDoUsuario(usuarioId);
  }

  public Transacao buscarPorId(Long id, Long usuarioId) {

    Transacao transacao = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Transação não encontrada."));

    verificarPermissao(transacao.getCarteira().getId(), usuarioId, false);

    return transacao;
  }

  @Transactional
  public void remover(Long id, Long usuarioId) {

    Transacao transacao = buscarPorId(id, usuarioId);

    verificarPermissao(transacao.getCarteira().getId(), usuarioId, true);

    repository.delete(transacao);
  }

  @Transactional
  public Transacao alterar(Transacao transacao, Long usuarioId) {

    if (transacao.getId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Informe a transação.");
    }

    Transacao transacaoBD = buscarPorId(transacao.getId(), usuarioId);

    verificarPermissao(transacaoBD.getCarteira().getId(), usuarioId, true);

    transacaoBD.setCategoria(verificarCategoria(transacao.getCategoria(), usuarioId));
    transacaoBD.setTipo(transacao.getTipo());
    transacaoBD.setValor(transacao.getValor());
    transacaoBD.setDescricao(transacao.getDescricao());
    transacaoBD.setData(transacao.getData());

    return repository.save(transacaoBD);
  }

  public List<Transacao> buscarPorTipo(Long usuarioId, TipoTransacao tipo) {
    return repository.buscarPorTipo(usuarioId, tipo);
  }

  public List<Transacao> buscarPorCategoria(Long usuarioId, Long categoriaId) {
    return repository.buscarPorCategoria(usuarioId, categoriaId);
  }

  public List<Transacao> buscarPorPeriodo(Long usuarioId, LocalDate dataInicio, LocalDate dataFim) {
    return repository.buscarPorPeriodo(usuarioId, dataInicio, dataFim);
  }

  public Page<Transacao> buscarPaginado(Long usuarioId, UUID carteiraId, Pageable pageable) {

    if (carteiraId != null) {
      verificarPermissao(carteiraId, usuarioId, false);
      return repository.buscarPaginadoPorCarteira(usuarioId, carteiraId, pageable);
    }

    return repository.buscarPaginadoDoUsuario(usuarioId, pageable);
  }
}
