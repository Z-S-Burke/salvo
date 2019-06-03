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
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
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
			location1.add("E7");location1.add("E8"); location1.add("E9");location1.add("E10");

			Set<String> location2 = new HashSet<>();
			location2.add("B1"); location2.add("B2"); location2.add("B3");

			Set<String> location3 = new HashSet<>();
			location3.add("J2"); location3.add("I2"); location3.add("H2"); location3.add("G2");

			Set<String> location4 = new HashSet<>();
			location4.add("D5"); location4.add("C5"); location4.add("E5");


			Ship s1 = new Ship ("Cruiser", location1);
			Ship s2 = new Ship ("Destroyer", location2);
			Ship s3 = new Ship ("Submarine", location4);
			Ship s4 = new Ship ("AirCraft Carrier", location3);

			Ship s5 = new Ship ("Cruiser", location1);
			Ship s6 = new Ship ("Destroyer", location2);
			Ship s7 = new Ship ("Submarine", location4);
			Ship s8 = new Ship ("AirCraft Carrier", location3);

			Salvo shot1 = new Salvo (1, "H2", gp1);
			Salvo shot2 = new Salvo (2, "I2", gp1);
			Salvo shot3 = new Salvo (3, "J2", gp1);
			Salvo shot = new Salvo(4, "A10", gp1);
			Salvo shot4 = new Salvo (1, "E10", gp2);
			Salvo shot5 = new Salvo (2, "J3", gp2);
			Salvo shot6 = new Salvo (3, "C8", gp2);
			salvoRepository.save(shot1);
			salvoRepository.save(shot2);
			salvoRepository.save(shot3);
			salvoRepository.save(shot4);
			salvoRepository.save(shot5);
			salvoRepository.save(shot6);
			salvoRepository.save(shot);


			shipRepository.save(s1); shipRepository.save(s2); shipRepository.save(s3); shipRepository.save(s4);
			gp1.addShip(s1);
			gp1.addShip(s2);
			gp1.addShip(s4);
			gp1.addShip(s3);
			gp2.addShip(s5);
			gp2.addShip(s6);
			gp2.addShip(s7);
			gp2.addShip(s8);
			shipRepository.save(s2);
			shipRepository.save(s1);
			shipRepository.save(s3);
			shipRepository.save(s4);
			shipRepository.save(s5); shipRepository.save(s6); shipRepository.save(s7); shipRepository.save(s8);
			gamePlayerRepository.save(gp1);
			gamePlayerRepository.save(gp2);
			gamePlayerRepository.save(gp3);

			Date finishDate = new Date();
			Score g1p1s = new Score(p1, g1, 1, finishDate);
			scoreRepository.save(g1p1s);
		};
	}
}
