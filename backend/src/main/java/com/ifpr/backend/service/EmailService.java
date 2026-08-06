package com.ifpr.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarRecuperacaoSenha(String destinatario, String link) {

        SimpleMailMessage mensagem = new SimpleMailMessage();

        mensagem.setFrom("gigibernadelli001@gmail.com");
        mensagem.setTo(destinatario);
        mensagem.setSubject("Redefinição de senha - Astrotech");
        mensagem.setText(
            "Clique no link para redefinir sua senha:\n\n"
            + link
            + "\n\nO link expira em 1 hora."
        );

        mailSender.send(mensagem);
    }
}