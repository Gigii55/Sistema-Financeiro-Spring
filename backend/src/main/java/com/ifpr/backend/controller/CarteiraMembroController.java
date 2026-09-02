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

import com.ifpr.backend.entity.CarteiraMembro;
import com.ifpr.backend.service.CarteiraMembroService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/carteira-membros")
@CrossOrigin
public class CarteiraMembroController {

    @Autowired
    private CarteiraMembroService service;

    @PostMapping
    public CarteiraMembro inserir(@Valid @RequestBody CarteiraMembro membro) {
        return service.inserir(membro);
    }

    @PutMapping
    public CarteiraMembro alterar(@Valid @RequestBody CarteiraMembro membro) {
        return service.alterar(membro);
    }

    @GetMapping
    public List<CarteiraMembro> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public CarteiraMembro buscarPorId(@PathVariable("id") Long id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable("id") Long id) {
        service.remover(id);
    }
}