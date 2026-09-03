package com.ifpr.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;
import com.ifpr.backend.entity.Carteira;

public interface CarteiraRepository extends JpaRepository<Carteira, UUID> {
    List<Carteira> findByDonoId(Long donoId);
}
    

