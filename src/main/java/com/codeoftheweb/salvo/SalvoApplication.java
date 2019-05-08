package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java. util. Date;
import java. sql. Timestamp;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class);
	}

	@Bean
	public CommandLineRunner initPlayers(PlayerRepository repository) {
		return (args) -> {
			repository.save(new Player("fake@notreal.com"));
			repository.save(new Player("sorry@disingenuous.edu"));
			repository.save(new Player("no@none.org"));
			repository.save(new Player("so@what.io"));
			repository.save(new Player("false@bool.ox.ac.uk"));
		};
	}
	@Bean
	public CommandLineRunner initGames(GameRepository repository) {
		return (args) -> {
			repository.save(new Game("2/17/2018:4:20:15 PM"));
			repository.save(new Game("2/17/2018:4:20:15 PM"));
			repository.save(new Game("2/17/2018:4:20:15 PM"));
			repository.save(new Game("2/17/2018:4:20:15 PM"));
			repository.save(new Game("2/17/2018:4:20:15 PM"));
		};
	}
}
