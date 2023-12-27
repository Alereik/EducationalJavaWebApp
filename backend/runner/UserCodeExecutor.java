package com.learninglabyrinth.backend.runner;

import java.lang.reflect.Method;

import com.learninglabyrinth.backend.models.MazeLayout;

/**
 * Executes user code using reflection.
 */
public class UserCodeExecutor {

  /**
   * Main function. Runs the user's compiled code using reflection.
   * 
   * @param args: The user's Java code as a String or Strings.
   */
  public static void main(String[] args) {
    // create MazeLayout argument to pass to user code's class
    MazeLayout mazeLayout = new MazeLayout();
    mazeLayout.layout = args[0];
    String sourceCode = "";
    // if ProcessBuilder splits code on spaces, recombine and restore spaces
    for (int i = 1; i < args.length; ++i) {
      sourceCode += args[i];
      if (i < args.length - 1) {
        sourceCode += " ";
      }
    }
    try {
      // create a new class loader
      UserClassLoader classLoader = new UserClassLoader();
      // load the class dynamically
      Class<?> dynamicClass = classLoader.loadClass("UserCode", sourceCode);
      // create an instance of the dynamically loaded class
      Object dynamicObject = dynamicClass
                             .getDeclaredConstructor(MazeLayout.class)
                             .newInstance(mazeLayout);
      // invoke method dynamically
      Method method = dynamicClass.getMethod("mazeAlgorithm");
      method.invoke(dynamicObject);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}

