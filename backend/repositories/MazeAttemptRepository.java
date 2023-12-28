package com.learninglabyrinth.backend.repositories;

import org.springframework.stereotype.Repository;
import com.learninglabyrinth.backend.models.MazeAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

@Repository
public interface MazeAttemptRepository extends JpaRepository<MazeAttempt, Long> {
  boolean existsByAccountIdAndMazeId(Long accountId, Long mazeId);

    // @Query("SELECT a from MazeAttempt a WHERE a.accountId = ?1 AND a.isSuccess = true ORDER BY a.numMoves ASC")
    // List<MazeAttempt> getSuccessfulAttemptsOrderByScore(long userID);
    // @Query("SELECT a from MazeAttempt a WHERE a.accountId = ?1 ORDER BY a.DATE")
    // List<MazeAttempt> getAttemptsOrderByDate(long userID);

    // find the best successful attempt for this maze made by the given user
    Optional<MazeAttempt> findFirstByMazeIdAndAccountIdAndIsSuccessOrderByNumMovesAsc(long mazeId, long accountId, boolean isSuccess);

    // find the most recent attempt for this maze made by the given user
    Optional<MazeAttempt> findFirstByMazeIdAndAccountIdOrderByDateDesc(long mazeId, long accountId);

    // deletes all attempts linked to the given maze id
    long deleteAllByMazeId(long mazeId);
}
