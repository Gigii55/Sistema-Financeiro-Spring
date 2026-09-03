package com.ifpr.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ifpr.backend.entity.Transacao;
import com.ifpr.backend.entity.enums.TipoTransacao;

public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByTipo(TipoTransacao tipo);
    List<Transacao> findByCategoriaId(Long categoriaId);
    List<Transacao> findByDataBetween(LocalDate dataInicio, LocalDate dataFim);
}