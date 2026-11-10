package com.ifpr.backend.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.ifpr.backend.entity.enums.StatusConvite;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;

import lombok.Data;

@Entity
@Data
public class ConviteCarteira {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "carteira_id", nullable = false)
    private Carteira carteira;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "convidado_id", nullable = false)
    private Usuario convidado;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "remetente_id", nullable = false)
    private Usuario remetente;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusConvite status = StatusConvite.PENDENTE;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime criadoEm;
}