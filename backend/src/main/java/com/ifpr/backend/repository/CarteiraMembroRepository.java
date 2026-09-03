package com.ifpr.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.entity.CarteiraMembro;

public interface CarteiraMembroRepository extends JpaRepository<CarteiraMembro, Long> {
    Optional<CarteiraMembro> findByCarteiraIdAndUsuarioId(UUID carteiraId, Long usuarioId);
}
