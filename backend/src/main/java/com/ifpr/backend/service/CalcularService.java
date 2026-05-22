package com.ifpr.backend.service;

import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Calcular;

@Service
public class CalcularService {
    public Double calcular (Calcular calcular){
        Double calc = calcular.getValorInicial()*(1+ Math.pow(calcular.getValorJuros()/100, calcular.getPrazo()));
        return calc;
    }
}
