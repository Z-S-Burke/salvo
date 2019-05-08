package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private String creationDate;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="player_id")
    private Player player;


    public Game() { }
//
//    public Game(String date) {
//        this.creationDate = date;
//        creationDate = getTimeStamp(this.creationDate);
//    }

    public String getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(String date) {
        this.creationDate = date;
    }

    public String toString() {
        return creationDate;
    }
}
