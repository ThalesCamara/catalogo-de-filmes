package com.thales.catalogofilmes.service;

import com.thales.catalogofilmes.model.UsuarioFavorito;
import com.thales.catalogofilmes.model.UsuarioFavoritoId;
import com.thales.catalogofilmes.model.Filme;
import com.thales.catalogofilmes.dao.UsuarioFavoritoDAO;
import com.thales.catalogofilmes.dao.FilmeDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsuarioFavoritoService {

    @Autowired
    private UsuarioFavoritoDAO usuarioFavoritoDAO;

    @Autowired
    private FilmeDAO filmeDAO;

    public UsuarioFavorito adicionarFavorito(UsuarioFavorito favorito) {

        UsuarioFavoritoId id = new UsuarioFavoritoId(
                favorito.getUsuarioId(),
                favorito.getFilmeId()
        );

        if(usuarioFavoritoDAO.existsById(id)){
            throw new RuntimeException("Filme já está nos favoritos");
        }

        return usuarioFavoritoDAO.save(favorito);
    }

    public List<Filme> listarFavoritosUsuario(Integer usuarioId) {

        List<UsuarioFavorito> favoritos =
                usuarioFavoritoDAO.findByUsuarioId(usuarioId);

        List<Filme> filmes = new ArrayList<>();

        for(UsuarioFavorito favorito : favoritos){

            Filme filme = filmeDAO.findById(favorito.getFilmeId()).orElse(null);

            if(filme != null){
                filmes.add(filme);
            }
        }

        return filmes;
    }

    public void removerFavorito(Integer usuarioId, Integer filmeId) {

        UsuarioFavoritoId id = new UsuarioFavoritoId(usuarioId, filmeId);

        usuarioFavoritoDAO.deleteById(id);
    }
}