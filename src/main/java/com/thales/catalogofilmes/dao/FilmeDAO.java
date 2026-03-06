package com.thales.catalogofilmes.dao;

import com.thales.catalogofilmes.model.Filme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilmeDAO extends JpaRepository<Filme, Integer> {
}