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

import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.service.UsuarioService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

    @PostMapping
    public Usuario inserir(@Valid @RequestBody Usuario usuario) {
        return service.inserir(usuario);
    }

    @PutMapping
    public Usuario alterar(@Valid @RequestBody Usuario usuario) {
        return service.alterar(usuario);
    }

    @GetMapping
    public List<Usuario> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Usuario buscarPorId(@PathVariable("id") Long id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void remover(@PathVariable("id") Long id) {
        service.remover(id);
    }
}