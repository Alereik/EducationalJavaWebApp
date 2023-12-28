package com.learninglabyrinth.backend.runner;

/**
 * Wrapper code for the user's code text.
 */
public class UserCodeWrapper {
  protected static final String top =
      "import java.util.List;\n"
    + "import java.util.ArrayList;\n"
    + "import com.learninglabyrinth.backend.models.MazeLayout;\n"
    + "import com.learninglabyrinth.backend.robot.*;\n"
    + "public class UserCode {\n"
    + "  private MazeLayout mazeLayout;\n"
    + "  private RobotClass robot;\n"
    + "  public UserCode(MazeLayout mazeLayout) {\n"
    + "    this.mazeLayout = mazeLayout;\n"
    + "    this.mazeLayout.size = (int) Math.sqrt(mazeLayout.layout.length());\n"
    + "    this.robot = new RobotClass(mazeLayout);\n"
    + "  }\n"
    + "  public void mazeAlgorithm() throws Exception {\n"
    + "    try {\n";
  
  protected static final String bottom =
     "    } catch (Exception e) {\n"
     + "    } finally {\n"
     + "      System.out.println(robot.getMovements());"
     + "    }"
     + "  }\n"
     + "}\n";
}
