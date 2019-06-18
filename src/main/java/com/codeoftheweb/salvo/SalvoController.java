package com.codeoftheweb.salvo;

import org.springframework.context.annotation.Bean;
import org.springframework.security.core.Authentication;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@RestController
public class SalvoController {

    @Autowired
    private SalvoRepository salvoRepo;

    @Autowired
    private ScoreRepository scoreRepo;

    //GAME CONTROLLER CALLS
    @Autowired
    private GameRepository gameRepo;

    private String currentUser;


    @RequestMapping(value = "/api/username", method = RequestMethod.GET)
    @ResponseBody
    public Map currentUserName(Authentication authentication) {
        currentUser = authentication.getName();
        Player loggedPlayer = playerRepo.findByUsername(currentUser);
        Map<String, Object> currentUserMap = new LinkedHashMap<>();
        currentUserMap.put("username", loggedPlayer.getUsername());
        currentUserMap.put("id", loggedPlayer.getId());

        return currentUserMap;
    }

    @RequestMapping("/api/games")
    public Map<String, Object> getGames(Authentication authentication) {

        Map<String, Object> currentUserMap = new LinkedHashMap<>();
        currentUserMap.put("player", playerRepo.findByUsername(authentication.getName()));
        List<Map> gameList = new ArrayList<>();
        gameRepo.findAll().stream().forEach(oneGame -> {
            System.out.println("GAME LOOP");
            List<Map> gamePlayerList = new ArrayList<>();
            oneGame.getGamePlayers().stream().forEach(oneGamePlayer -> {
                System.out.println("GAMEPLAYER LOOP");
                gamePlayerList.add(mapGamePlayers(oneGamePlayer));
            });
            Map<String, Object> oneGameMap = mapGame(oneGame, gamePlayerList);
            System.out.println("ONE GAME MAP");
            gameList.add(oneGameMap);
        });
        System.out.println("RETURN GAME LIST");

        currentUserMap.put("games", gameList);

        return currentUserMap;
    }

    public static Map mapGame (Game game, List gamePlayerList) {
        Map<String, Object> oneGameMap = new LinkedHashMap<>();
        oneGameMap.put("gameID", game.getId());
        oneGameMap.put("dateCreated", game.getCreationDate());
        oneGameMap.put("gamePlayers", gamePlayerList);


        return oneGameMap;
    }

    public Player loggedInPlayer (Authentication authentication) {
        return playerRepo.findByUsername(authentication.getName());
    }

    public static Map mapGamePlayers (GamePlayer gamePlayer) {
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();
        gamePlayerMap.put("gamePlayerID", gamePlayer.getId());
        gamePlayerMap.put("player", mapGamePlayerPlayers(gamePlayer));

        return gamePlayerMap;
    }

    public static Map mapGamePlayerPlayers (GamePlayer gamePlayer) {
        Map<String, Object> playerMap = new LinkedHashMap<>();
        playerMap.put("username", gamePlayer.getPlayer().getUsername());
        playerMap.put("playerID", gamePlayer.getPlayer().getId());

        return playerMap;
    }

    //SCORE CONTROLLER CALLS
    @RequestMapping("/api/scoreboard")
    public List<Score> getScores() { return scoreRepo.findAll(); }

    //PLAYER CONTROLLER CALLS
    @Autowired
    private PlayerRepository playerRepo;

    @RequestMapping(value = "/api/playerList")
    public List<Player> getPlayers() {
        return playerRepo.findAll();
    }

    @RequestMapping(value = "/api/players")
    public Player newPlayerAuthorization(Authentication authentication) {
        Boolean isValid = playerRepo.findByUsername(authentication.getName()) == null ?  true : false;
        if (isValid) {
            Player newPlayer = null;
            newPlayer.setUsername(authentication.getName());
            System.out.println("This player has been created.");
            return newPlayer;
        }
        else {
            System.out.println("This player already exists.");
            return playerRepo.findByUsername(authentication.getName());
        }
    }

    public void addPlayer () {

    }

    @RequestMapping("/api/players/player_info")
    public List<Map> getPlayerIDs() {


        List<Map> playerList = new ArrayList<>();
        playerRepo.findAll().stream().forEach(onePlayer -> {
            Map<String, Object> onePlayerMap = new HashMap<>();
            onePlayerMap.put("Username:", onePlayer.getUsername());
            onePlayerMap.put("ID", onePlayer.getId());
            playerList.add(onePlayerMap);
        });
        return  playerList;
    }

    @RequestMapping(value="/api/players/{player_id}", method= RequestMethod.GET)
    public String findPlayer(@RequestParam("id") Long id, Model model) {
        model.addAttribute("Player_id", id);

        return "player details";
    }


    //GAMEPLAYER CONTROLLER CALLS
    @Autowired
    private GamePlayerRepository gamePlayerRepo;

    @Autowired
    private ShipRepository shipRepo;

    @RequestMapping("/api/gameplayers")

    public List<GamePlayer> getGamePlayers() {
        return gamePlayerRepo.findAll();
    }

    @RequestMapping("/user_games")
    public List<Map> getUserGames() {

        List<Map> currentUserGameList = new ArrayList<>();
        gameRepo.findAll().stream().forEach(oneGame -> {
            System.out.println("GAME LOOP");
            List<Map> gamePlayerList = new ArrayList<>();
            oneGame.getGamePlayers().stream().forEach(oneGamePlayer -> {
                System.out.println("GAMEPLAYER LOOP");
                gamePlayerList.add(mapGamePlayers(oneGamePlayer));
            });
            Map<String, Object> oneGameMap = mapGame(oneGame, gamePlayerList);
            System.out.println("ONE GAME MAP");
            currentUserGameList.add(oneGameMap);
        });
        System.out.println("RETURN GAME LIST");

        return currentUserGameList;
    }

    @RequestMapping("/api/gameplayers/gameplayer_info")
    public List<Map> getGamePlayerIDs() {

        List<Map> gamePlayerList = new ArrayList<>();
        gamePlayerRepo.findAll().stream().forEach(oneGamePlayer -> {
            Map<String, Object> oneGamePlayerMap = new HashMap<>();
            oneGamePlayerMap.put("Linked Game: ", oneGamePlayer.getGameInstance());
            oneGamePlayerMap.put("Linked Username: ", oneGamePlayer.getPlayer().getUsername());
            oneGamePlayerMap.put("Linked Player ID: ", oneGamePlayer.getPlayer().getId());
            oneGamePlayerMap.put("GamePlayer Instance ID: ", oneGamePlayer.getId());
            oneGamePlayerMap.put("Ships: ", oneGamePlayer.getShips());
            oneGamePlayerMap.put("Salvoes", oneGamePlayer.getSalvoes());
            gamePlayerList.add(oneGamePlayerMap);
        });

        return gamePlayerList;
    }


    @RequestMapping("/api/ships")
    public List<Ship> getShips() {
        return shipRepo.findAll();
    }

    @RequestMapping("/api/salvoes")
    public List<Salvo> getSalvoes() {
        return salvoRepo.findAll();
    }

    @Bean
        public WebMvcConfigurer corsConfigurer() {
            return new WebMvcConfigurerAdapter() {
                @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**")
                            .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH");
                }
            };
        }
    }





//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
//
//public class SalvoController {
//
//    @Configuration
//    public class MyConfiguration {
//
//        @Bean
//        public WebMvcConfigurer corsConfigurer() {
//            return new WebMvcConfigurerAdapter() {
//                @Override
//                public void addCorsMappings(CorsRegistry registry) {
//                    registry.addMapping("/**")
//                            .allowedMethods("HEAD", "GET", "PUT", "POST", "DELETE", "PATCH");
//                }
//            };
//        }
//    }
//
//}
//disables all of CORS