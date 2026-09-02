package com.ifpr.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AlterarSenhaDTO {

    @NotBlank
    private String email;

    @NotBlank
    private String senhaAtual;

    @NotBlank
    @Size(min = 6, max = 20)
    private String novaSenha;
}