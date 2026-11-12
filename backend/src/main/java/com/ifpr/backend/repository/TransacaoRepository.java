
package com.ifpr.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ifpr.backend.entity.Transacao;
import com.ifpr.backend.entity.enums.TipoTransacao;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

  @Query("SELECT t FROM Transacao t WHERE " + "t.carteira.dono.id = :usuarioId OR " + "EXISTS (SELECT m.id FROM CarteiraMembro m " +
         "WHERE m.carteira.id = t.carteira.id AND m.usuario.id = :usuarioId)")
         
  List<Transacao> buscarTransacoesDoUsuario(@Param("usuarioId") Long usuarioId);

  @Query("SELECT t FROM Transacao t WHERE " + "t.carteira.dono.id = :usuarioId OR " +"EXISTS (SELECT m.id FROM CarteiraMembro m " +
         "WHERE m.carteira.id = t.carteira.id AND m.usuario.id = :usuarioId)")

  Page<Transacao> buscarPaginadoDoUsuario(@Param("usuarioId") Long usuarioId,Pageable pageable);

  @Query("SELECT t FROM Transacao t WHERE " +"t.carteira.id = :carteiraId AND " +"(t.carteira.dono.id = :usuarioId OR " +
   "EXISTS (SELECT m.id FROM CarteiraMembro m " + "WHERE m.carteira.id = t.carteira.id AND m.usuario.id = :usuarioId))")

  Page<Transacao> buscarPaginadoPorCarteira(@Param("usuarioId") Long usuarioId,@Param("carteiraId") UUID carteiraId,Pageable pageable);

  @Query("SELECT t FROM Transacao t WHERE " +"t.tipo = :tipo AND " + "(t.carteira.dono.id = :usuarioId OR " +
         "EXISTS (SELECT m.id FROM CarteiraMembro m " +"WHERE m.carteira.id = t.carteira.id AND m.usuario.id = :usuarioId))")

  List<Transacao> buscarPorTipo( @Param("usuarioId") Long usuarioId,@Param("tipo") TipoTransacao tipo);

  @Query("SELECT t FROM Transacao t WHERE " +"t.categoria.id = :categoriaId AND " + "(t.carteira.dono.id = :usuarioId OR " +
  "EXISTS (SELECT m.id FROM CarteiraMembro m " + "WHERE m.carteira.id = t.carteira.id AND m.usuario.id = :usuarioId))")

  List<Transacao> buscarPorCategoria(@Param("usuarioId") Long usuarioId,@Param("categoriaId") Long categoriaId);

  @Query("SELECT t FROM Transacao t WHERE " + "t.data BETWEEN :dataInicio AND :dataFim AND " + "(t.carteira.dono.id = :usuarioId OR " +
  "EXISTS (SELECT m.id FROM CarteiraMembro m " + "WHERE m.carteira.id = t.carteira.id AND m.usuario.id = :usuarioId))")
  List<Transacao> buscarPorPeriodo(@Param("usuarioId") Long usuarioId,@Param("dataInicio") LocalDate dataInicio,@Param("dataFim") LocalDate dataFim);
}
