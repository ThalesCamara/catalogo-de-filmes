package com.thales.catalogofilmes.controller;

import com.thales.catalogofilmes.model.UsuarioFavorito;
import com.thales.catalogofilmes.model.Filme;
import com.thales.catalogofilmes.service.UsuarioFavoritoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favoritos")
public class UsuarioFavoritoController {

    @Autowired
    private UsuarioFavoritoService usuarioFavoritoService;

    @PostMapping
    public ResponseEntity<UsuarioFavorito> adicionarFavorito(@RequestBody UsuarioFavorito favorito) {

        UsuarioFavorito novo = usuarioFavoritoService.adicionarFavorito(favorito);
        return ResponseEntity.ok(novo);

    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<List<Filme>> listarFavoritos(@PathVariable Integer usuarioId) {

        return ResponseEntity.ok(usuarioFavoritoService.listarFavoritosUsuario(usuarioId));

    }

    @DeleteMapping("/{usuarioId}/{filmeId}")
    public ResponseEntity<Void> removerFavorito(
            @PathVariable Integer usuarioId,
            @PathVariable Integer filmeId) {

        usuarioFavoritoService.removerFavorito(usuarioId, filmeId);

        return ResponseEntity.noContent().build();
    }
}