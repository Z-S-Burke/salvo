package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Embeddable
public class Salvo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")

    public Long id;
    public int turnFired;
    public String location;
    public Boolean hit = false;


    Salvo () {};

    Salvo (int turnFired, String location, GamePlayer gamePlayer) { this.turnFired = turnFired; this.location = location; this.gamePlayer = gamePlayer;}

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="gamePlayer_id")
    private GamePlayer gamePlayer;

    @JsonIgnore
    public GamePlayer getGamePlayer() {
        return gamePlayer;
    }

    public Boolean getHit() {
        return hit;
    }

    public void setHit(Boolean hit) {
        this.hit = hit;
    }

    public void setGamePlayer (GamePlayer gameplayer) {
        this.gamePlayer = gameplayer;
    }


    public String getLocation() {
        return location;
    }

    public void setLocations(String location) {
        this.location = location;
    }

    public Long getId() {
        return id;
    }

    public int getTurnFired() {
        return turnFired;
    }

    public void setTurnFired(int turnFired) {
        this.turnFired = turnFired;
    }

    public void setId(Long id) {
        this.id = id;
    }

}
