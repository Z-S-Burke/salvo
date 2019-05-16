package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class SalvoController {

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
        List<Map> playerList = new ArrayList<>();
        List<Map> gamePlayerList = new ArrayList<>();

        gameRepo.findAll().stream().forEach(oneGame -> {
            System.out.println("GAME LOOP");
            Map<String, Object> oneGameMap = new HashMap<>();
            oneGameMap.put("Created:", oneGame.getCreationDate());
            oneGameMap.put("ID", oneGame.getId());
            oneGame.getGamePlayers().stream().forEach(oneGamePlayer -> {
                System.out.println("GAMEPLAYER LOOP");
                Map<String, Object> gamePlayerMap = new HashMap<>();
                gamePlayerMap.put("GamePlayer ID: ", oneGamePlayer.getId());
                gamePlayerMap.put("Player: ", oneGamePlayer.getPlayer());
                Map<String, Object> playerMap = new HashMap<>();
                playerMap.put("Username: ", oneGamePlayer.getPlayer().getUsername());
                playerMap.put("Player ID: ", oneGamePlayer.getPlayer().getId());
//                playerList.add(playerMap);
//                gamePlayerList.add(gamePlayerMap);
                gameList.add(playerMap);
                gameList.add(gamePlayerMap);

            });

            System.out.println("ONE GAME MAP");
            gameList.add(oneGameMap);
        });
        System.out.println("RETURN GAME LIST");
        return gameList;
    }
/*
    public List<Map> getGameInfo() {

        List<Map> gameList = new ArrayList<>();
        gameRepo.findAll().stream().forEach(oneGame -> {
            Map<String, Object> oneGameMap = new HashMap<>();
            oneGameMap.put("Created:", oneGame.getCreationDate());
            oneGameMap.put("ID", oneGame.getId());
            gameList.add(oneGameMap);
        });

        return gameList;
*/



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
            gamePlayerList.add(oneGamePlayerMap);
        });

        return gamePlayerList;
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