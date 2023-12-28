package com.learninglabyrinth.backend.runner;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import javax.tools.JavaCompiler;
import javax.tools.ToolProvider;

/**
 * Dynamically loads and compiles Java code at runtime.
 */
public class UserClassLoader extends ClassLoader {
  
  /**
   * Loads a class from a provided name and code string.
   *
   * @param name: The name of the class.
   * @param code: The Java source code of the class.
   * @return The loaded class.
   * @throws ClassNotFoundException: If the class cannot be found or loaded.
   */
  public Class<?> loadClass(String name, String code) {
    byte[] byteCode = compileCode(name, code);
    return defineClass(name, byteCode, 0, byteCode.length);
  }
  
  /**
   * Compiles the provided Java source code and return the compiled byte code.
   *
   * @param name: The name of the class.
   * @param code: The Java source code of the class.
   * @return The compiled byte code.
   */
  private byte[] compileCode(String name, String code) {
    // write the code to a temporary file
    Path sourcePath = Path.of(name + ".java");
    try {
      Files.write(sourcePath, code.getBytes());
    } catch (IOException e) {
      e.printStackTrace();
    }
    // compile the code using Java Compiler API
    JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
    int compilationResult = compiler.run(null,
                                         null,
                                         null,
                                         sourcePath.toString());
    if (compilationResult != 0) {
      throw new RuntimeException("Compilation failed");
    }
    // load the compiled class file
    try {
      Path classFilePath = Path.of(name + ".class");
      return Files.readAllBytes(classFilePath);
    } catch (IOException e) {
      e.printStackTrace();
      throw new RuntimeException("Error reading compiled class file");
    } finally {
      // clean up temporary files
      try {
        Files.deleteIfExists(sourcePath);
        Files.deleteIfExists(Path.of(name + ".class"));
      } catch (IOException e) {
        e.printStackTrace();
      }
    }
  }
}
