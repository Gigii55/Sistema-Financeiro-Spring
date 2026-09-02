package com.ifpr.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ifpr.backend.entity.Categoria;
import com.ifpr.backend.repository.CategoriaRepository;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository repository;

    public Categoria inserir(Categoria categoria) {
        return repository.save(categoria);
    }

    public List<Categoria> listarTodos() {
        return repository.findAll();
    }

    public Categoria buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
    }

    public void remover(Long id) {
        Categoria categoria = buscarPorId(id);
        repository.delete(categoria);
    }

    public Categoria alterar(Categoria categoria) {
        
        Categoria categoriaBD = buscarPorId(categoria.getId());

        categoriaBD.setUsuario(categoria.getUsuario());
        categoriaBD.setNome(categoria.getNome());
        categoriaBD.setTipo(categoria.getTipo());
        categoriaBD.setCor(categoria.getCor());
        categoriaBD.setIcone(categoria.getIcone());

        return repository.save(categoriaBD);
    }
}