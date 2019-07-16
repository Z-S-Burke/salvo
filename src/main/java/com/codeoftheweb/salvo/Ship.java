package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
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

    //SHIP HITS

    @ElementCollection
    public Set<String> hits = new HashSet<>();

    public Set<String> getHits() {
       return hits;
    }

    public void setHits(Set<Salvo> opponentSalvos) {

        System.out.println("in the function");

        this.getLocationOnBoard().stream().forEach(location -> {
            System.out.println("in the location: " + location);
            opponentSalvos.stream().forEach((salvo -> {
                System.out.println("in the salvos: " + salvo.getLocation());
                if(salvo.getLocation() == location) {
                    System.out.println("supposed to register as a hit");
                    hits.add(salvo.getLocation());
                    System.out.println(hits);
                    salvo.setHit(true);
                    System.out.println("Successful hit set to: " + salvo.getHit());
                }
            }));
        });
    }

    //SHIP SINK STATUS
    public Boolean sink;

    public Boolean getSink() {
        return sink;
    }

    public void setSink() {
        if(this.getHits().size() == this.getLocationOnBoard().size()) {
            this.sink = true;
        }
    }

    //SHIP.GAMEPLAYER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    @JsonIgnore
    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public void setGamePlayer (GamePlayer gameplayer) {
        this.gamePlayer = gameplayer;
    }
}
