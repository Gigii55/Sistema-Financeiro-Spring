package com.ifpr.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.entity.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
    

