package com.ifpr.backend.controller;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.model.Soma;
import com.ifpr.backend.service.SomaService;

@RestController()
@RequestMapping("/")

public class Hello {

    @Autowired
    private SomaService somaService;


    @GetMapping
    public String hello() {
        return "Olá Spring";
    }

    @PostMapping
    public Double somar(@RequestParam("valor1") Double valor1,
    @RequestParam("valor2")Double valor2) {
        return valor1 + valor2;
    }

    @PostMapping("/classe")
    public Double somarClasse(@RequestBody Soma soma) {
        return somaService.somar(soma);
    }


    @GetMapping("/data-hora")
    public String mostrarHora() {
        return new Date().toString();
    }
}
