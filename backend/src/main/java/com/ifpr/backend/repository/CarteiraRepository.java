
package com.ifpr.backend.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ifpr.backend.entity.Carteira;

public interface CarteiraRepository extends JpaRepository<Carteira, UUID> {

  List<Carteira> findByDonoId(Long donoId);

  @Query("SELECT DISTINCT c FROM Carteira c " +"LEFT JOIN c.membros m " + "WHERE c.dono.id = :usuarioId " +"OR m.usuario.id = :usuarioId")
  List<Carteira> buscarCarteirasDoUsuario(@Param("usuarioId") Long usuarioId);
}
