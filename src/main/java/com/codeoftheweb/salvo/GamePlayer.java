package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.access.method.P;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
public class GamePlayer {

    //GAMEPLAYER.ID UTILITIES
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    //ID FUNCTIONS
    private Long id;
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    //GAMEPLAYER CONSTRUCTOR AND UTILITIES
    public GamePlayer() { }

    public GamePlayer(Game game, Player player) {
        this.game = game;
        this.player = player;
    }

    //GET.PLAYER UTILITIES
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    private Player player;

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    //GET.GAME UTILITIES
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "game_id")
    private Game game;

    public Game getGameInstance() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    //GET.SHIPS GAMEPLAYER UTILITIES
    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER)
    Set<Ship> ships = new HashSet<>();

    public Set<Ship> getShips() {
        return ships;
    }

    public void addShip (Ship ship) {
        ship.setGamePlayer(this);
        ships.add(ship);
    }

    //GET.SALVOES GAMEPLAYER UTILITIES
    @OneToMany(mappedBy = "gamePlayer", fetch = FetchType.EAGER)
    Set<Salvo> salvoes = new HashSet<>();

    public Set<Salvo> getSalvoes() { return salvoes; }

    public void addSalvo (Salvo salvo) {
        salvo.setGamePlayer(this);
        salvoes.add(salvo);

        this.getShips().stream().forEach(ship -> {
            ship.getLocationOnBoard().stream().forEach(location -> {
                if (salvo.getLocation() == location) {
                    salvo.setHit(true);
                }
            });
        });
    }

    //GAMEPLAYER.CREATIONDATE UTILITIES
    private String creationDate;

    public String getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(String creationDate) {
        this.creationDate = game.getCreationDate();
    }

    //GAMEPLAYER.FINDOPPONENT UTILITIES
    public Long opponent;

    public Long getOpponent() {
        return opponent;
    }

    public void setOpponent(Long opponent) {

        this.getGameInstance().getGamePlayers().forEach(player -> {
            if (player.getId() == opponent) {
                this.opponent = player.getId();
            }
        });
    }

    //GAMEPLAYER.WINNER UTILITIES

    public Boolean winner;

    public Boolean getWinner() {
        return winner;
    }

    public void setWinner(Boolean winner) {
        this.winner = winner;
    }

    //GAMEPLAYER.DEPLOYED UTILITIES

    public Boolean fleetDeployed = false;

    public Boolean getFleetDeployed() {
        return fleetDeployed;
    }

    public void setFleetDeployed(Boolean fleetDeployed) {
        this.fleetDeployed = fleetDeployed;
    }

    //GAMEPLAYER.CURRENTTURN

    public int currentTurn = 0;

    public int getCurrentTurn() {
        return currentTurn;
    }

    public void setCurrentTurn(int currentTurn) {
        this.currentTurn = currentTurn;
    }

    //GAMEPLAYER.FLEETREMAINING

    public int fleetRemaining = 5;

    public int getFleetRemaining() {
        return fleetRemaining;
    }

    public void setFleetRemaining(int fleetRemaining) {
        this.fleetRemaining = fleetRemaining;
    }
}
