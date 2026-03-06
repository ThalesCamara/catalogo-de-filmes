package com.thales.catalogofilmes.model;

import java.io.Serializable;
import java.util.Objects;

public class UsuarioFavoritoId implements Serializable {

    private Integer usuarioId;
    private Integer filmeId;

    public UsuarioFavoritoId() {}

    public UsuarioFavoritoId(Integer usuarioId, Integer filmeId) {
        this.usuarioId = usuarioId;
        this.filmeId = filmeId;
    }

    public Integer getUsuarioId() {
        return usuarioId;
    }

    public Integer getFilmeId() {
        return filmeId;
    }

    public void setUsuarioId(Integer usuarioId) {
        this.usuarioId = usuarioId;
    }

    public void setFilmeId(Integer filmeId) {
        this.filmeId = filmeId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UsuarioFavoritoId that = (UsuarioFavoritoId) o;

        return Objects.equals(usuarioId, that.usuarioId) &&
               Objects.equals(filmeId, that.filmeId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(usuarioId, filmeId);
    }
}