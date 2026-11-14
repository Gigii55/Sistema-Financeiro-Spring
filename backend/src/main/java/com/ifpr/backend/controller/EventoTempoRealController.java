
package com.ifpr.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.ifpr.backend.service.AutenticacaoService;
import com.ifpr.backend.service.EventoTempoRealService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/eventos")
public class EventoTempoRealController {

  @Autowired
  private EventoTempoRealService service;

  @Autowired
  private AutenticacaoService autenticacaoService;

  @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
  public SseEmitter conectar(HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    return service.conectar(usuarioId);
  }
}
