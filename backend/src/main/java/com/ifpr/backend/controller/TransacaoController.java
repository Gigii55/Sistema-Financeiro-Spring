package com.ifpr.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.ifpr.backend.service.TransacaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/transacoes")
@CrossOrigin
public class TransacaoController {

    @Autowired
    private TransacaoService service;

    @PostMapping
    public Transacao inserir(@Valid @RequestBody Transacao transacao){
        return service.inserir(transacao);
    }

    @PutMapping
    public Transacao alterar(@Valid @RequestBody Transacao transacao){
        return service.alterar(transacao);
    }

    @GetMapping
    public List<Transacao> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Transacao buscarPorId(@PathVariable("id") Long id){
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable("id") Long id){
        service.remover(id);
    }

    @GetMapping("/filtro")
    public ResponseEntity<List<Transacao>> buscarPorTipo(
        @RequestParam TipoTransacao tipo
    ) {
        return ResponseEntity.ok(service.buscarPorTipo(tipo));
    }

    @GetMapping("/filtro-categoria")
    public ResponseEntity<List<Transacao>> buscarPorCategoria(
        @RequestParam Long categoriaId
    ) {
        return ResponseEntity.ok(service.buscarPorCategoria(categoriaId));
    }

    @GetMapping("/filtro-periodo")
public ResponseEntity<List<Transacao>> buscarPorPeriodo(
    @RequestParam LocalDate dataInicio,
    @RequestParam LocalDate dataFim
) {
    return ResponseEntity.ok(
        service.buscarPorPeriodo(dataInicio, dataFim)
    );
}

@GetMapping("/paginado")
public ResponseEntity<Page<Transacao>> buscarPaginado(Pageable pageable) {
    return ResponseEntity.ok(service.buscarPaginado(pageable));
}
}