package com.codeoftheweb.salvo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.ui.Model;

@RepositoryRestResource
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Player findByUsername(String username);
    Player findById(Long id);
}

