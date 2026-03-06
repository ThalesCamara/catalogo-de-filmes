package com.thales.catalogofilmes.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {

    public static void load() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        if (dotenv.get("DB_URL") != null) {
            System.setProperty("DB_URL", dotenv.get("DB_URL"));
        }

        if (dotenv.get("DB_USERNAME") != null) {
            System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        }

        if (dotenv.get("DB_PASSWORD") != null) {
            System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
        }
    }
}