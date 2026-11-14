
package com.ifpr.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.entity.Transacao;
import com.ifpr.backend.entity.enums.TipoTransacao;
import com.ifpr.backend.service.AutenticacaoService;
import com.ifpr.backend.service.TransacaoService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {

  @Autowired
  private TransacaoService service;

  @Autowired
  private AutenticacaoService autenticacaoService;

  @PostMapping
  public Transacao inserir(@Valid @RequestBody Transacao transacao, HttpServletRequest request) {
    return service.inserir(transacao, autenticacaoService.usuarioId(request));
  }

  @PutMapping
  public Transacao alterar(@Valid @RequestBody Transacao transacao, HttpServletRequest request) {
    return service.alterar(transacao, autenticacaoService.usuarioId(request));
  }

  @GetMapping
  public List<Transacao> listarTodos(HttpServletRequest request) {
    return service.listarTodos(autenticacaoService.usuarioId(request));
  }

  @GetMapping("/{id}")
  public Transacao buscarPorId(@PathVariable Long id, HttpServletRequest request) {
    return service.buscarPorId(id, autenticacaoService.usuarioId(request));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> remover(@PathVariable Long id, HttpServletRequest request) {
    service.remover(id, autenticacaoService.usuarioId(request));
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/filtro")
  public ResponseEntity<List<Transacao>> buscarPorTipo( @RequestParam TipoTransacao tipo, HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    return ResponseEntity.ok(service.buscarPorTipo(usuarioId, tipo));
  }

  @GetMapping("/filtro-categoria")
  public ResponseEntity<List<Transacao>> buscarPorCategoria(@RequestParam Long categoriaId,HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    return ResponseEntity.ok(service.buscarPorCategoria(usuarioId, categoriaId));
  }

  @GetMapping("/filtro-periodo")
  public ResponseEntity<List<Transacao>> buscarPorPeriodo(@RequestParam LocalDate dataInicio,@RequestParam LocalDate dataFim,
    HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    return ResponseEntity.ok(service.buscarPorPeriodo(usuarioId, dataInicio, dataFim));
  }

  @GetMapping("/paginado")
  public ResponseEntity<Page<Transacao>> buscarPaginado(@RequestParam(required = false) UUID carteiraId,Pageable pageable, HttpServletRequest request) {

    Long usuarioId = autenticacaoService.usuarioId(request);

    return ResponseEntity.ok(service.buscarPaginado(usuarioId, carteiraId, pageable));
  }
}
