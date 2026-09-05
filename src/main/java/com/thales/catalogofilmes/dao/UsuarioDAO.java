package com.thales.catalogofilmes.dao;

import com.thales.catalogofilmes.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioDAO extends JpaRepository<Usuario, Integer> {

    Usuario findByEmailIgnoreCase(String email);

}
