package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

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
    }

    //GAMEPLAYER.CREATIONDATE UTILITIES
    private Date creationDate;

    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = game.getCreationDate();
    }
}
