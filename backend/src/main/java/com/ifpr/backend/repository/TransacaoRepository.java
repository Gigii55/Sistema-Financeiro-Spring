package com.ifpr.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ifpr.backend.entity.Transacao;
import com.ifpr.backend.entity.enums.TipoTransacao;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    
    List<Transacao> findByCriadoPorId(Long usuarioId);
    Page<Transacao> findByCriadoPorId(Long usuarioId, Pageable pageable);
    
    List<Transacao> findByCriadoPorIdAndTipo(Long usuarioId, TipoTransacao tipo);
    List<Transacao> findByCriadoPorIdAndCategoriaId(Long usuarioId, Long categoriaId);
    List<Transacao> findByCriadoPorIdAndDataBetween(Long usuarioId, LocalDate dataInicio, LocalDate dataFim);
}