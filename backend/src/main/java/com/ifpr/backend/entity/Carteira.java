package com.ifpr.backend.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Entity
@Data
public class Carteira {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario dono;

    @NotBlank
    @Size(max = 100)
    private String nome;

    @Size(max = 250)
    private String descricao;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime criadoEm;

    @OneToMany(mappedBy = "carteira")
    @JsonIgnore
    private List<CarteiraMembro> membros = new ArrayList<>();

    @OneToMany(mappedBy = "carteira")
    @JsonIgnore
    private List<Transacao> transacoes = new ArrayList<>();
}