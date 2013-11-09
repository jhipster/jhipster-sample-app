package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.PersistentToken;
import com.mycompany.myapp.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface PersistentTokenRepository extends JpaRepository<PersistentToken, String> {

    List<PersistentToken> findByUser(User user);

}
