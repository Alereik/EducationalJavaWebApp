package com.learninglabyrinth.backend.models;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;

import java.time.LocalDateTime;
import java.util.List;

import com.learninglabyrinth.backend.robot.MovementEnum;

/**
 * This is an entity class that stores information of each attempts an user
 * makes on a maze.
 * 
 * @author Mary Kim
 */
@Entity
public class MazeAttempt {

  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  public Long id;

  private Long mazeId;

  private Long accountId;

  private int numMoves; // -1 when moves not made

  private boolean isSuccess; // true if maze is solved

  @Column(columnDefinition = "LONGTEXT")
  private String javaText;

  private LocalDateTime date; // date of attempt made

  @ElementCollection(targetClass = MovementEnum.class)
  @CollectionTable(name = "movements", joinColumns = @JoinColumn(name = "maze_attempt_id"))
  @Column(name = "movements", nullable = false, columnDefinition = "LONGTEXT")
  @Enumerated(EnumType.STRING)
  private List<MovementEnum> movements; // movement history of the attempt

  // constructors
  public MazeAttempt() {
  }

  public MazeAttempt(Long mazeId, Long accountId, String javaText) {
    this.mazeId = mazeId;
    this.accountId = accountId;
    this.javaText = javaText;
    this.numMoves = -1;
    this.isSuccess = false;
    this.date = LocalDateTime.now();
  }

  // getters
  public Long getMazeId() {
    return mazeId;
  }

  public Long getAccountId() {
    return accountId;
  }

  public int getNumMoves() {
    return numMoves;
  }

  public boolean getIsSuccess() {
    return isSuccess;
  }

  public String getJavaText() {
    return javaText;
  }

  public LocalDateTime getDate() {
    return this.date;
  }

  @ElementCollection(targetClass = MovementEnum.class)
  @CollectionTable(name = "movements", joinColumns = @JoinColumn(name = "maze_attempt_id"))
  @Column(name = "movements", nullable = false, columnDefinition = "LONGTEXT")
  @Enumerated(EnumType.STRING)
  public List<MovementEnum> getMovements() {
    return movements;
  }

  // setters
  public void setMovements(List<MovementEnum> movements) {
    this.movements = movements;
  }
  public void setNumMoves(int numMoves) {
    this.numMoves = numMoves;
  }
  public void setIsSuccess(boolean success) {
    this.isSuccess = success;
  }
}
