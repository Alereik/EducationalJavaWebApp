package com.learninglabyrinth.backend.repositories;

import com.learninglabyrinth.backend.models.MazeLayout;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MazeRepository extends JpaRepository<MazeLayout, Long> {
    MazeLayout getReferenceById(Long id);
    Iterable<MazeLayout> findAllByOrderBySizeAsc();
    Optional<MazeLayout> findById(Long id);
    List<MazeLayout> findTop3ByOrderByUsesDesc();
}
