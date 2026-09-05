package com.thales.catalogofilmes;

import com.thales.catalogofilmes.dao.FilmeDAO;
import com.thales.catalogofilmes.dao.UsuarioDAO;
import com.thales.catalogofilmes.model.Filme;
import com.thales.catalogofilmes.model.Usuario;
import com.thales.catalogofilmes.model.UsuarioFavorito;
import com.thales.catalogofilmes.service.UsuarioFavoritoService;
import com.thales.catalogofilmes.service.FilmeService;
import com.thales.catalogofilmes.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class CatalogoFilmesApplicationTests {

	@Autowired
	private UsuarioService usuarioService;

	@Autowired
	private UsuarioDAO usuarioDAO;

	@Autowired
	private FilmeDAO filmeDAO;

	@Autowired
	private UsuarioFavoritoService usuarioFavoritoService;

	@Autowired
	private FilmeService filmeService;

	@Test
	void contextLoads() {
	}

	@Test
	void cadastraEFazLoginComSenhaCriptografada() {
		Usuario novoUsuario = new Usuario();
		novoUsuario.setNome("Usuário Teste");
		novoUsuario.setEmail("novo@teste.com");
		novoUsuario.setSenhaHash("senha123");

		Usuario salvo = usuarioService.salvar(novoUsuario);
		assertNotEquals("senha123", salvo.getSenhaHash());
		assertEquals(salvo.getId(), usuarioService.login("NOVO@TESTE.COM", "senha123").getId());
	}

	@Test
	void migraSenhaAntigaNoPrimeiroLogin() {
		Usuario usuarioAntigo = new Usuario();
		usuarioAntigo.setNome("Usuário Antigo");
		usuarioAntigo.setEmail("antigo@teste.com");
		usuarioAntigo.setSenhaHash("senha-antiga");
		Usuario salvo = usuarioDAO.save(usuarioAntigo);

		usuarioService.login("antigo@teste.com", "senha-antiga");

		assertNotEquals("senha-antiga", usuarioDAO.findById(salvo.getId()).orElseThrow().getSenhaHash());
	}

	@Test
	void adicionaListaERemoveFavorito() {
		Usuario usuario = new Usuario();
		usuario.setNome("Usuário Favoritos");
		usuario.setEmail("favoritos@teste.com");
		usuario.setSenhaHash("senha123");
		usuario = usuarioService.salvar(usuario);

		Filme filme = new Filme();
		filme.setTitulo("Filme de Teste");
		filme.setGenero("Teste");
		filme = filmeDAO.save(filme);

		UsuarioFavorito favorito = new UsuarioFavorito();
		favorito.setUsuarioId(usuario.getId());
		favorito.setFilmeId(filme.getId());
		usuarioFavoritoService.adicionarFavorito(favorito);

		assertEquals(filme.getId(), usuarioFavoritoService.listarFavoritosUsuario(usuario.getId()).getFirst().getId());

		usuarioFavoritoService.removerFavorito(usuario.getId(), filme.getId());
		assertTrue(usuarioFavoritoService.listarFavoritosUsuario(usuario.getId()).isEmpty());
	}

	@Test
	void criaEditaEExcluiObraComTodosOsCampos() {
		Usuario usuario = new Usuario();
		usuario.setNome("Usuário Administrador");
		usuario.setEmail("administrador@teste.com");
		usuario.setSenhaHash("senha123");
		usuario = usuarioService.salvar(usuario);

		Filme obra = new Filme();
		obra.setTitulo("Obra Original");
		obra.setDescricao("Descrição original");
		obra.setGenero("Drama");
		obra.setDataLancamento(LocalDate.of(2020, 1, 2));
		obra.setCapaUrl("https://example.com/original.jpg");
		obra.setCreatedAt(LocalDateTime.of(2026, 1, 2, 3, 4, 5));
		obra = filmeService.criarFilme(obra);

		UsuarioFavorito favorito = new UsuarioFavorito();
		favorito.setUsuarioId(usuario.getId());
		favorito.setFilmeId(obra.getId());
		usuarioFavoritoService.adicionarFavorito(favorito);

		Filme alteracoes = new Filme();
		alteracoes.setTitulo("Obra Atualizada");
		alteracoes.setDescricao("Descrição atualizada");
		alteracoes.setGenero("Ficção científica");
		alteracoes.setDataLancamento(LocalDate.of(2025, 5, 6));
		alteracoes.setCapaUrl("https://example.com/atualizada.jpg");
		alteracoes.setCreatedAt(LocalDateTime.of(2026, 7, 8, 9, 10, 11));

		Filme atualizada = filmeService.atualizarFilme(obra.getId(), alteracoes);
		assertEquals("Obra Atualizada", atualizada.getTitulo());
		assertEquals("Descrição atualizada", atualizada.getDescricao());
		assertEquals("Ficção científica", atualizada.getGenero());
		assertEquals(LocalDate.of(2025, 5, 6), atualizada.getDataLancamento());
		assertEquals("https://example.com/atualizada.jpg", atualizada.getCapaUrl());
		assertEquals(LocalDateTime.of(2026, 7, 8, 9, 10, 11), atualizada.getCreatedAt());

		filmeService.deletarFilme(obra.getId());
		assertFalse(filmeDAO.existsById(obra.getId()));
		assertTrue(usuarioFavoritoService.listarFavoritosUsuario(usuario.getId()).isEmpty());
	}

}
