package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;

    public Date getCreationDate() {
        return creationDate;
    }

    private Date creationDate;

    public Game () { }

    public Game (Date date) {
        this.creationDate = date;
    }

    public void setCreationDate(Date creationDate) {
        this.creationDate = creationDate;
    }

    @OneToMany(mappedBy="game", fetch=FetchType.EAGER)
    Set<GamePlayer> gamePlayers;
//
    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }

//    public void setGamePlayers(Set<GamePlayer> gamePlayers) {
//        this.gamePlayers = gamePlayers;
//    }

}
