package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.*;

@Entity
public class Game {
    //GAME.ID UTILITIES
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")

    public Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean gameOver = false;

    public Boolean getGameOver() {
        return gameOver;
    }

    public void setGameOver(Boolean gameOver) {
        this.gameOver = gameOver;
    }

    public Boolean draw = false;

    public Boolean getDraw() {
        return draw;
    }

    public void setDraw(Boolean draw) {
        this.draw = draw;
    }


//    public void setGameOver(Boolean gameOver) {
//        this.getGamePlayers().stream().forEach(player -> {
//            if(player.getWinner() != true) {
//                player.setWinner(true);
//            }
//            else {
//                player.setWinner(false);
//            }
//        });
//
//        this.gameOver = gameOver;
//    }

    //GAME.CREATIONDATE UTILITIES
    private String creationDate;


    public String getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(String creationDate) {
        this.creationDate = creationDate;
    }


    //GAME CONSTRUCTOR AND UTILITIES
    public Game () {}

    public Game (String date) {
        this.creationDate = date;
    }
    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

    @JsonIgnore
    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }

    @OneToMany(mappedBy = "gameScore", fetch=FetchType.EAGER)
    Set<Game> gameScore = new HashSet<>();

    @JsonIgnore
    public Set<Game> getScores() {
        return gameScore;
    }
}
