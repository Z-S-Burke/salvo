package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import java.util.Set;
import java.util.HashSet;
import javax.persistence.*;

@Entity
@Embeddable
public class Ship {
    //SHIP.ID UTILITIES
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

    //SHIP.TYPE GETTER/SETTER
    public String type;

    public void setType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }

    //SHIP LOCAITON
    @ElementCollection
    public Set<String> locationOnBoard = new HashSet<>();

    public Set<String> getLocationOnBoard() {
        return locationOnBoard;
    }

    public void setLocationOnBoard(Set<String> locationOnBoard) {
        this.locationOnBoard = locationOnBoard;
    }

    //SHIP CONSTRUCTOR AND UTILITIES
    public Ship () {}

    public Ship (String type, Set<String> location) { this.type = type; this.locationOnBoard = location; }

//    public Ship (String type, Set<GamePlayer> gamePlayer) {
//        this.type = type;
//        this.gamePlayers = gamePlayer;
//    }
//
//    @ManyToOne(fetch = FetchType.EAGER)
//    Set<GamePlayer> gamePlayers = new HashSet<>();
//
//    @JsonIgnore
//    public Set<GamePlayer> getGamePlayers() {
//        return gamePlayers;
//    }

}
