package com.ifpr.backend.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.model.Usuario;
import com.ifpr.backend.repository.UsuarioRepository;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository repository;

    public Usuario inserir (Usuario usuario){
        return repository.save(usuario);
    }

    public List<Usuario> listarTodos (){
        return repository.findAll();
    }
    public Usuario bucarPorId (Long id){
        Usuario usuario = repository.findById(id).orElseThrow(()->new RuntimeException("Usuario não existe"));
        return usuario;
    }
    public void remover (Long id){
        Usuario usuario = bucarPorId(id);
        repository.delete(usuario);
    }
    public Usuario alterar (Usuario usuario){
        Usuario usuarioBD = bucarPorId(usuario.getId());
        usuarioBD.setNome(usuario.getNome());
        usuarioBD.setEmail(usuario.getEmail());
        return repository.save(usuarioBD);

    }
}
