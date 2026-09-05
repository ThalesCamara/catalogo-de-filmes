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

        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new IllegalArgumentException("Informe seu nome.");
        }

        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("Informe seu e-mail.");
        }

        if (usuario.getSenhaHash() == null || usuario.getSenhaHash().length() < 6) {
            throw new IllegalArgumentException("A senha deve ter pelo menos 6 caracteres.");
        }

        String email = usuario.getEmail().trim().toLowerCase();

        if (usuarioDAO.findByEmailIgnoreCase(email) != null) {
            throw new IllegalArgumentException("Já existe uma conta com este e-mail.");
        }

        usuario.setNome(usuario.getNome().trim());
        usuario.setEmail(email);

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

        if (email == null || senha == null) {
            throw new RuntimeException("E-mail e senha são obrigatórios");
        }

        Usuario usuario = usuarioDAO.findByEmailIgnoreCase(email.trim());

        if(usuario == null){
            throw new RuntimeException("Usuário não encontrado");
        }

        String senhaArmazenada = usuario.getSenhaHash();
        boolean senhaComBcrypt = senhaArmazenada != null && senhaArmazenada.matches("^\\$2[aby]\\$.*");
        boolean senhaValida = senhaComBcrypt
                ? passwordEncoder.matches(senha, senhaArmazenada)
                : senha.equals(senhaArmazenada);

        if(!senhaValida){
            throw new RuntimeException("Senha inválida");
        }

        if (!senhaComBcrypt) {
            usuario.setSenhaHash(passwordEncoder.encode(senha));
            usuario = usuarioDAO.save(usuario);
        }

        return usuario;
    }

}
