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

import com.ifpr.backend.model.Carteira;
import com.ifpr.backend.service.CarteiraService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/carteiras")
@CrossOrigin
public class CarteiraController {

    @Autowired
    private CarteiraService service;

    @PostMapping
    public Carteira inserir(@Valid @RequestBody Carteira carteira) {
        return service.inserir(carteira);
    }

    @PutMapping
    public Carteira alterar(@Valid @RequestBody Carteira carteira) {
        return service.alterar(carteira);
    }

    @GetMapping
    public List<Carteira> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Carteira buscarPorId(@PathVariable("id") UUID id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable("id") UUID id) {
        service.remover(id);
    }
}