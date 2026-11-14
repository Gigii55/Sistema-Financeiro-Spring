
package com.ifpr.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.repository.CarteiraMembroRepository;
import com.ifpr.backend.service.AutenticacaoService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/carteira-membros")
public class CarteiraMembroController {

  @Autowired
  private CarteiraMembroRepository repository;

  @Autowired
  private AutenticacaoService autenticacaoService;

  @GetMapping("/carteira/{carteiraId}")
  public List<CarteiraMembro> buscarMembrosDaCarteira(
      @PathVariable UUID carteiraId,
      HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    boolean participa = repository.findByCarteiraIdAndUsuarioId(
      carteiraId,
      usuarioId
    ).isPresent();

    if (!participa) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso não permitido.");
    }

    return repository.findByCarteiraId(carteiraId);
  }
}
