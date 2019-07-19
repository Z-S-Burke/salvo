package com.codeoftheweb.salvo;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.security.core.Authentication;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
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

    @RequestMapping(value = "/api/newGame", method = RequestMethod.POST)
    public Map<String, Object> newGame(Authentication authentication) {

        Map<String, Object> newGameMap = new LinkedHashMap<>();
        Date creationDate = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        String strDate = dateFormat.format(creationDate);
        Game newGame = new Game(strDate);
        GamePlayer newGamePlayer = new GamePlayer(newGame, playerRepo.findByUsername(authentication.getName()));
        gameRepo.save(newGame);
        gamePlayerRepo.save(newGamePlayer);
        playerRepo.save(playerRepo.findByUsername(authentication.getName()));

        newGameMap.put("gameplayer", newGamePlayer);
        newGameMap.put("gamePlayerID", newGamePlayer.getId());
        return newGameMap;
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
        gamePlayerMap.put("ships", gamePlayer.getShips());
        gamePlayerMap.put("salvoes", gamePlayer.getSalvoes());

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

    @RequestMapping(value = "/api/players", method = RequestMethod.POST)
    public ResponseEntity<Object> addPlayer (@RequestParam String username, @RequestParam String password) {

        System.out.println(username + password);

        Boolean playerIsNew = playerRepo.findByUsername(username) == null ?  true : false;
        Boolean passwordLength = password.length() >= 8 ? true : false;
        Boolean emptyPassword = password.isEmpty() ? false : true;
        if (playerIsNew && passwordLength && emptyPassword) {
            Player newPlayer = new Player(username, password);
            playerRepo.save(newPlayer);
            System.out.println("New player account created");
        }
        else {
            System.out.println("This player already exists or the password provided did not match the proper format.");
        }
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value="/api/games/players/{id}/ships", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> submitShips(@PathVariable Long id, @RequestBody List<Ship> ships, Authentication authentication) {

        System.out.println("id = " + id);

        GamePlayer user = gamePlayerRepo.findById(id);
        Boolean userAuthorized = user.getPlayer().getUsername() == authentication.getName() ? true : false;

        if (userAuthorized) {
            ships.stream().forEach(ship -> {
                Ship newShip = new Ship(ship.getType(), ship.getLocationOnBoard());
                user.addShip(newShip);
                shipRepo.save(newShip);
            });

            user.setFleetDeployed(true);
            user.setCurrentTurn(user.getCurrentTurn() + 1);
            gamePlayerRepo.save(user);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value = "/api/games/players/{id}/ships", method = RequestMethod.GET)
    public Map<String, Object> getPlayerShips (@RequestParam Long id, Authentication authentication) {

        System.out.println(id);
        Map<String, Object> playerShips = new LinkedHashMap<>();
        GamePlayer thisGamePlayer = gamePlayerRepo.findById(id);
        System.out.println(thisGamePlayer);
            if(thisGamePlayer.getPlayer().getUsername() == authentication.getName()) {
                playerShips.put("ships", thisGamePlayer.getShips());
            }

        return playerShips;

    }

    @RequestMapping(value="/api/games/players/{id}/salvos", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> fireSalvoes (@PathVariable Long id, @RequestBody List<Salvo> salvos, Authentication authentication) {

        System.out.println("id = " + id);

        GamePlayer user = gamePlayerRepo.findById(id);
        Boolean userAuthorized = user.getPlayer().getUsername() == authentication.getName() ? true : false;

        if (userAuthorized) {
            salvos.stream().forEach(salvo -> {
                user.addSalvo(salvo);
                salvoRepo.save(salvo);
            });

            user.setCurrentTurn(user.getCurrentTurn() + 1);
            user.setFleetDeployed(true);
            gamePlayerRepo.save(user);
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping(value="/api/games/players/{id}/salvos", method = RequestMethod.GET)
    public GamePlayer getPlayerSalvoResults (@PathVariable Long id, Authentication authentication) {


        GamePlayer user = gamePlayerRepo.findById(id);
        Boolean userAuthorized = user.getPlayer().getUsername() == authentication.getName() ? true : false;

        if (userAuthorized) {
            Game thisGame = gameRepo.findById(user.getGameInstance().id);
            thisGame.getGamePlayers().stream().forEach(gamePlayer -> {
                if(user.getId() != gamePlayer.getId()) {
                    gamePlayer.setOpponent(user.getId());
                    gamePlayerRepo.save(gamePlayer);
                    Set<Ship> opponentShips = gamePlayer.getShips();
                    opponentShips.stream().forEach(ship -> {
                        ship.setHits(user.getSalvoes());
                        shipRepo.save(ship);
                    });
                    user.setOpponent(gamePlayer.getId());
                    gamePlayerRepo.save(user);
                    Set<Ship> userShips = user.getShips();
                    userShips.stream().forEach((ship -> {
                        ship.setHits((gamePlayer.getSalvoes()));
                        shipRepo.save(ship);
                    }));
                }
            });
        }

        return user;
    }

    @RequestMapping(value="/api/games/players/opponent/{id}/salvos", method = RequestMethod.GET)
    public Set<Salvo> getOpponentSalvoResults (@PathVariable Long id) {


        GamePlayer opponent = gamePlayerRepo.findById(id);
        System.out.println("opponent id search, supposed to be 9, comes out as: " + opponent.getOpponent());
        GamePlayer user = gamePlayerRepo.findById(opponent.getOpponent());

        opponent.getShips().stream().forEach(ship -> {
            ship.setHits(user.getSalvoes());
        });

        user.getShips().stream().forEach((ship -> {
            ship.setHits((opponent.getSalvoes()));
        }));

        return opponent.getSalvoes();
    }

    @RequestMapping(value="/api/games/opponent/ships/{id}/sink", method = RequestMethod.GET)
    public List<Map> getOpponentShipStatus(@PathVariable Long id) {

        List<Map> sinkList = new ArrayList<>();

        gamePlayerRepo.findById(id).getShips().stream().forEach(ship -> {
            System.out.println(ship.getType());
            Map<String, Object> sinkMap = new LinkedHashMap<>();
            sinkMap.put("sink", ship.getSink());
            sinkMap.put("type", ship.getType());
            sinkList.add(sinkMap);
        });

        System.out.println(sinkList);
        return sinkList;
    }

    @RequestMapping(value="/api/games/opponent/{id}/turn", method = RequestMethod.GET)
    public List<Map> getOpponentTurnStatus(@PathVariable Long id) {

        List<Map> turnInfo = new ArrayList<>();
        Map<String, Object> turnMap = new LinkedHashMap<>();

        GamePlayer opponent = gamePlayerRepo.findById(id);
        turnMap.put("currentTurn", opponent.getCurrentTurn());
        turnMap.put("fleetDeployed", opponent.getFleetDeployed());
        turnMap.put("winner", opponent.getWinner());
        turnMap.put("fleetRemaining", opponent.getFleetRemaining());
        turnInfo.add(turnMap);

        return turnInfo;
    }

    @RequestMapping(value="/api/scoreSubmission/{id}/{score}", method = RequestMethod.GET)
    public ResponseEntity<Object> scoreSubmission(@PathVariable Long id, @PathVariable int score, Authentication authentication) {

        GamePlayer user = gamePlayerRepo.findById(id);
        Boolean userAuthorized = user.getPlayer().getUsername() == authentication.getName() ? true : false;

        if (userAuthorized) {
            if(score == 2) {
                user.getPlayer().setWin(user.getPlayer().getWin() + 1);
            }
            else if (score == 1) {
                user.getPlayer().setDraw(user.getPlayer().getDraw() + 1);
            }
            else {
                user.getPlayer().setLose(user.getPlayer().getLose() + 1);
            }
        }

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @RequestMapping("/api/players/player_info")
    public List<Map> getPlayerIDs() {


        List<Map> playerList = new ArrayList<>();
        Map<String, Object> onePlayerMap = new HashMap<>();
        playerRepo.findAll().stream().forEach(onePlayer -> {
            onePlayerMap.put("username:", onePlayer.getUsername());
            onePlayerMap.put("id", onePlayer.getId());
            playerList.add(onePlayerMap);
        });
        return  playerList;
    }

    @RequestMapping(value="/api/players/{id}", method= RequestMethod.GET)
    public Player findPlayer(@PathVariable Long id) {

        return playerRepo.findById(id);
    }

    @RequestMapping(value="/api/setWinner/{id}", method= RequestMethod.GET)
    public GamePlayer setWinner(@PathVariable Long id) {

        GamePlayer user = gamePlayerRepo.findById(id);
        user.setWinner(true);
        gamePlayerRepo.save(user);

        return user;
    }

    @RequestMapping(value="/api/gameplayers/{id}", method= RequestMethod.GET)
    public GamePlayer findGamePlayer(@PathVariable Long id, Authentication authentication) {

        System.out.println("Authentication" + authentication.getName());
        System.out.println(playerRepo.findByUsername(authentication.getName()).getGamePlayers());
//        if(playerRepo.findByUsername(authentication.getName()).getGamePlayers() == gamePlayerRepo.findById(id)) {
            return gamePlayerRepo.findById(id);
//        } else {
//            return null;
//        }

    }

    @RequestMapping(value="/api/games/join/{id}", method = RequestMethod.POST)
    public Long joinExistingGame(@PathVariable Long id, Authentication authentication) {

        Game game = gameRepo.findById(id);
        GamePlayer newGamePlayer = new GamePlayer(game, playerRepo.findByUsername(authentication.getName()));

        gameRepo.save(game);
        gamePlayerRepo.save(newGamePlayer);
        playerRepo.save(playerRepo.findByUsername(authentication.getName()));

        game.getGamePlayers().stream().forEach(player -> {
            if(player.getId() != newGamePlayer.getId()) {
                player.setOpponent(newGamePlayer.getId());
                Set<Ship> opponentShips = player.getShips();
                opponentShips.stream().forEach(ship -> {
                    ship.setHits(newGamePlayer.getSalvoes());
                });
                newGamePlayer.setOpponent(player.getId());
                Set<Ship> userShips = newGamePlayer.getShips();
                userShips.stream().forEach((ship -> {
                    ship.setHits((player.getSalvoes()));
                }));
            }
        });
        return newGamePlayer.getId();
    }


    @RequestMapping(value = "/api/games/{id}", method = RequestMethod.GET)
    public Map<String, Object> getGamePlayerMatchInfo (@PathVariable Long id, Authentication authentication) {
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();

        Game joiningGame = gameRepo.findById(id);
        joiningGame.getGamePlayers().stream().forEach(gamePlayer -> {
            if (gamePlayer.getPlayer().getUsername() == authentication.getName()) {
                GamePlayer newGamePlayer = gamePlayer;
                gamePlayerMap.put("gamePlayerID", newGamePlayer.getId());
                gamePlayerMap.put("player", mapGamePlayerPlayers(newGamePlayer));
                gamePlayerMap.put("ships", newGamePlayer.getShips());
                gamePlayerMap.put("salvoes", newGamePlayer.getSalvoes());
            }
        });

        return gamePlayerMap;
    }

    @RequestMapping(value = "/api/games/vs/{id}", method = RequestMethod.GET)
    public Map<String, Object> versusInfo (@PathVariable Long id, Authentication authentication) {

        Map<String, Object> gameVersusInfo = new LinkedHashMap<>();

        Game currentGame = gameRepo.findById(id);
        currentGame.getGamePlayers().stream().forEach(gamePlayer -> {
            if (gamePlayer.getPlayer().getUsername() != authentication.getName()) {
                GamePlayer opponent = gamePlayer;
                gameVersusInfo.put("gamePlayerID", opponent.getId());
            }
        });

        return gameVersusInfo;
    }

    @RequestMapping(value = "/game_view.html/{id}", method = RequestMethod.GET)
    public Map<String, Object> gameView (@PathVariable Long id, Authentication authentication) {
        Map<String, Object> gamePlayerMap = new LinkedHashMap<>();

        System.out.println(authentication.getName());

            if (id == playerRepo.findByUsername(authentication.getName()).getId()) {
                Game joiningGame = gameRepo.findById(id);
                joiningGame.getGamePlayers().stream().forEach(gamePlayer -> {
                    if (gamePlayer.getPlayer().getUsername() == authentication.getName()) {
                        GamePlayer newGamePlayer = gamePlayer;
                        gamePlayerMap.put("gamePlayerID", newGamePlayer.getId());
                        gamePlayerMap.put("player", mapGamePlayerPlayers(newGamePlayer));
                        gamePlayerMap.put("ships", newGamePlayer.getShips());
                        gamePlayerMap.put("salvoes", newGamePlayer.getSalvoes());
                    }
                });
                return gamePlayerMap;
            }
            else {
                return null;
            }
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