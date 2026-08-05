package com.ifpr.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Entity
@Data
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Email
    @Size(max = 100)
    private String email;

    @NotBlank
    @Size(max = 100)
    private String nome;

    @Enumerated(EnumType.STRING)
    @NotBlank
    private TipoTransacao tipo;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String icone;   

    @NotBlank
    @Size(min = 7, max = 7)
    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "A cor deve estar no formato hexadecimal, como #ffffff")
    @Column(nullable = false, length = 7)
    private String cor;
}
