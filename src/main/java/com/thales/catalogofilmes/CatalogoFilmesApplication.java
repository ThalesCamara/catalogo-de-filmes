package com.thales.catalogofilmes;

import com.thales.catalogofilmes.config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class CatalogoFilmesApplication {

	public static void main(String[] args) {
    EnvConfig.load();
    SpringApplication.run(CatalogoFilmesApplication.class, args);
}

}
