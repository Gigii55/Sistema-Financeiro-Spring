
package com.ifpr.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Service
public class AutenticacaoService {

  public Long usuarioId(HttpServletRequest request) {

    HttpSession sessao = request.getSession(false);

    if (sessao == null || sessao.getAttribute("usuarioId") == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não autenticado.");
    }

    return (Long) sessao.getAttribute("usuarioId");
  }
}
