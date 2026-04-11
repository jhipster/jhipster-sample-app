package io.github.jhipster.sample.web.rest;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import io.github.jhipster.sample.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

@IntegrationTest
@AutoConfigureMockMvc
class UserResourceExtraIT {

    @Autowired
    private MockMvc mockMvc;

    /**
     * Test accessing user list without authentication
     */
    @Test
    void testGetAllUsers_Unauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
            .andExpect(status().isUnauthorized());
    }

    /**
     * Test accessing user list with admin role
     */
    @Test
    @WithMockUser(roles = "ADMIN")
    void testGetAllUsers_AsAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
            .andExpect(status().isOk());
    }

    /**
     * Test accessing user list with normal user role
     */
    @Test
    @WithMockUser(roles = "USER")
    void testGetAllUsers_AsUser_ShouldFail() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
            .andExpect(status().isForbidden());
    }
}