package io.github.jhipster.sample.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.github.jhipster.sample.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

// This test class is for testing the user management endpoint. It verifies that unauthorized access to the user list is correctly handled and that authorized access with admin privileges returns the expected status.
@IntegrationTest
class UserResourceExtraIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testGetAllUsers_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/users")).andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllUsers_AsAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/users")).andExpect(status().isOk());
    }
}
