package com.codeAssessment.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.codeAssessment.backend.model.Submission;
import com.codeAssessment.backend.service.SubmissionService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private SubmissionService submissionService;

    @GetMapping("/submissions")
    public List<Submission> getAllSubmissions(@RequestParam(required = false) Long problemId,
                                              @RequestParam(required = false) String email) {
        return submissionService.getFilteredSubmissions(problemId, email);
    }
}
