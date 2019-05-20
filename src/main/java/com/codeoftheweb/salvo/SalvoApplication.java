package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;

import java. util. Date;
import java. sql. Timestamp;
import java.util.HashSet;
import java.util.Set;

@SpringBootApplication
public class SalvoApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository) {
		return (args) -> {
			Player p1 = new Player("p1@p1.com");
			playerRepository.save(p1);
			Player p2 = new Player("p2@p2.com");
			playerRepository.save(p2);
			Player p3 = new Player("p3@p3.com");
			playerRepository.save(p3);

			Date creationDate = new Date();
			Game g1 = new Game(creationDate);
			gameRepository.save(g1);
			Game g2 = new Game(creationDate);
			gameRepository.save(g2);

			GamePlayer gp1 = new GamePlayer(g1, p1);
			gamePlayerRepository.save(gp1);
			GamePlayer gp2 = new GamePlayer(g1, p2);
			gamePlayerRepository.save(gp2);
			GamePlayer gp3 = new GamePlayer(g2, p3);
			gamePlayerRepository.save(gp3);

			Set<String> location1 = new HashSet<>();
			location1.add("A1");
			location1.add("A2");
			location1.add("A3");

			Ship s1 = new Ship ("Cruiser", location1);
			shipRepository.save(s1);

		};
	}
}
