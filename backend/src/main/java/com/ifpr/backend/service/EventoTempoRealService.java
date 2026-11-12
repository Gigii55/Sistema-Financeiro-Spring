
package com.ifpr.backend.service;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ifpr.backend.entity.Carteira;
import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.repository.CarteiraRepository;

@Service
public class EventoTempoRealService {

  @Autowired
  private CarteiraRepository carteiraRepository;

  @Autowired
  private CarteiraMembroRepository membroRepository;

  private final ConcurrentHashMap<Long, CopyOnWriteArrayList<SseEmitter>> conexoes = new ConcurrentHashMap<>();

 
public SseEmitter conectar(Long usuarioId) {

  SseEmitter emissor = new SseEmitter(0L);

  conexoes.computeIfAbsent(usuarioId, id -> new CopyOnWriteArrayList<>()).add(emissor);

  System.out.println("SSE: usuário " + usuarioId + " conectado.");

  emissor.onCompletion(() -> removerConexao(usuarioId, emissor));
  emissor.onTimeout(() -> removerConexao(usuarioId, emissor));
  emissor.onError(erro -> removerConexao(usuarioId, emissor));

  try {
    emissor.send(SseEmitter.event().name("conectado").data("ok"));
  } catch (IOException | IllegalStateException erro) {
    removerConexao(usuarioId, emissor);
    emissor.complete();
  }

  return emissor;
}


  private void removerConexao(Long usuarioId, SseEmitter emissor) {

    CopyOnWriteArrayList<SseEmitter> lista = conexoes.get(usuarioId);

    if (lista != null) {
      lista.remove(emissor);

      if (lista.isEmpty()) {
        conexoes.remove(usuarioId, lista);
      }
    }
  }

  
private void enviar(Long usuarioId, String evento, String mensagem) {

  CopyOnWriteArrayList<SseEmitter> lista = conexoes.get(usuarioId);

  if (lista == null || lista.isEmpty()) {
    System.out.println("SSE: usuário " + usuarioId + " sem conexão ativa.");
    return;
  }

  for (SseEmitter emissor : lista) {
    try {
      emissor.send(SseEmitter.event().name(evento).data(mensagem));

      if (!evento.equals("ping")) {
        System.out.println("SSE: evento " + evento + " enviado ao usuário " + usuarioId);
      }

    } catch (IOException | IllegalStateException erro) {
      System.out.println("SSE: falha ao enviar ao usuário " + usuarioId + ": " + erro.getMessage());
      removerConexao(usuarioId, emissor);
      emissor.complete();
    }
  }
}


  private void aposCommit(Runnable acao) {

    if (TransactionSynchronizationManager.isActualTransactionActive() && TransactionSynchronizationManager.isSynchronizationActive()) {

      TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
        @Override
        public void afterCommit() {
          acao.run();
        }
      });

    } else {
      acao.run();
    }
  }

  
public void notificarCarteira(UUID carteiraId) {

  Carteira carteira = carteiraRepository.findById(carteiraId).orElse(null);

  if (carteira == null) {
    System.out.println("SSE: carteira não encontrada: " + carteiraId);
    return;
  }

  Set<Long> usuarios = new HashSet<>();

  usuarios.add(carteira.getDono().getId());

  for (CarteiraMembro membro : membroRepository.findByCarteiraId(carteiraId)) {
    usuarios.add(membro.getUsuario().getId());
  }

  aposCommit(() -> {
    System.out.println("SSE: notificando carteira " + carteiraId);
    System.out.println("SSE: usuários participantes " + usuarios);

    for (Long usuarioId : usuarios) {
      enviar(usuarioId, "carteira-atualizada", carteiraId.toString());
    }
  });
}


public void notificarUsuario(Long usuarioId, String evento) {
  aposCommit(() -> {
    System.out.println("SSE: notificando usuário " + usuarioId);
    enviar(usuarioId, evento, "atualizar");
  });
}


  @Scheduled(fixedRate = 25000)
  public void manterConexoes() {

    for (Long usuarioId : conexoes.keySet()) {
      enviar(usuarioId, "ping", "ok");
    }
  }
}
