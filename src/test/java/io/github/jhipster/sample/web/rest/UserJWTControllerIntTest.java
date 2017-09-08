package io.github.jhipster.sample.web.rest;

import io.github.jhipster.sample.JhipsterSampleApplicationApp;
import io.github.jhipster.sample.domain.User;
import io.github.jhipster.sample.repository.UserRepository;
import io.github.jhipster.sample.security.jwt.TokenProvider;
import io.github.jhipster.sample.web.rest.vm.LoginVM;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test class for the UserJWTController REST controller.
 *
 * @see UserJWTController
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
public class UserJWTControllerIntTest {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private MockMvc mockMvc;

    @Before
    public void setup() {
        UserJWTController userJWTController = new UserJWTController(tokenProvider, authenticationManager);
        this.mockMvc = MockMvcBuilders.standaloneSetup(userJWTController)
            .build();
    }

    @Test
    @Transactional
    public void testAuthorize() throws Exception {
        User user = new User();
        user.setLogin("user-jwt-controller");
        user.setEmail("user-jwt-controller@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));

        userRepository.saveAndFlush(user);

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt-controller");
        login.setPassword("test");
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id_token").isString())
            .andExpect(jsonPath("$.id_token").isNotEmpty());
    }

    @Test
    @Transactional
    public void testAuthorizeWithRememberMe() throws Exception {
        User user = new User();
        user.setLogin("user-jwt-controller-remember-me");
        user.setEmail("user-jwt-controller-remember-me@example.com");
        user.setActivated(true);
        user.setPassword(passwordEncoder.encode("test"));

        userRepository.saveAndFlush(user);

        LoginVM login = new LoginVM();
        login.setUsername("user-jwt-controller-remember-me");
        login.setPassword("test");
        login.setRememberMe(true);
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id_token").isString())
            .andExpect(jsonPath("$.id_token").isNotEmpty());
    }

    @Test
    @Transactional
    public void testAuthorizeFails() throws Exception {
        LoginVM login = new LoginVM();
        login.setUsername("wrong-user");
        login.setPassword("wrong password");
        mockMvc.perform(post("/api/authenticate")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(login)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.id_token").doesNotExist());
    }
}
