package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.*;

import java.util.Set;
import java.util.HashSet;

@Entity
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    //ID
    private long id;

    //USERNAME
    private String username;

    //PASSWORD
    private String password;

    //GAMEPLAYERS
    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers = new HashSet<>();

    //PlayerScore
    @OneToMany(mappedBy = "playerScore", fetch=FetchType.EAGER)
    Set<Player> playerScore = new HashSet<>();

    //PLAYER CONSTRUCTOR
    public Player() { }

    public Player(String username, String password) {
        this.username = username;
        this.password = password;
    }


    //GET
    public long getId() {
        return id;
    }

    @JsonIgnore
    public String getPassword() {
        return password;
    }

    @JsonIgnore
    public Set<Player> getScores() {
        return playerScore;
    }

    @JsonIgnore
    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }

    public String getUsername() {
        return username;
    }


    //SET
    public void setId(long id) {
        this.id = id;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    //UTILITY
    public String toString() {
        return username;
    }

/*
    public void setGamePlayers(Set<GamePlayer> gamePlayers) {
        this.gamePlayers = gamePlayers;
    }
*/
}
