package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configurers.GlobalAuthenticationConfigurerAdapter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.WebAttributes;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java. util. Date;
import java.util.HashSet;
import java.util.Set;

//import static org.hibernate.cfg.AvailableSettings.USER;

@SpringBootApplication
public class SalvoApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository) {
		return (args) -> {

			Player p1 = new Player("p1@p1.com", "Password1");
			playerRepository.save(p1);
			Player p2 = new Player("p2@p2.com", "Password2");
			playerRepository.save(p2);
			Player p3 = new Player("p3@p3.com", "Password3");
			playerRepository.save(p3);
//
//			Date creationDate = new Date();
//			SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
//			String strDate = dateFormat.format(creationDate);
//			Game g1 = new Game(strDate);
//			gameRepository.save(g1);
//			Game g2 = new Game(strDate);
//			gameRepository.save(g2);
//			Game g3 = new Game(strDate);
//			gameRepository.save(g3);
//			Game g4 = new Game(strDate);
//			gameRepository.save(g4);
//
//			GamePlayer gp1 = new GamePlayer(g1, p1);
//			gamePlayerRepository.save(gp1);
//			GamePlayer gp2 = new GamePlayer(g1, p2);
//			gamePlayerRepository.save(gp2);
//			GamePlayer gp3 = new GamePlayer(g2, p3);
//			gamePlayerRepository.save(gp3);
//			GamePlayer gp4 = new GamePlayer(g2, p1);
//			gamePlayerRepository.save(gp4);
//			GamePlayer gp5 = new GamePlayer(g3, p1);
//			gamePlayerRepository.save(gp5);
//			GamePlayer gp6 = new GamePlayer(g3, p2);
//			gamePlayerRepository.save(gp6);
//			GamePlayer gp7 = new GamePlayer(g4, p1);
//			gamePlayerRepository.save(gp7);
//			GamePlayer gp8 = new GamePlayer(g4, p2);
//			gamePlayerRepository.save(gp8);
//
//
//			Set<String> location1 = new HashSet<>();
//			location1.add("E7");location1.add("E8"); location1.add("E9");location1.add("E10");
//
//			Set<String> location2 = new HashSet<>();
//			location2.add("B1"); location2.add("B2"); location2.add("B3");
//
//			Set<String> location3 = new HashSet<>();
//			location3.add("J2"); location3.add("I2"); location3.add("H2"); location3.add("G2");
//
//			Set<String> location4 = new HashSet<>();
//			location4.add("D5"); location4.add("C5"); location4.add("E5");
//
//
//			Ship s1 = new Ship ("Cruiser", location1);
//			Ship s2 = new Ship ("Destroyer", location2);
//			Ship s3 = new Ship ("Submarine", location4);
//			Ship s4 = new Ship ("AirCraft Carrier", location3);
//
//			Ship s5 = new Ship ("Cruiser", location1);
//			Ship s6 = new Ship ("Destroyer", location2);
//			Ship s7 = new Ship ("Submarine", location4);
//			Ship s8 = new Ship ("AirCraft Carrier", location3);
//
//			Salvo shot1 = new Salvo (1, "H2", gp1);
//			Salvo shot2 = new Salvo (2, "I2", gp1);
//			Salvo shot3 = new Salvo (3, "J2", gp1);
//			Salvo shot = new Salvo(4, "A10", gp1);
//			Salvo shot4 = new Salvo (1, "E10", gp2);
//			Salvo shot5 = new Salvo (2, "J3", gp2);
//			Salvo shot6 = new Salvo (3, "C8", gp2);
//			salvoRepository.save(shot1);
//			salvoRepository.save(shot2);
//			salvoRepository.save(shot3);
//			salvoRepository.save(shot4);
//			salvoRepository.save(shot5);
//			salvoRepository.save(shot6);
//			salvoRepository.save(shot);
//
//
//			shipRepository.save(s1); shipRepository.save(s2); shipRepository.save(s3); shipRepository.save(s4);
//			gp1.addShip(s1);
//			gp1.addShip(s2);
//			gp1.addShip(s4);
//			gp1.addShip(s3);
//			gp2.addShip(s5);
//			gp2.addShip(s6);
//			gp2.addShip(s7);
//			gp2.addShip(s8);
//			shipRepository.save(s2);
//			shipRepository.save(s1);
//			shipRepository.save(s3);
//			shipRepository.save(s4);
//			shipRepository.save(s5); shipRepository.save(s6); shipRepository.save(s7); shipRepository.save(s8);
//			gamePlayerRepository.save(gp1);
//			gamePlayerRepository.save(gp2);
//			gamePlayerRepository.save(gp3);
//
//			Date finishDate = new Date();
//			Score g1p1s = new Score(p1, g1, 1, finishDate);
//			scoreRepository.save(g1p1s);
//			Score g1p2s = new Score(p2, g1, 0, finishDate);
//			finishDate = new Date();
//			scoreRepository.save(g1p2s);
		};
	}
}

@Configuration
class WebSecurityConfiguration extends GlobalAuthenticationConfigurerAdapter {

	@Autowired
	private PlayerRepository playerRepository;

	@Override
	public void init(AuthenticationManagerBuilder auth) throws Exception { auth.userDetailsService(
			username -> {
				Player player = playerRepository.findByUsername(username);
				if (player != null) {
					return new User(player.getUsername(), player.getPassword(), AuthorityUtils.createAuthorityList("USER"));
				} else {
					throw new UsernameNotFoundException("Unknown User: " + username);
				}
			});
	};
	
	protected void configure(HttpSecurity http) throws Exception {
		http.requiresChannel()
				.requestMatchers(r -> r.getHeader("X-Forwarded-Proto") != null)
				.requiresSecure();
	}

};

@EnableWebSecurity
@Configuration
class WebAccessConfig extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {

		http.authorizeRequests()
				.antMatchers("/games.js").permitAll()
				.antMatchers("/games.html").permitAll()
				.antMatchers("/game_view.html").hasAnyAuthority("USER")
				.antMatchers("/game_view.js").permitAll()
				.antMatchers("/rest").permitAll()
				.antMatchers("/api").permitAll()
				.antMatchers("/login.html").permitAll()
				.antMatchers("/api/gameplayers").permitAll()
				.antMatchers("/api/players").permitAll()
//				.anyRequest().fullyAuthenticated()
				.and()
				.formLogin()
					.usernameParameter("username")
					.passwordParameter("password")
					.loginPage("/api/login")
//					.defaultSuccessUrl("/games.html")
				.and()
				.logout()
				.logoutUrl("/api/logout")
				.logoutSuccessUrl("/games.html");
		http.csrf().disable();


		// if user is not authenticated, just send an authentication failure response
		http.exceptionHandling().authenticationEntryPoint((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if login is successful, just clear the flags asking for authentication
		http.formLogin().successHandler((req, res, auth) -> clearAuthenticationAttributes(req));

		// if login fails, just send an authentication failure response
		http.formLogin().failureHandler((req, res, exc) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED));

		// if logout is successful, just send a success response
		http.logout().logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler());
	}

	private void clearAuthenticationAttributes(HttpServletRequest request) {
		HttpSession httpSession = request.getSession(false);
		if (httpSession != null) {
			httpSession.removeAttribute(WebAttributes.AUTHENTICATION_EXCEPTION);
		}
	}
}
