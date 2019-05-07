package com.codeoftheweb.salvo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository repository) {
		return (args) -> {
			repository.save(new Player("fake@notreal.com"));
			repository.save(new Player("sorry@disingenuous.edu"));
			repository.save(new Player("no@none.org"));
			repository.save(new Player("so@what.io"));
			repository.save(new Player("false@bool.ox.ac.uk"));
		};
	}
}
