package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.*;

public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private String creationDate;
    private Game gameInstance;
    private Player playerOne;

    public GamePlayer() { }
//relationship with game defined here
    public Game getGameInstance() {
        return gameInstance;
    }

    public void setGameInstance(Game gameInstance) {
        this.gameInstance = gameInstance;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "player_id")
    public Player getPlayerOne() {
        return playerOne;
    }

    public void setPlayerOne(Player playerOne) {
        this.playerOne = playerOne;
    }

    public String getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(String date) {
        this.creationDate = date;
    }

    public String toString() {
        return creationDate;
    }
}
