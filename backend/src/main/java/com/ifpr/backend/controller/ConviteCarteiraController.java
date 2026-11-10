
package com.ifpr.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.entity.ConviteCarteira;
import com.ifpr.backend.service.ConviteCarteiraService;

@RestController
@RequestMapping("/convites")
@CrossOrigin(origins = "http://localhost:5173")
public class ConviteCarteiraController {

  @Autowired
  private ConviteCarteiraService service;

  @GetMapping("/pendentes")
  public List<ConviteCarteira> listarPendentes(@RequestParam Long usuarioId) {
    return service.listarPendentes(usuarioId);
  }

  @PostMapping("/{id}/aceitar")
  public ResponseEntity<Void> aceitar(@PathVariable Long id,@RequestParam Long usuarioId) {
    service.aceitarConvite(id, usuarioId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{id}/recusar")
  public ResponseEntity<Void> recusar(@PathVariable Long id,@RequestParam Long usuarioId) {
    service.recusarConvite(id, usuarioId);
    return ResponseEntity.noContent().build();
  }
}
