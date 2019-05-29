package com.codeoftheweb.salvo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class SalvoController {

    @Autowired
    private SalvoRepository salvoRepo;

    //GAME CONTROLLER CALLS
    @Autowired
    private GameRepository gameRepo;

    @RequestMapping("/api/games")
    public List<Game> getGames() {

       return gameRepo.findAll();
    }

    @RequestMapping("/api/games/game_info")
    public List<Map> getGameInfo() {

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
        return gameList;
    }

    public static Map mapGame (Game game, List gamePlayerList) {
        Map<String, Object> oneGameMap = new LinkedHashMap<>();
        oneGameMap.put("GameID", game.getId());
        oneGameMap.put("DateCreated", game.getCreationDate());
        oneGameMap.put("GamePlayers", gamePlayerList);

        return oneGameMap;
    }

    public static Map mapGamePlayers (GamePlayer gamePlayer) {
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();
        gamePlayerMap.put("GamePlayerID", gamePlayer.getId());
        gamePlayerMap.put("Player", mapGamePlayerPlayers(gamePlayer));

        return gamePlayerMap;
    }

    public static Map mapGamePlayerPlayers (GamePlayer gamePlayer) {
        Map<String, Object> playerMap = new LinkedHashMap<>();
        playerMap.put("Username", gamePlayer.getPlayer().getUsername());
        playerMap.put("PlayerID", gamePlayer.getPlayer().getId());

        return playerMap;
    }


    //PLAYER CONTROLLER CALLS
    @Autowired
    private PlayerRepository playerRepo;

    @RequestMapping("/api/players")
    public List<Player> getPlayers() {
        return playerRepo.findAll();
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

    @RequestMapping("/api/gameplayers/gameplayer_info")
    public List<Map> getGamePlayerIDs() {

        List<Map> gamePlayerList = new ArrayList<>();
        gamePlayerRepo.findAll().stream().forEach(oneGamePlayer -> {
            Map<String, Object> oneGamePlayerMap = new HashMap<>();
            oneGamePlayerMap.put("Linked Game: ", oneGamePlayer.getGameInstance());
            oneGamePlayerMap.put("Linked Player: ", oneGamePlayer.getPlayer());
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