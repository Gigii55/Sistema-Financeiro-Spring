
package com.ifpr.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.entity.Carteira;
import com.ifpr.backend.service.AutenticacaoService;
import com.ifpr.backend.service.CarteiraService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/carteiras")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CarteiraController {

  @Autowired
  private CarteiraService service;

  @Autowired
  private AutenticacaoService autenticacaoService;

  @PostMapping
  public Carteira inserir(@Valid @RequestBody Carteira carteira, HttpServletRequest request) {
    return service.inserir(carteira, autenticacaoService.usuarioId(request));
  }

  @PutMapping
  public Carteira alterar(@Valid @RequestBody Carteira carteira, HttpServletRequest request) {
    return service.alterar(carteira, autenticacaoService.usuarioId(request));
  }

  @GetMapping
  public List<Carteira> listarTodos(HttpServletRequest request) {
    return service.listarTodos(autenticacaoService.usuarioId(request));
  }

  @GetMapping("/{id}")
  public Carteira buscarPorId(@PathVariable UUID id, HttpServletRequest request) {
    return service.buscarPorId(id, autenticacaoService.usuarioId(request));
  }

  @DeleteMapping("/{id}")
  public void remover(@PathVariable UUID id, HttpServletRequest request) {
    service.remover(id, autenticacaoService.usuarioId(request));
  }
}
