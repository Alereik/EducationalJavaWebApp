package com.learninglabyrinth.backend.runner;

import java.util.ArrayList;
import java.util.List;

import com.learninglabyrinth.backend.robot.MovementEnum;

public class Test {
  static String mazeLayout = "213010000";
  
  static String userCode =    "return;"   ; /*
        "robot.rotateRight();\r\n"
      + "robot.moveForward();\r\n"
      + "robot.moveForward();\r\n"
      + "robot.rotateLeft();\r\n"
//      + "robot.rotateRight();\r\n"
//      + "robot.rotateRight();\r\n"
      + "robot.moveForward();\r\n"
      + "robot.moveForward();\r\n"
      + "robot.rotateLeft();\r\n"
      + "robot.moveForward();\r\n"
      + "robot.moveForward();\r\n";*/

  public static void main(String[] args) {
    UserCodeProcess thing = new UserCodeProcess();
    String test = thing.startProcess(userCode, mazeLayout);
    System.out.println(test);
    List<MovementEnum> movements = parseEnumList(test);

    System.out.println(movements.size() - 1);

  }

  private static List<MovementEnum> parseEnumList(String input) {
    String withoutBrackets;
    // remove square brackets
    if (input.length() < 3) {
      withoutBrackets = "FAILURE";
    }
    else {
      withoutBrackets = input.substring(1, input.length() - 3);
    }
    // split using comma
    String[] enumValues = withoutBrackets.split(",");
    // trim and convert to enum
    List<MovementEnum> enumList = new ArrayList<>();
    for (String value : enumValues) {
      MovementEnum enumConstant = MovementEnum.valueOf(value.trim());
      enumList.add(enumConstant);
    }
    return enumList;
  }
}
