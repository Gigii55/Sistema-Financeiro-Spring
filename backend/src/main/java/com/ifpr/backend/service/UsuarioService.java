package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.entity.Carteira;
import com.ifpr.backend.entity.Usuario;
import com.ifpr.backend.repository.CarteiraRepository;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private CarteiraService carteiraService;

    @Autowired
    private CarteiraRepository carteiraRepository;

    public Usuario inserir(Usuario usuario) {

        Usuario usuarioSalvo = repository.save(usuario);

        Carteira carteira = new Carteira();
        carteira.setDono(usuarioSalvo);
        carteira.setNome("Minha Carteira");
        carteira.setDescricao("Carteira padrão criada automaticamente no cadastro");
        carteira.setDono(usuarioSalvo);
        carteiraService.inserir(carteira);
        carteiraRepository.save(carteira);
        return usuarioSalvo;
    }

    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public void remover(Long id) {
        Usuario usuario = buscarPorId(id);
        repository.delete(usuario);
    }

    public Usuario alterar(Usuario usuario) {
        
        Usuario usuarioBD = buscarPorId(usuario.getId());

        usuarioBD.setNome(usuario.getNome());
        usuarioBD.setEmail(usuario.getEmail());
        usuarioBD.setSenha(usuario.getSenha());

        return repository.save(usuarioBD);
    }

    public boolean emailJaCadastrado(String email) {
        return repository.existsByEmail(email);
    }

    public Usuario login(String email, String senha) {

        Usuario usuario = repository.findByEmail(email).orElse(null);

        if (usuario == null) {
            return null;
        }

        if (!usuario.getSenha().equals(senha)) {
            return null;
        }

        return usuario;
    }

    public boolean alterarSenha(String email, String senhaAtual, String novaSenha) {

        Usuario usuario = repository.findByEmail(email).orElse(null);

        if (usuario == null) {
            return false;
        }

        if (!usuario.getSenha().equals(senhaAtual)) {
            return false;
        }

        usuario.setSenha(novaSenha);
        repository.save(usuario);

        return true;
    }
}