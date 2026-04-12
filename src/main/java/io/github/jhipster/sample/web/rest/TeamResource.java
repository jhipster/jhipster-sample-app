package io.github.jhipster.sample.web.rest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Custom REST controller for Assignment Task 1.
 */
@RestController
@RequestMapping("/api")
public class TeamResource {

    @GetMapping("/team-info")
    public String getTeamInfo() {
        return "Assignment Task 1: CI/CD Pipeline running successfully for our team!";
    }
}
