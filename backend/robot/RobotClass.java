package com.learninglabyrinth.backend.robot;

import java.util.ArrayList;
import java.util.List;

import com.learninglabyrinth.backend.models.MazeLayout;

/**
 * The Robot class keeps track of the robots position and facing direction, and
 * performs all allowable moves that can be made by the robot in its attempt to
 * navigate the maze.
 * 
 * @author Alvin Osterndorff
 */
public class RobotClass {
  private List<MovementEnum> movements; // history of attempt's completed moves
  private GridTypeEnum[][] maze;        // map of maze in grid types
  private DirectionEnum currDirection;  // current direction robot is facing
  private Position currPosition;        // current position of the robot
  private Position tgtPosition;         // target position for scanning
  private MazeLayout mazeLayout;        // string representation of maze
  
  // Maps the directions relative to which way the robot is facing to those
  // relative to the robot's location in the maze. Allows for 2D matrix indexing
  // (x = i, y = j).
  // The order of the robot's facing directions is UP, DOWN, LEFT, RIGHT.
  private DirectionEnum[][] adjacentMappings = {// mapping for left of robot
  /*   Facing UP: left = left of position   */  {DirectionEnum.LEFT,
  /* Facing DOWN: left = right of position  */   DirectionEnum.RIGHT,
  /* Facing LEFT: left = below position     */   DirectionEnum.DOWN,
  /*Facing RIGHT: left = above position     */   DirectionEnum.UP},
                                            	  // mapping for right of robot
  /*   Facing UP: right = right of position */  {DirectionEnum.RIGHT,
  /* Facing DOWN: right = left of position  */   DirectionEnum.LEFT,
  /* Facing LEFT: right = above position    */   DirectionEnum.UP,
  /*Facing RIGHT: right = below position    */   DirectionEnum.DOWN},
                                                // mapping for front of robot
  /*   Facing UP: front = above position    */  {DirectionEnum.UP,
  /* Facing DOWN: front = below position    */   DirectionEnum.DOWN,
  /* Facing LEFT: front = left of position  */   DirectionEnum.LEFT,
  /*Facing RIGHT: front = right of position */   DirectionEnum.RIGHT},
                                            	  // mapping for behind robot
  /*   Facing UP: behind = below position   */  {DirectionEnum.DOWN,
  /* Facing DOWN: behind = above position   */   DirectionEnum.UP,
  /* Facing LEFT: behind = right of position*/   DirectionEnum.RIGHT,
  /*Facing RIGHT: behind = left of position */   DirectionEnum.LEFT}};

  /**
   * Constructor for the Robot. Initializes the fields necessary to begin the
   * maze attempt.
   * 
   * @param mazeLayout: The maze object containing a string representation of
   *                    the maze.
   */
  public RobotClass(MazeLayout mazeLayout) {
    this.mazeLayout = mazeLayout;
    this.currPosition = new Position();
    this.tgtPosition = new Position();
    buildMazeArray();
    this.movements = new ArrayList<>();
    this.currDirection = DirectionEnum.RIGHT;
  }

  /**
   * Constructs a 2D array of GridTypeEnum values from the mazeLayout layout
   * string. The starting position is given the value of PATH as it can be
   * traversed by the robot. The maze and currPosition fields are initialized in
   * this method.
   */
  private void buildMazeArray() {
    maze = new GridTypeEnum[mazeLayout.size][mazeLayout.size];
    int currentChar = 0;
    for (int y = 0; y < mazeLayout.size; ++y) {
      for (int x = 0; x < mazeLayout.size; ++x) {
        switch (mazeLayout.layout.charAt(currentChar)) {
          case '0':
            maze[x][y] = GridTypeEnum.PATH;
            break;
          case '1':
            maze[x][y] = GridTypeEnum.WALL;
            break;
          case '2': // start position
            currPosition.x = x;
            currPosition.y = y;
            maze[x][y] = GridTypeEnum.PATH;
            break;
          case '3':
            maze[x][y] = GridTypeEnum.FINISH;
            break;
        }
        ++currentChar;
      }
    }
  }

  /**
   * Sets coordinates of scannedPosition to those of a grid adjacent to
   * currPosition, in the specified direction relative to currPosition.
   * 
   * @param scannedGrid: The map of the maze in grid types
   */
  private void getScanGridCoords(DirectionEnum scannedGrid) {
    // set scannedPosition's coordinates to that of currPosition's
    tgtPosition.x = currPosition.x;
    tgtPosition.y = currPosition.y;
    // alter scannedPosition's coordinates to those of an adjacent one in the
    // specified direction
    switch (scannedGrid) {
      case UP:
        --tgtPosition.y;
        break;
      case DOWN:
        ++tgtPosition.y;
        break;
      case LEFT:
        --tgtPosition.x;
        break;
      case RIGHT:
        ++tgtPosition.x;
        break;
    }
  }

  /**
   * Retrieves the GridTypeEnum of the grid being scanned.
   * 
   * @param directionMapping: The directions to scan in relative to the robot's
   *                          location.
   * @return The grid type of the scanned grid.
   */
  private GridTypeEnum getScanGridType(DirectionEnum[] directionMapping) {
    GridTypeEnum gridType;
    // Retrieve the coordinates to scan with the direction translated to the
    // that relative to the robot's location in the maze
    switch (currDirection) {
      case UP:
        getScanGridCoords(directionMapping[0]);
        break;
      case DOWN:
        getScanGridCoords(directionMapping[1]);
        break;
      case LEFT:
        getScanGridCoords(directionMapping[2]);
        break;
      case RIGHT:
        getScanGridCoords(directionMapping[3]);
        break;
    }
    // ensure x and y values are within index bounds of maze
    if (tgtPosition.x < 0 || tgtPosition.x >= mazeLayout.size ||
        tgtPosition.y < 0 || tgtPosition.y >= mazeLayout.size) {
      gridType = GridTypeEnum.WALL;
    }
    else {
      gridType = maze[tgtPosition.x][tgtPosition.y];
    }
    return gridType;
  }

  /**
   * Scans the grid to the left of the robot relative to its current facing
   * direction.
   * 
   * @return The grid type of grid that was scanned
   */
  public GridTypeEnum scanLeft() {
    return getScanGridType(adjacentMappings[0]); // mapping for left of robot
  }

  /**
   * Scans the grid to the right of the robot relative to its current facing
   * direction.
   * 
   * @return The grid type of grid that was scanned
   */
  public GridTypeEnum scanRight() {
    return getScanGridType(adjacentMappings[1]); // mapping for right of robot
  }

  /**
   * Scans the grid in front of the robot relative to its current facing
   * direction.
   * 
   * @return The grid type of grid that was scanned
   */
  public GridTypeEnum scanForward() {
    return getScanGridType(adjacentMappings[2]); // mapping for front of robot
  }

  /**
   * Scans the grid behind the robot relative to its current facing direction.
   * 
   * @return The grid type of grid that was scanned
   */
  public GridTypeEnum scanBackward() {
    return getScanGridType(adjacentMappings[3]); // mapping for behind robot
  }
  
  /**
   * Set's the robot's current position to the grid ahead of it or behind it
   * depending on the direction specified.
   * 
   * @throws Exception: Thrown if the position the robot is attempting to move
   *                    to is a wall, or if the robot has reached the finish.
   */
  private void moveLongitudinally(MovementEnum move) throws Exception {
    // assign destination grid type and movement direction based on argument
    GridTypeEnum destinationType;
    MovementEnum moveToPerform;
    if (move == MovementEnum.FORWARD) {
      destinationType = scanForward();
      moveToPerform = MovementEnum.FORWARD;
    }
    else {
      destinationType = scanBackward();
      moveToPerform = MovementEnum.BACKWARD;
    }
    // check for move to wall, move if not wall, check for finish
    if (destinationType == GridTypeEnum.WALL) {
      movements.add(MovementEnum.FAILURE);
      throw new Exception();
    }
    movements.add(moveToPerform);
    if (destinationType == GridTypeEnum.FINISH) {
      movements.add(MovementEnum.SUCCESS);
      throw new Exception();
    }
    // update robot position
    currPosition.x = tgtPosition.x;
    currPosition.y = tgtPosition.y;
  }

  /**
   * Set's the current position of the robot to the grid in front of it,
   * provided that said position is not a wall.
   * 
   * @throws Exception: See implementation comment for moveLongitudinally()
   *                    above.
   */
  public void moveForward() throws Exception {
    moveLongitudinally(MovementEnum.FORWARD);
  }

  /**
   * Set's the current position of the robot to the grid behind it, provided
   * that said position is not a wall.
   * 
   * @throws Exception: See implementation comment for moveLongitudinally()
   *                    above.
   */
  public void moveBackward() throws Exception {
    moveLongitudinally(MovementEnum.BACKWARD);
  }

  /**
   * Rotates the robot's facing direction to either the left or the right based
   * on the mappings provided.
   * 
   * @param directionMapping: The direction to face the robot towards relative
   *                          to its location in the maze.
   */
  private void rotate(DirectionEnum[] directionMapping) {
    // translate the direction from that relative to the robot's direction to
    // that relative to its location
    switch (currDirection) {
      case UP:
        currDirection = directionMapping[0];
        break;
      case DOWN:
        currDirection = directionMapping[1];
        break;
      case LEFT:
        currDirection = directionMapping[2];
        break;
      case RIGHT:
        currDirection = directionMapping[3];
        break;
    }
  }

  /**
   * Rotates the robot so that it is facing to the left of where it had been
   * previously.
   */
  public void rotateLeft() {
    rotate(adjacentMappings[0]); // pass mapping for left of robot
    movements.add(MovementEnum.ROTATE_LEFT);
  }

  /**
   * Rotates the robot so that it is facing to the left of where it had been
   * previously.
   */
  public void rotateRight() {
    rotate(adjacentMappings[1]); // pass mapping for right of robot
    movements.add(MovementEnum.ROTATE_RIGHT);
  }

  /**
   * Getter method for currPosition.
   * 
   * @return currPosition: The robot's current position
   */
  public Position getCurrPosition() {
    return currPosition;
  }

  /**
   * Getter method for currDirection.
   * 
   * @return currDirection: The robot's current facing direction
   */
  public DirectionEnum getCurrDirection() {
    return currDirection;
  }

  /**
   * Getter method for the list of movements made by the robot.
   * 
   * @return movements: The list of movements made by the robot in this attempt
   */
  public List<MovementEnum> getMovements() {
    return movements;
  }
}
