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
    @ElementCollection
    public Set<String> locations = new HashSet<>();


    Salvo () {};

    Salvo (int turnFired, Set<String> locations) { this.turnFired = turnFired; this.locations = locations;}

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

    public Set<String> getLocations() {
        return locations;
    }

    public void setLocations(Set<String> locations) {
        this.locations = locations;
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
