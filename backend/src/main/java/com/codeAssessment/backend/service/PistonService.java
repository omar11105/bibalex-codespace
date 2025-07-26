package com.codeAssessment.backend.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.Data;

@Service
public class PistonService {
    // This service handles code execution using the Piston API
    private final String pistonUrl = "https://emkc.org/api/v2/piston/execute";
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * This method returns the file extension based on the programming language.
     * @param language The programming language for which the file extension is needed.
     * @return The file extension as a string.
     */
    private String getFileExtension(String language) {
        return switch (language) {
            case "python3" -> "py";
            case "java" -> "java";
            case "cpp" -> "cpp";
            default -> "txt";
        };
    }

    /**
     * This method returns the version of the programming language to be used in the Piston API request.
     * @param language The programming language for which the version is needed.
     * @return The version string for the specified language.
     */
    private String getVersionForLanguage(String language) {
        return switch (language) {
            case "python3" -> "3.10.0";
            case "java" -> "15.0.2";
            case "cpp" -> "10.2.0";
            default -> "3.10.0";
        };
    }

    /**
     * This method executes code using the Piston API.
     * It preprocesses the code to handle function calls and input,
     * then sends a request to the Piston service.
     * @param code The code to be executed.
     * @param language The programming language of the code.
     * @param input The input to be passed to the code.
     * @return The output of the executed code.
     */
    public String executeCode(String code, String language, String input) {
        // Preprocess the code to handle function calls
        String processedCode = preprocessCode(code, language, input);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> file = Map.of(
            "name", "Main." + getFileExtension(language),
            "content", processedCode
        );

        Map<String, Object> payload = Map.of(
            "language", language,
            "version", getVersionForLanguage(language),
            "files", List.of(file),
            "stdin", ""
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<PistonResponse> response = null;
        try {
            response = restTemplate.exchange(
                pistonUrl,
                HttpMethod.POST,
                request,
                PistonResponse.class
            );

            PistonResponse body = response.getBody();
            if (body == null) {
                throw new RuntimeException("No response body received from Piston service");
            }
            
            if (body.getRun() == null) {
                throw new RuntimeException("No run data in Piston response");
            }
            
            String output = body.getRun().getOutput();
            if (output == null) {
                // Check if there's stderr for error information
                String stderr = body.getRun().getStderr();
                if (stderr != null && !stderr.trim().isEmpty()) {
                    throw new RuntimeException("Code execution error: " + stderr.trim());
                }
                throw new RuntimeException("No output received from code execution");
            }
            
            return output.trim();

        } catch (Exception e) {
            // Piston execution error occurred
            if(response != null) {
                // Piston response logged
            }
            
            throw new RuntimeException("Error executing code: " + e.getMessage());
        }
    }

    /**
     * This method preprocesses the code to handle function calls and input.
     * It modifies the code based on the programming language to ensure it runs correctly with the provided input.
     * @param code The original code to be executed.
     * @param language The programming language of the code.
     * @param input The input to be passed to the code.
     * @return The preprocessed code ready for execution.
     */
    private String preprocessCode(String code, String language, String input) {
        if (input == null || input.trim().isEmpty()) {
            return code;
        }

        switch (language) {
            case "python3":
                return preprocessPythonCode(code, input);
            case "javascript":
                return preprocessJavaScriptCode(code, input);
            case "java":
                return preprocessJavaCode(code, input);
            case "cpp":
                return preprocessCppCode(code, input);
            default:
                return code;
        }
    }

    /**
     * This method preprocesses Python code to ensure it can handle input correctly.
     * It checks for function definitions and adds a print statement to call the function with the input.
     * @param code The original Python code.
     * @param input The input to be passed to the code.
     * @return The preprocessed Python code ready for execution.
     */
    private String preprocessPythonCode(String code, String input) {
        // Check if code contains a function definition
        if (code.contains("def ") && !code.contains("print(")) {
            // Find the function name (simple heuristic)
            String[] lines = code.split("\n");
            String functionName = null;
            
            for (String line : lines) {
                line = line.trim();
                if (line.startsWith("def ")) {
                    // Extract function name
                    int start = 4; // "def ".length()
                    int end = line.indexOf("(");
                    if (end > start) {
                        functionName = line.substring(start, end).trim();
                        break;
                    }
                }
            }
            
            if (functionName != null) {
                // Add function call at the end
                return code + "\n\n# Call the function with input\nprint(" + functionName + "(" + input + "))";
            }
        }
        
        return code;
    }

    /**
     * This method preprocesses JavaScript code to ensure it can handle input correctly.
     * It checks for function definitions and adds a console.log statement to call the function with the input.
     * @param code The original JavaScript code.
     * @param input The input to be passed to the code.
     * @return The preprocessed JavaScript code ready for execution.
     */
    private String preprocessJavaScriptCode(String code, String input) {
        // Check if code contains a function definition
        if (code.contains("function ") && !code.contains("console.log(")) {
            // Find the function name (simple heuristic)
            String[] lines = code.split("\n");
            String functionName = null;
            
            for (String line : lines) {
                line = line.trim();
                if (line.startsWith("function ")) {
                    // Extract function name
                    int start = 9; // "function ".length()
                    int end = line.indexOf("(");
                    if (end > start) {
                        functionName = line.substring(start, end).trim();
                        break;
                    }
                }
            }
            
            if (functionName != null) {
                // Add function call at the end
                return code + "\n\n// Call the function with input\nconsole.log(" + functionName + "(" + input + "));";
            }
        }
        
        return code;
    }

    /**
     * This method preprocesses Java code to ensure it can handle input correctly.
     * It checks for the main method structure and adds a System.out.println statement to call the method with the input.
     * @param code The original Java code.
     * @param input The input to be passed to the code.
     * @return The preprocessed Java code ready for execution.
     */
    private String preprocessJavaCode(String code, String input) {
        // For Java, we need to handle the main method structure
        if (code.contains("public static") && !code.contains("System.out.println(")) {
            // Find the method name (simple heuristic)
            String[] lines = code.split("\n");
            String methodName = null;
            
            for (String line : lines) {
                line = line.trim();
                if (line.contains("public static") && line.contains("(")) {
                    // Extract method name
                    int start = line.indexOf("static") + 6;
                    int end = line.indexOf("(");
                    if (end > start) {
                        methodName = line.substring(start, end).trim();
                        break;
                    }
                }
            }
            
            if (methodName != null) {
                // Add method call in main method
                return code + "\n\n// Call the method with input\nSystem.out.println(" + methodName + "(" + input + "));";
            }
        }
        
        return code;
    }

    /**
     * This method preprocesses C++ code to ensure it can handle input correctly.
     * It checks for function definitions and adds a cout statement to call the function with the input.
     * @param code The original C++ code.
     * @param input The input to be passed to the code.
     * @return The preprocessed C++ code ready for execution.
     */
    private String preprocessCppCode(String code, String input) {
        if (code.contains("int ") && code.contains("(") && !code.contains("cout << ")) {
            // Find the function name
            String[] lines = code.split("\n");
            String functionName = null;
            
            for (String line : lines) {
                line = line.trim();
                if ((line.startsWith("int ") || line.startsWith("string ") || line.startsWith("double ")) && line.contains("(")) {
                    // Extract function name
                    int start = line.indexOf(" ") + 1;
                    int end = line.indexOf("(");
                    if (end > start) {
                        functionName = line.substring(start, end).trim();
                        break;
                    }
                }
            }
            
            if (functionName != null) {
                // Add function call in main
                return code + "\n\n// Call the function with input\ncout << " + functionName + "(" + input + ") << endl;";
            }
        }
        
        return code;
    }

    /**
     * This class represents the response structure from the Piston API.
     * It contains the run details including output, error messages, and exit code.
     */
    @Data
    private static class PistonResponse {
        private Run run;

        @Data
        private static class Run {
            private String stdout;
            private String stderr;
            private String output;
            private int code;
        }
    }
}
