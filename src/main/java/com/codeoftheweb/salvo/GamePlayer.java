package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class GamePlayer {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private String creationDate;
    private Game gameInstance;
    private Player username;

    public GamePlayer() { }

    public Game getGameInstance() {
        return gameInstance;
    }

    public void setGameInstance(Game gameInstance) {
        this.gameInstance = gameInstance;
    }

    public Player getUsername() {
        return username;
    }

    public void setUsername(Player username) {
        this.username = username;
    }

//    public Game(String date) {
//    }

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
