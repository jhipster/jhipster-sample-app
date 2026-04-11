package io.github.jhipster.sample.web.rest;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.jhipster.sample.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

@IntegrationTest
class AuthenticationExtraIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testAuthenticate_InvalidCredentials() throws Exception {
        String requestBody = "{\"username\":\"admin\",\"password\":\"wrongpassword\"}";

        mockMvc.perform(post("/api/authenticate").contentType(APPLICATION_JSON).content(requestBody)).andExpect(status().isUnauthorized());
    }
}
