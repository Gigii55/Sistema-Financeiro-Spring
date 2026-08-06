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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {

    @Autowired
    private UsuarioService service;

        @PostMapping
        public ResponseEntity<?> inserir(@Valid @RequestBody Usuario usuario) {
            if (service.emailJaCadastrado(usuario.getEmail())) {
                 return ResponseEntity.badRequest().body("Este e-mail já está cadastrado.");
    }
     return ResponseEntity.ok(service.inserir(usuario));
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
       @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario dados) {

    Usuario usuario = service.login(dados.getEmail(),dados.getSenha());

    if (usuario == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("E-mail ou senha inválidos.");
        }

    return ResponseEntity.ok(usuario);
}
}