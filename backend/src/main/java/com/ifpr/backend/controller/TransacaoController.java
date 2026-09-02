package com.ifpr.backend.controller;

import java.util.List;

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

import com.ifpr.backend.entity.Transacao;
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
}