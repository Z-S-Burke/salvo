package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.*;
import java.util.Date;

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

    //GET.SHIPS UTILITIES
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ship_id")
    private Ship ship;

    public Ship getShips() {
        return ship;
    }

    public void setShip(Ship ship) {
        this.ship = ship;
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
