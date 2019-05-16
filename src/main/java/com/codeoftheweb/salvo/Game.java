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

    //GAME.CREATIONDATE UTILITIES
    private Date creationDate;


    public Date getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }


    //GAME CONSTRUCTOR AND UTILITIES
    public Game () {}

    public Game (Date date) {
        this.creationDate = date;
    }
    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;

//    @JsonIgnore
    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }
}
