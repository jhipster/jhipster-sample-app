package io.github.jhipster.sample.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.http.MediaType.APPLICATION_JSON;

import io.github.jhipster.sample.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@IntegrationTest
@AutoConfigureMockMvc
class AuthenticationExtraIT {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Test login with invalid credentials
     */
    @Test
    void testAuthenticate_InvalidCredentials() throws Exception {
        String requestBody = "{\"username\":\"admin\",\"password\":\"wrongpassword\"}";

        mockMvc.perform(post("/api/authenticate")
                .contentType(APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isUnauthorized());
    }

    /**
     * Test login with empty credentials
     */
    @Test
    void testAuthenticate_EmptyCredentials() throws Exception {
        String requestBody = "{\"username\":\"\",\"password\":\"\"}";

        mockMvc.perform(post("/api/authenticate")
                .contentType(APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }

    /**
     * Test login with malformed JSON
     */
    @Test
    void testAuthenticate_InvalidJSON() throws Exception {
        String requestBody = "{invalid-json}";

        mockMvc.perform(post("/api/authenticate")
                .contentType(APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest());
    }
}