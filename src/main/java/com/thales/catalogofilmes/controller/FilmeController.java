package com.thales.catalogofilmes.controller;

import com.thales.catalogofilmes.model.Filme;
import com.thales.catalogofilmes.service.FilmeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/filmes")
public class FilmeController {

    private final FilmeService filmeService;

    public FilmeController(FilmeService filmeService) {
        this.filmeService = filmeService;
    }

    @PostMapping
    public ResponseEntity<Filme> criar(@RequestBody Filme filme) {
        Filme novoFilme = filmeService.criarFilme(filme);
        return ResponseEntity.ok(novoFilme);
    }

    @GetMapping
    public ResponseEntity<List<Filme>> listar() {
        return ResponseEntity.ok(filmeService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable int id) {

        Optional<Filme> filme = filmeService.buscarPorId(id);

        if (filme.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(filme.get());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable int id, @RequestBody Filme filme) {

        try {
            Filme atualizado = filmeService.atualizarFilme(id, filme);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id) {

        try {
            filmeService.deletarFilme(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }

    }

}