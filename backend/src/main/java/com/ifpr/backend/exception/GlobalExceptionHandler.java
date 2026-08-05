package com.ifpr.backend.exception;

import java.time.LocalDateTime;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 404 - recurso não encontrado
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErroResposta> tratarResourceNotFound(
            ResourceNotFoundException ex) {

        ErroResposta erro = new ErroResposta(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(erro);
    }

    // 422 - regra de negócio violada
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErroResposta> tratarBusinessException(
            BusinessException ex) {

        ErroResposta erro = new ErroResposta(
                HttpStatus.UNPROCESSABLE_ENTITY.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(erro);
    }

    // 403 - usuário sem permissão
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroResposta> tratarAccessDenied(
            AccessDeniedException ex) {

        ErroResposta erro = new ErroResposta(
                HttpStatus.FORBIDDEN.value(),
                "Você não possui permissão para realizar esta operação",
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(erro);
    }

    // 400 - campos inválidos
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> tratarValidacao(
            MethodArgumentNotValidException ex) {

        String mensagem = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(erro -> erro.getField()
                        + ": "
                        + erro.getDefaultMessage())
                .orElse("Dados inválidos");

        ErroResposta erro = new ErroResposta(
                HttpStatus.BAD_REQUEST.value(),
                mensagem,
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(erro);
    }

    // 409 - conflito no banco, como e-mail duplicado
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResposta> tratarIntegridadeDosDados(
            DataIntegrityViolationException ex) {

        ErroResposta erro = new ErroResposta(
                HttpStatus.CONFLICT.value(),
                "O e-mail informado já está cadastrado",
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(erro);
    }

    // 500 - qualquer erro não tratado anteriormente
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> tratarException(
            Exception ex) {

        ErroResposta erro = new ErroResposta(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Erro interno do servidor",
                LocalDateTime.now()
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(erro);
    }
}