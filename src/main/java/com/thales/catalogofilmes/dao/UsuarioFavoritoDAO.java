package com.thales.catalogofilmes.dao;

import com.thales.catalogofilmes.model.UsuarioFavorito;
import com.thales.catalogofilmes.model.UsuarioFavoritoId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UsuarioFavoritoDAO extends JpaRepository<UsuarioFavorito, UsuarioFavoritoId> {

    List<UsuarioFavorito> findByUsuarioId(Integer usuarioId);

}