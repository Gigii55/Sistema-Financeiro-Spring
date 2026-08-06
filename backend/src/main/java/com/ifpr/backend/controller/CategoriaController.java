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

import com.ifpr.backend.model.Categoria;
import com.ifpr.backend.service.CategoriaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/categorias")
@CrossOrigin
public class CategoriaController {

    @Autowired
    private CategoriaService service;

    @PostMapping
    public Categoria inserir(
            @Valid @RequestBody Categoria categoria) {

        return service.inserir(categoria);
    }

    @PutMapping
    public Categoria alterar(
            @Valid @RequestBody Categoria categoria) {

        return service.alterar(categoria);
    }

    @GetMapping
    public List<Categoria> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Categoria buscarPorId(
            @PathVariable("id") Long id) {

        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void remover(
            @PathVariable("id") Long id) {

        service.remover(id);
    }
}