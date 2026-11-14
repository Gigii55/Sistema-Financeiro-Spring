
package com.ifpr.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.entity.ConviteCarteira;
import com.ifpr.backend.service.AutenticacaoService;
import com.ifpr.backend.service.ConviteCarteiraService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/convites")
public class ConviteCarteiraController {

  @Autowired
  private ConviteCarteiraService service;

  @Autowired
  private AutenticacaoService autenticacaoService;

  @PostMapping("/carteira/{carteiraId}")
  public ConviteCarteira enviarConvite(@PathVariable UUID carteiraId,@RequestBody Map<String, String> dados,HttpServletRequest request) {
    Long usuarioId = autenticacaoService.usuarioId(request);
    return service.enviarConvite(carteiraId, dados.get("email"), usuarioId);
  }

  @GetMapping("/pendentes")
  public List<ConviteCarteira> listarPendentes(HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    return service.listarPendentes(usuarioId);
  }

  @PostMapping("/{id}/aceitar")
  public ResponseEntity<Void> aceitar(@PathVariable Long id, HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    service.aceitarConvite(id, usuarioId);

    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{id}/recusar")
  public ResponseEntity<Void> recusar(@PathVariable Long id, HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    service.recusarConvite(id, usuarioId);

    return ResponseEntity.noContent().build();
  }
}
