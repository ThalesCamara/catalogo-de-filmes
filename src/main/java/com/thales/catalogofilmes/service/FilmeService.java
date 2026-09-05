package com.thales.catalogofilmes.service;

import com.thales.catalogofilmes.dao.FilmeDAO;
import com.thales.catalogofilmes.dao.UsuarioFavoritoDAO;
import com.thales.catalogofilmes.model.Filme;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FilmeService {

    private final FilmeDAO filmeDAO;
    private final UsuarioFavoritoDAO usuarioFavoritoDAO;

    // Injeção de dependência via construtor (melhor prática)
    public FilmeService(FilmeDAO filmeDAO, UsuarioFavoritoDAO usuarioFavoritoDAO) {
        this.filmeDAO = filmeDAO;
        this.usuarioFavoritoDAO = usuarioFavoritoDAO;
    }

    // 🎬 Criar filme
    public Filme criarFilme(Filme filme) {
        return filmeDAO.save(filme);
    }

    // 📚 Listar todos
    public List<Filme> listarTodos() {
        return filmeDAO.findAll();
    }

    // 🔍 Buscar por ID
    public Optional<Filme> buscarPorId(int id) {
        return filmeDAO.findById(id);
    }

    // ✏️ Atualizar filme
    public Filme atualizarFilme(int id, Filme filmeAtualizado) {
        Optional<Filme> filmeExistente = filmeDAO.findById(id);

        if (filmeExistente.isEmpty()) {
            throw new RuntimeException("Filme não encontrado");
        }

        Filme filme = filmeExistente.get();

        filme.setTitulo(filmeAtualizado.getTitulo());
        filme.setDescricao(filmeAtualizado.getDescricao());
        filme.setGenero(filmeAtualizado.getGenero());
        filme.setDataLancamento(filmeAtualizado.getDataLancamento());
        filme.setCapaUrl(filmeAtualizado.getCapaUrl());
        filme.setCreatedAt(filmeAtualizado.getCreatedAt());

        return filmeDAO.save(filme);
    }

    // 🗑️ Deletar filme
    @Transactional
    public void deletarFilme(int id) {
        Optional<Filme> filme = filmeDAO.findById(id);

        if (filme.isEmpty()) {
            throw new RuntimeException("Filme não encontrado");
        }

        usuarioFavoritoDAO.deleteByFilmeId(id);
        filmeDAO.deleteById(id);
    }
}
