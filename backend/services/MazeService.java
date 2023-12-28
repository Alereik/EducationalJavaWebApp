package com.learninglabyrinth.backend.services;

import com.learninglabyrinth.backend.models.MazeLayout;
import com.learninglabyrinth.backend.repositories.MazeAttemptRepository;
import com.learninglabyrinth.backend.repositories.MazeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MazeService {

    @Autowired
    public MazeRepository mazeRepository;

    @Autowired
    public MazeAttemptRepository mazeAttemptRepository;

    public MazeLayout saveMazeLayout(MazeLayout layout) {
        return mazeRepository.save(layout);
    }

    public Optional<MazeLayout> getMazeLayout(Long mazeID) {
        return mazeRepository.findById(mazeID);
    }

    public Iterable<MazeLayout> getMazes(){
        return mazeRepository.findAllByOrderBySizeAsc();
    }

    public void deleteMazeLayout(Long mazeID) {
        mazeRepository.deleteById(mazeID);
        mazeAttemptRepository.deleteAllByMazeId(mazeID);
    }

    public boolean mazeExists(long mazeID) {
        return mazeRepository.existsById(mazeID);
    }

    public List<MazeLayout> getPopularMazes() {
        return mazeRepository.findTop3ByOrderByUsesDesc();
    }
}
