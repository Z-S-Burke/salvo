package com.codeoftheweb.salvo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public abstract class GamePlayerRepository extends JpaRepository<GamePlayer, Long> {
    List<GamePlayer> findByGameInstance (Game gameInstance);
}
