package com.learninglabyrinth.backend.runner;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Starts a new process and passes the user's code to it as command line
 * arguments.
 */
public class UserCodeProcess {
  private String userCodeClass;
  /**
   * Starts a new process using ProcessBuilder for the running of the user's
   * code.
   * 
   * @param mazeLayout: String representation of the maze being attempted;
   * @param       code: Source code to be compiled and ran
   */
  public String startProcess(String code, String mazeLayout) {
    String output = "";
    // wrap user's code
    userCodeClass = UserCodeWrapper.top + code + UserCodeWrapper.bottom;
    // double the escaped double quotes to prevent removal by ProcessBuilder
    userCodeClass = userCodeClass.replace("\"", "\"\"");
    ProcessBuilder processBuilder = new ProcessBuilder(
                                          "java",
                                          "-cp",
                                          System.getProperty("java.class.path"),
                                          "com.learninglabyrinth"
                                           + ".backend"
                                           + ".runner"
                                           + ".UserCodeExecutor",
                                          mazeLayout,
                                          userCodeClass
                                        );
    StringBuilder outputBuilder = new StringBuilder();
    try {
      Process process = processBuilder.start();
      // read the output of the process
      try (BufferedReader reader =
          new BufferedReader(new InputStreamReader(process.getInputStream()))) {
        String line;
        while ((line = reader.readLine()) != null) {
          outputBuilder.append(line).append(System.lineSeparator());
        }
      }
      // wait for the process to finish and get the exit code
      int exitCode = process.waitFor();
      System.out.println("Child Process exited with code " + exitCode);
      // access the captured output
      output = outputBuilder.toString();
    } catch (IOException e) {
      e.printStackTrace();
    } catch  (InterruptedException e) {
      e.printStackTrace();
    }
    return output;
  }
}
