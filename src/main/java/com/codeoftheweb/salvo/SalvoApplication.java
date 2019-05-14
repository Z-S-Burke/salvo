package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;

import java. util. Date;
import java. sql. Timestamp;

@SpringBootApplication
public class SalvoApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository) {
		return (args) -> {
			Player p1 = new Player("p1@p1.com");
			playerRepository.save(p1);
			Player p2 = new Player("p2@p2.com");
			playerRepository.save(p2);
			Player p3 = new Player("p3@p3.com");
			playerRepository.save(p3);

			Date creationDate = new Date();
			System.out.println(creationDate);
			Game g1 = new Game(creationDate);
			gameRepository.save(g1);
			Game g2 = new Game(creationDate);
			gameRepository.save(g2);

			GamePlayer gp1 = new GamePlayer(g1, p1);
			gamePlayerRepository.save(gp1);

			System.out.println(gp1.getPlayer());
		};
	}
}
