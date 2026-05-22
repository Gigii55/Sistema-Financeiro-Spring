package com.ifpr.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "nome obrigatória!")
    @Size (min = 10, message = "insira o nome completo!")
    private String nome;

    @Email (message = "insira um email válido!")
    private String email;

    @NotBlank(message = "senha obrigatória!")
    private String senha;
    
}
