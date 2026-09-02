package com.ifpr.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ifpr.backend.entity.TokenRedefinicaoSenha;
import com.ifpr.backend.entity.Usuario;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class RecuperacaoSenhaService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private TokenRedefinicaoSenhaService tokenService;

    @Autowired
    private EmailService emailService;

    public void solicitarRecuperacao(String email) {

        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);

        if (usuario == null) {
            return;
        }

        TokenRedefinicaoSenha token = tokenService.gerarToken(usuario);

        String link = "http://localhost:5173/codigo?token="+ token.getToken();

        emailService.enviarRecuperacaoSenha(usuario.getEmail(),link);
    }

    @Transactional
    public void redefinirSenha( String codigo,String novaSenha) {

        TokenRedefinicaoSenha token = tokenService.buscarTokenValido(codigo);

        Usuario usuario = token.getUsuario();

        usuario.setSenha(novaSenha);
        usuarioRepository.save(usuario);

        tokenService.marcarComoUtilizado(token);
    }
}