package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import java.util.Set;
import java.util.HashSet;

@Entity
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private long id;
    private String username;

    @OneToMany(mappedBy="player", fetch=FetchType.EAGER)
    Set<Game> games = new HashSet<>();

    public Set<Game> getGames() {
        return games;
    }

    public void addGame(Game game) {
        games.add(game);
    }

    public Player() { }

    public Player(String name) {
        this.username = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String name) {
        this.username = name;
    }

    public String toString() {
        return username;
    }
}
