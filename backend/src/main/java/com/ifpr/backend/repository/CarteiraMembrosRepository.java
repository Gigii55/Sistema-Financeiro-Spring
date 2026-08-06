package com.ifpr.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.model.CarteiraMembro;

public interface UsuarioRepository extends JpaRepository<CarteiraMembro, Long> {
}
    

