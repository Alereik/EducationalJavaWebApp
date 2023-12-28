package com.learninglabyrinth.backend.repositories;

import org.springframework.stereotype.Repository;
import com.learninglabyrinth.backend.models.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * The AccountRepository interface handles the MySQL database requests.
 * 
 * @author Alvin Osterndorff
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
	Optional<Account> findByUsername(String username);
	Optional<Account> findByUsernameAndPassword(String username, String password);
}
