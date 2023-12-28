package com.learninglabyrinth.backend.robot;


import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.learninglabyrinth.backend.models.MazeLayout;

public class RobotTests {
  private RobotClass robot;
  private MazeLayout mazeObject;
  private Position position;
  
  private void initMaze() {
    mazeObject.id = (long) 99999;
    mazeObject.size = 3;
    mazeObject.layout = "213010000";
    mazeObject.uses = 0;
    mazeObject.creatorId = 88888;
  }
  
  @BeforeEach
  private void setup() {
    mazeObject = new MazeLayout();
    initMaze();
    robot = new RobotClass(mazeObject);
    position = new Position();
  }
  
  @Test
  void passIfStartPositionCorrect() {
    position.x = 0;
    position.y = 0;
    assertEquals(position.x, robot.getCurrPosition().x);
    assertEquals(position.y, robot.getCurrPosition().y);
  }
  
  @Test
  void passIfStartDirectionCorrect() {
    assertEquals(DirectionEnum.RIGHT, robot.getCurrDirection());
  }
  
  @Test
  void passIfStartPositionScansCorrect() {
    assertEquals(GridTypeEnum.WALL, robot.scanForward());
    assertEquals(GridTypeEnum.WALL, robot.scanBackward());
    assertEquals(GridTypeEnum.WALL, robot.scanLeft());
    assertEquals(GridTypeEnum.PATH, robot.scanRight());
  }
  
  @Test
  void passIfLeftCircleRotationCorrect() {
    robot.rotateLeft();
    assertEquals(DirectionEnum.UP, robot.getCurrDirection());
    robot.rotateLeft();
    assertEquals(DirectionEnum.LEFT, robot.getCurrDirection());
    robot.rotateLeft();
    assertEquals(DirectionEnum.DOWN, robot.getCurrDirection());
    robot.rotateLeft();
    assertEquals(DirectionEnum.RIGHT, robot.getCurrDirection());
  }
  
  @Test
  void passIfRightCircleRotationCorrect() {
    robot.rotateRight();
    assertEquals(DirectionEnum.DOWN, robot.getCurrDirection());
    robot.rotateRight();
    assertEquals(DirectionEnum.LEFT, robot.getCurrDirection());
    robot.rotateRight();
    assertEquals(DirectionEnum.UP, robot.getCurrDirection());
    robot.rotateRight();
    assertEquals(DirectionEnum.RIGHT, robot.getCurrDirection());
  }
  
  @Test
  void passIfThrowsOnMoveToWall() {
    assertThrows(Exception.class, () -> {robot.moveForward();});
    assertThrows(Exception.class, () -> {robot.moveBackward();});
  }
  
  @Test
  void passIfMoveForwardToPath() {
    robot.rotateRight();
    try {
      robot.moveForward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    position.x = 0;
    position.y = 1;
    assertEquals(position.x, robot.getCurrPosition().x);
    assertEquals(position.y, robot.getCurrPosition().y);
  }
  
  @Test
  void passIfMoveBackwardToPath() {
    robot.rotateRight();
    try {
      robot.moveForward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    position.x = 0;
    position.y = 1;
    assertEquals(position.x, robot.getCurrPosition().x);
    assertEquals(position.y, robot.getCurrPosition().y);
    try {
      robot.moveBackward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    position.x = 0;
    position.y = 0;
    assertEquals(position.x, robot.getCurrPosition().x);
    assertEquals(position.y, robot.getCurrPosition().y);
  }
  
  @Test
  void passIfMovesToFinishCorrectly() {
    // rotate and move to bottom left of maze
    robot.rotateRight();
    try {
      robot.moveForward();
      robot.moveForward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    // rotate and move to bottom right of maze
    robot.rotateLeft();
    try {
      robot.moveForward();
      robot.moveForward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    // rotate and move to finish at top right of maze
    robot.rotateLeft();
    try {
      robot.moveForward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    assertThrows(Exception.class, () -> {robot.moveForward();});
  }
  
  @Test
  void passIfGridBeforeFinishScansCorrect() {
    // move to grid just below the finish position
    robot.rotateRight();
    try {
      robot.moveForward();
      robot.moveForward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    robot.rotateLeft();
    try {
      robot.moveForward();
      robot.moveForward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    robot.rotateLeft();
    try {
      robot.moveForward();
    } catch (Exception e) {
      e.printStackTrace();
    }
    // scan
    assertEquals(GridTypeEnum.FINISH, robot.scanForward());
    assertEquals(GridTypeEnum.PATH, robot.scanBackward());
    assertEquals(GridTypeEnum.WALL, robot.scanLeft());
    assertEquals(GridTypeEnum.WALL, robot.scanRight());
  }
}