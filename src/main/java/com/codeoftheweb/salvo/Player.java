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
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    //PLAYER CONSTRUCTOR

    public Player() { }

    public Player(String name) {
        this.username = name;
    }

    //USERNAME
    private String username;

    public String getUsername() {
        return username;
    }

    public void setUsername(String name) {
        this.username = name;
    }

    //GAMEPLAYERS
    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers = new HashSet<>();

        @JsonIgnore
        public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }

    @OneToMany(mappedBy = "playerScore", fetch=FetchType.EAGER)
    Set<Player> playerScore = new HashSet<>();

        @JsonIgnore
        public Set<Player> getScores() {
            return playerScore;
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
