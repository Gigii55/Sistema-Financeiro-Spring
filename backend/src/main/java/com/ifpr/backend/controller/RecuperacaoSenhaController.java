package com.ifpr.backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.service.RecuperacaoSenhaService;


@RestController
@RequestMapping("/recuperacao-senha")
@CrossOrigin(origins = "http://localhost:5173")
public class RecuperacaoSenhaController {

    @Autowired
    private RecuperacaoSenhaService service;


    @PostMapping("/solicitar")
    public ResponseEntity<String> solicitar(@RequestBody Map<String, String> dados) {
        service.solicitarRecuperacao(dados.get("email"));
        return ResponseEntity.ok("Caso o e-mail esteja cadastrado, você receberá as instruções.");
    }


    @PostMapping("/redefinir")
    public ResponseEntity<String> redefinir(@RequestBody Map<String, String> dados) {
        try {
            service.redefinirSenha(dados.get("token"), dados.get("novaSenha"));

            return ResponseEntity.ok("Senha redefinida com sucesso.");
        }
        catch (RuntimeException erro) {

            return ResponseEntity.badRequest().body(erro.getMessage());
        }
    }
}