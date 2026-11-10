
package com.ifpr.backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.entity.ConviteCarteira;
import com.ifpr.backend.entity.enums.StatusConvite;

public interface ConviteCarteiraRepository extends JpaRepository<ConviteCarteira, Long> {

  List<ConviteCarteira> findByConvidadoIdAndStatus(Long convidadoId, StatusConvite status);

  boolean existsByCarteiraIdAndConvidadoIdAndStatus(UUID carteiraId, Long convidadoId, StatusConvite status);

  Optional<ConviteCarteira> findByIdAndConvidadoId(Long id, Long convidadoId);
}
