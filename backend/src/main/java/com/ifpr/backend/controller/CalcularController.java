package com.ifpr.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ifpr.backend.model.Calcular;
import com.ifpr.backend.service.CalcularService;

@RestController()
@RequestMapping("/calcular")
public class CalcularController {

    @Autowired
    private CalcularService calcularService;

    @PostMapping
    public Double calcularClasse(@RequestBody Calcular calculo) {

        return calcularService.calcular(calculo);
    }

}
