package com.ifpr.backend.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class ResumoCarteiraDTO {

    private BigDecimal totalReceitas;
    private BigDecimal totalDespesas;
    private BigDecimal saldo;
}