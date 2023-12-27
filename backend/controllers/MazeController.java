package com.learninglabyrinth.backend.controllers;

import com.learninglabyrinth.backend.models.MazeLayout;
import com.learninglabyrinth.backend.services.AccountService;
import com.learninglabyrinth.backend.services.MazeService;

import jakarta.transaction.Transactional;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Contains endpoint methods to respond to HTTP requests sent to any path
 * beginning with "/mazes"
 * 
 * @author Ben Persick
 */
@RestController
@CrossOrigin
@RequestMapping("/mazes")
public class MazeController {

  private final MazeService service;
  private final int MAX_MAZE_SIZE = 15;
  private final int MIN_MAZE_SIZE = 2;

  public MazeController(MazeService service) {
    this.service = service;
  }

  /**
   * Attempts to create maze layout entry in the database using the values given
   * by the request parameters. If any parameter's value is invalid, responds with
   * error code and message describing the problem.
   * 
   * @param size         the size (edge length) of the new maze layout
   * @param layout       the string of digits representing the layout
   * @param creatorToken the UUID of the account that created the maze layout
   * @return the MazeLayout object (automatically serialized as JSON)
   *         corresponding to the newly-created entry, including the
   *         newly-generated ID value
   */
  @PostMapping("/createMaze")
  public MazeLayout createMazeLayout(@RequestParam int size, @RequestParam String layout,
      @RequestParam UUID creatorToken) {
    // validate parameters
    boolean requestValid = true;
    String message = "";

    int numStartPoints = numOccurrences(layout, '2');
    int numEndPoints = numOccurrences(layout, '3');

    if (!AccountService.hashMap.containsKey(creatorToken)) {
      requestValid = false;
      message = "There is currently no logged-in user with the provided token (" + creatorToken.toString() + ")";
    } else if (size < MIN_MAZE_SIZE) {
      requestValid = false;
      message = "Maze size(" + size + ") is below minimum (" + MIN_MAZE_SIZE + ")";
    } else if (size > MAX_MAZE_SIZE) {
      requestValid = false;
      message = "Maze size (" + size + ") is above maximum (" + MAX_MAZE_SIZE + ")";
    } else if (size * size != layout.length()) {
      requestValid = false;
      message = "Layout string length (" + layout.length() + ") does not match square of size (" + (size * size) + ")";
    } else if (numStartPoints != 1) {
      requestValid = false;
      message = "Layout has " + numStartPoints + " start points, but may only have exactly 1.";
    } else if (numEndPoints != 1) {
      requestValid = false;
      message = "Layout has " + numEndPoints + " end points, but may only have exactly 1.";
    }

    if (!requestValid) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    MazeLayout newLayout = new MazeLayout();
    newLayout.size = size;
    newLayout.layout = layout;
    newLayout.uses = 0;
    newLayout.creatorId = AccountService.hashMap.get(creatorToken).id;

    try {
      return service.saveMazeLayout(newLayout);
    } catch (Exception ex) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Attempts to retrieve a maze layout with the given ID from the database.
   * Responds with 404 code if no such maze layout is found.
   * 
   * @param mazeID The ID of the maze to attempt to retrieve
   * @return the MazeLayout object corresponding to the entry with the given ID,
   *         if one is found (automatically serialized as JSON)
   */
  @GetMapping("/getMaze")
  public MazeLayout getMazeLayout(@RequestParam long mazeID) {
    try {
      // attempt to retrieve layout based on ID
      Optional<MazeLayout> layout = service.getMazeLayout(mazeID);

      // return response code if no layout with the given ID was found
      if (layout.isEmpty()) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No maze layout with the ID " + mazeID + " was found");
      }

      return layout.get();
    } catch (Exception ex) {
      // return response code if any other error occurs
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Retrieves all mazes from the database.
   * 
   * @return list of all mazes
   * @author Alex Green
   */
  @GetMapping("/getMazes")
  public Iterable<MazeLayout> getMazes(@RequestParam UUID token) {
    try {
      return service.getMazes();
    } catch (Exception ex) {
      // return response code if any other error occurs
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Attempts to update a maze layout entry in the database using the values given
   * by the request parameters. If any parameter's value is invalid, responds with
   * error code and message describing the problem.
   * 
   * @param id           the ID of the maze layout to update
   * @param size         the new size value for the maze layout
   * @param layout       the new layout string for the maze layout
   * @param creatorToken the token corresponding to the user sending the request
   * @return the MazeLayout object (automatically serialized as JSON) with the
   *         updated values
   */
  @PutMapping("/updateMaze")
  public MazeLayout updateMazeLayout(@RequestParam long id, @RequestParam int size, @RequestParam String layout,
      @RequestParam UUID creatorToken) {
    // validate parameters
    boolean requestValid = true;
    String message = "";

    int numStartPoints = numOccurrences(layout, '2');
    int numEndPoints = numOccurrences(layout, '3');

    Optional<MazeLayout> potentialMazeLayout = service.getMazeLayout(id);

    if (!AccountService.hashMap.containsKey(creatorToken)) {
      requestValid = false;
      message = "There is currently no logged-in user with the provided token (" + creatorToken.toString() + ")";
    } else if (potentialMazeLayout.isEmpty()) {
      requestValid = false;
      message = "No maze layout with the id " + id + " was found";
    } else if (potentialMazeLayout.get().creatorId != AccountService.hashMap.get(creatorToken).id) {
      // requestValid = false;
      // message = "The currently logged-in user did not create the maze with the id "
      // + id;
    } else if (size < MIN_MAZE_SIZE) {
      requestValid = false;
      message = "Maze size(" + size + ") is below minimum (" + MIN_MAZE_SIZE + ")";
    } else if (size > MAX_MAZE_SIZE) {
      requestValid = false;
      message = "Maze size (" + size + ") is above maximum (" + MAX_MAZE_SIZE + ")";
    } else if (size * size != layout.length()) {
      requestValid = false;
      message = "Layout string length (" + layout.length() + ") does not match square of size (" + (size * size) + ")";
    } else if (numStartPoints != 1) {
      requestValid = false;
      message = "Layout has " + numStartPoints + " start points, but may only have exactly 1.";
    } else if (numEndPoints != 1) {
      requestValid = false;
      message = "Layout has " + numEndPoints + " end points, but may only have exactly 1.";
    }

    if (!requestValid) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    // update and save layout
    MazeLayout mazeToUpdate = potentialMazeLayout.get();

    mazeToUpdate.size = size;
    mazeToUpdate.layout = layout;

    return service.saveMazeLayout(mazeToUpdate);
  }

  /**
   * Attempts to delete the maze layout with the ID given by the request
   * parameter. Responds with an error code if the maze does not exist, or the
   * currently logged-in user did not create the maze with the given ID
   * 
   * @param id           the ID of the maze layout to delete
   * @param creatorToken the token corresponding to the user sending the request
   */
  @DeleteMapping("/delete")
  @Transactional
  public void deleteMazeLayout(@RequestParam long id, @RequestParam UUID creatorToken) {
    // validate parameters
    boolean requestValid = true;
    String message = "";

    Optional<MazeLayout> potentialMazeLayout = service.getMazeLayout(id);

    if (!AccountService.hashMap.containsKey(creatorToken)) {
      requestValid = false;
      message = "There is currently no logged-in user with the provided token (" + creatorToken.toString() + ")";
    } else if (potentialMazeLayout.isEmpty()) {
      requestValid = false;
      message = "No maze layout with the id " + id + " was found";
    } else if (potentialMazeLayout.get().creatorId != AccountService.hashMap.get(creatorToken).id) {
      // requestValid = false;
      // message = "The currently logged-in user did not create the maze with the id "
      // + id;
    }

    if (!requestValid) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }

    // delete layout
    service.deleteMazeLayout(id);
  }

  /**
   * Counts the number of occurrence of a character within a string
   * 
   * @param str the string through which to search
   * @param ch  the character for which to search
   * @return the number of occurrences of ch found in str
   */
  private static int numOccurrences(String str, char ch) {
    int count = 0;

    char[] strAsArr = str.toCharArray();

    for (char currCh : strAsArr) {
      if (currCh == ch) {
        count++;
      }
    }

    return count;
  }

  /**
   * Retrieves the top three most popular mazes in the repository.
   *
   * @return the list of the top three most popular mazes in descending order
   *         according to popularity
   */
  @GetMapping("/getPopularMazes")
  public List<MazeLayout> getPopularMazes() {
    try {
      return service.getPopularMazes();
    } catch (Exception e) {
      throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
