package com.thales.catalogofilmes.service;

import com.thales.catalogofilmes.model.Usuario;
import com.thales.catalogofilmes.dao.UsuarioDAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioDAO usuarioDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos() {
        return usuarioDAO.findAll();
    }

    public Usuario buscarPorId(Integer id) {
        return usuarioDAO.findById(id).orElse(null);
    }

    public Usuario salvar(Usuario usuario) {

        if(usuario.getCreatedAt() == null){
            usuario.setCreatedAt(LocalDateTime.now());
        }

        String senhaHash = passwordEncoder.encode(usuario.getSenhaHash());
        usuario.setSenhaHash(senhaHash);

        return usuarioDAO.save(usuario);
    }

    public Usuario atualizar(Integer id, Usuario usuarioAtualizado) {

        Usuario usuario = usuarioDAO.findById(id).orElse(null);

        if(usuario == null){
            return null;
        }

        usuario.setNome(usuarioAtualizado.getNome());
        usuario.setEmail(usuarioAtualizado.getEmail());

        if(usuarioAtualizado.getSenhaHash() != null && !usuarioAtualizado.getSenhaHash().isEmpty()){
            String senhaHash = passwordEncoder.encode(usuarioAtualizado.getSenhaHash());
            usuario.setSenhaHash(senhaHash);
        }

        return usuarioDAO.save(usuario);
    }

    public void deletar(Integer id) {
        usuarioDAO.deleteById(id);
    }

    public Usuario login(String email, String senha){

        Usuario usuario = usuarioDAO.findByEmail(email);

        if(usuario == null){
            throw new RuntimeException("Usuário não encontrado");
        }

        if(!passwordEncoder.matches(senha, usuario.getSenhaHash())){
            throw new RuntimeException("Senha inválida");
        }

        return usuario;
    }

}