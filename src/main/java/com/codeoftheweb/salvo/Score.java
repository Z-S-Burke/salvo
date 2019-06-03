package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")

    public Long scoreID;

    public Score () {}

    public Score (Player player, Game game, int score, Date finishDate) {
        this.player = player;
        this.game = game;
        this.score = score;
        this.finishDate = finishDate;
    }

    //GET.PLAYER
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "playerScore_id")
    private Player player;

    //GET.GAME
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gameScore_id")
    private Game game;

    public int score;

    private Date finishDate;

    public int getScore() {
        return score;
    }

    public Long getId() {
        return scoreID;
    }

    public Player getPlayer() {
        return player;
    }

    public Game getGameInstance() {
        return game;
    }

    public Date getFinishDate() {
        return finishDate;
    }

    public void setId(Long scoreID) {
        this.scoreID = scoreID;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void setFinishDate(Date finishDate) {
        this.finishDate = finishDate;
    }

}
