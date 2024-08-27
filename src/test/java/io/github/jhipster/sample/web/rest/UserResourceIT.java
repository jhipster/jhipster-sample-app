package io.github.jhipster.sample.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.jhipster.sample.IntegrationTest;
import io.github.jhipster.sample.domain.User;
import io.github.jhipster.sample.repository.UserRepository;
import io.github.jhipster.sample.security.AuthoritiesConstants;
import io.github.jhipster.sample.service.UserService;
import io.github.jhipster.sample.service.dto.AdminUserDTO;
import io.github.jhipster.sample.service.mapper.UserMapper;
import jakarta.persistence.EntityManager;
import java.util.*;
import java.util.Objects;
import java.util.function.Consumer;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link UserResource} REST controller.
 */
@AutoConfigureMockMvc
@WithMockUser(authorities = AuthoritiesConstants.ADMIN)
@IntegrationTest
class UserResourceIT {

    private static final String DEFAULT_LOGIN = "johndoe";
    private static final String UPDATED_LOGIN = "jhipster";

    private static final Long DEFAULT_ID = 1L;

    private static final String DEFAULT_EMAIL = "johndoe@localhost";
    private static final String UPDATED_EMAIL = "jhipster@localhost";

    private static final String DEFAULT_FIRSTNAME = "john";
    private static final String UPDATED_FIRSTNAME = "jhipsterFirstName";

    private static final String DEFAULT_LASTNAME = "doe";
    private static final String UPDATED_LASTNAME = "jhipsterLastName";

    private static final String DEFAULT_IMAGEURL = "http://placehold.it/50x50";
    private static final String UPDATED_IMAGEURL = "http://placehold.it/40x40";

    private static final String DEFAULT_LANGKEY = "en";
    private static final String UPDATED_LANGKEY = "fr";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private CacheManager cacheManager;

    @Autowired
    private MockMvc restUserMockMvc;

    private User user;

    private Long numberOfUsers;

    @BeforeEach
    public void countUsers() {
        numberOfUsers = userRepository.count();
    }

    /**
     * Create a User.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which has a required relationship to the User entity.
     */
    public static User createEntity() {
        User persistUser = new User();
        persistUser.setLogin(DEFAULT_LOGIN + RandomStringUtils.randomAlphabetic(5));
        persistUser.setPassword(RandomStringUtils.randomAlphanumeric(60));
        persistUser.setActivated(true);
        persistUser.setEmail(RandomStringUtils.randomAlphabetic(5) + DEFAULT_EMAIL);
        persistUser.setFirstName(DEFAULT_FIRSTNAME);
        persistUser.setLastName(DEFAULT_LASTNAME);
        persistUser.setImageUrl(DEFAULT_IMAGEURL);
        persistUser.setLangKey(DEFAULT_LANGKEY);
        return persistUser;
    }

    /**
     * Setups the database with one user.
     */
    public static User initTestUser() {
        User persistUser = createEntity();
        persistUser.setLogin(DEFAULT_LOGIN);
        persistUser.setEmail(DEFAULT_EMAIL);
        return persistUser;
    }

    @BeforeEach
    public void initTest() {
        user = initTestUser();
    }

    @AfterEach
    public void cleanupAndCheck() {
        cacheManager
            .getCacheNames()
            .stream()
            .map(cacheName -> this.cacheManager.getCache(cacheName))
            .filter(Objects::nonNull)
            .forEach(Cache::clear);
        userService.deleteUser(DEFAULT_LOGIN);
        userService.deleteUser(UPDATED_LOGIN);
        userService.deleteUser(user.getLogin());
        userService.deleteUser("anotherlogin");
        assertThat(userRepository.count()).isEqualTo(numberOfUsers);
        numberOfUsers = null;
    }

    @Test
    @Transactional
    void createUser() throws Exception {
        // Create the User
        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setLogin(DEFAULT_LOGIN);
        userDTO.setFirstName(DEFAULT_FIRSTNAME);
        userDTO.setLastName(DEFAULT_LASTNAME);
        userDTO.setEmail(DEFAULT_EMAIL);
        userDTO.setActivated(true);
        userDTO.setImageUrl(DEFAULT_IMAGEURL);
        userDTO.setLangKey(DEFAULT_LANGKEY);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        var returnedUserDTO = om.readValue(
            restUserMockMvc
                .perform(post("/api/admin/users").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            AdminUserDTO.class
        );

        User convertedUser = userMapper.userDTOToUser(returnedUserDTO);
        // Validate the returned User
        assertThat(convertedUser.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(convertedUser.getFirstName()).isEqualTo(DEFAULT_FIRSTNAME);
        assertThat(convertedUser.getLastName()).isEqualTo(DEFAULT_LASTNAME);
        assertThat(convertedUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(convertedUser.getImageUrl()).isEqualTo(DEFAULT_IMAGEURL);
        assertThat(convertedUser.getLangKey()).isEqualTo(DEFAULT_LANGKEY);
    }

    @Test
    @Transactional
    void createUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userRepository.findAll().size();

        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setId(DEFAULT_ID);
        userDTO.setLogin(DEFAULT_LOGIN);
        userDTO.setFirstName(DEFAULT_FIRSTNAME);
        userDTO.setLastName(DEFAULT_LASTNAME);
        userDTO.setEmail(DEFAULT_EMAIL);
        userDTO.setActivated(true);
        userDTO.setImageUrl(DEFAULT_IMAGEURL);
        userDTO.setLangKey(DEFAULT_LANGKEY);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserMockMvc
            .perform(post("/api/admin/users").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userDTO)))
            .andExpect(status().isBadRequest());

        // Validate the User in the database
        assertPersistedUsers(users -> assertThat(users).hasSize(databaseSizeBeforeCreate));
    }

    @Test
    @Transactional
    void createUserWithExistingLogin() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(user);
        int databaseSizeBeforeCreate = userRepository.findAll().size();

        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setLogin(DEFAULT_LOGIN); // this login should already be used
        userDTO.setFirstName(DEFAULT_FIRSTNAME);
        userDTO.setLastName(DEFAULT_LASTNAME);
        userDTO.setEmail("anothermail@localhost");
        userDTO.setActivated(true);
        userDTO.setImageUrl(DEFAULT_IMAGEURL);
        userDTO.setLangKey(DEFAULT_LANGKEY);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        // Create the User
        restUserMockMvc
            .perform(post("/api/admin/users").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userDTO)))
            .andExpect(status().isBadRequest());

        // Validate the User in the database
        assertPersistedUsers(users -> assertThat(users).hasSize(databaseSizeBeforeCreate));
    }

    @Test
    @Transactional
    void createUserWithExistingEmail() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(user);
        int databaseSizeBeforeCreate = userRepository.findAll().size();

        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setLogin("anotherlogin");
        userDTO.setFirstName(DEFAULT_FIRSTNAME);
        userDTO.setLastName(DEFAULT_LASTNAME);
        userDTO.setEmail(DEFAULT_EMAIL); // this email should already be used
        userDTO.setActivated(true);
        userDTO.setImageUrl(DEFAULT_IMAGEURL);
        userDTO.setLangKey(DEFAULT_LANGKEY);
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        // Create the User
        restUserMockMvc
            .perform(post("/api/admin/users").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userDTO)))
            .andExpect(status().isBadRequest());

        // Validate the User in the database
        assertPersistedUsers(users -> assertThat(users).hasSize(databaseSizeBeforeCreate));
    }

    @Test
    @Transactional
    void getAllUsers() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(user);

        // Get all the users
        restUserMockMvc
            .perform(get("/api/admin/users?sort=id,desc").accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].login").value(hasItem(DEFAULT_LOGIN)))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRSTNAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LASTNAME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].imageUrl").value(hasItem(DEFAULT_IMAGEURL)))
            .andExpect(jsonPath("$.[*].langKey").value(hasItem(DEFAULT_LANGKEY)));
    }

    @Test
    @Transactional
    void getUser() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(user);

        assertThat(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE).get(user.getLogin())).isNull();

        // Get the user
        restUserMockMvc
            .perform(get("/api/admin/users/{login}", user.getLogin()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.login").value(user.getLogin()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRSTNAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LASTNAME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.imageUrl").value(DEFAULT_IMAGEURL))
            .andExpect(jsonPath("$.langKey").value(DEFAULT_LANGKEY));

        assertThat(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE).get(user.getLogin())).isNotNull();
    }

    @Test
    @Transactional
    void getNonExistingUser() throws Exception {
        restUserMockMvc.perform(get("/api/admin/users/unknown")).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void updateUser() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(user);
        int databaseSizeBeforeUpdate = userRepository.findAll().size();

        // Update the user
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();

        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setLogin(updatedUser.getLogin());
        userDTO.setFirstName(UPDATED_FIRSTNAME);
        userDTO.setLastName(UPDATED_LASTNAME);
        userDTO.setEmail(UPDATED_EMAIL);
        userDTO.setActivated(updatedUser.isActivated());
        userDTO.setImageUrl(UPDATED_IMAGEURL);
        userDTO.setLangKey(UPDATED_LANGKEY);
        userDTO.setCreatedBy(updatedUser.getCreatedBy());
        userDTO.setCreatedDate(updatedUser.getCreatedDate());
        userDTO.setLastModifiedBy(updatedUser.getLastModifiedBy());
        userDTO.setLastModifiedDate(updatedUser.getLastModifiedDate());
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        restUserMockMvc
            .perform(put("/api/admin/users").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userDTO)))
            .andExpect(status().isOk());

        // Validate the User in the database
        assertPersistedUsers(users -> {
            assertThat(users).hasSize(databaseSizeBeforeUpdate);
            User testUser = users.stream().filter(usr -> usr.getId().equals(updatedUser.getId())).findFirst().orElseThrow();
            assertThat(testUser.getFirstName()).isEqualTo(UPDATED_FIRSTNAME);
            assertThat(testUser.getLastName()).isEqualTo(UPDATED_LASTNAME);
            assertThat(testUser.getEmail()).isEqualTo(UPDATED_EMAIL);
            assertThat(testUser.getImageUrl()).isEqualTo(UPDATED_IMAGEURL);
            assertThat(testUser.getLangKey()).isEqualTo(UPDATED_LANGKEY);
        });
    }

    @Test
    @Transactional
    void updateUserLogin() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(user);
        int databaseSizeBeforeUpdate = userRepository.findAll().size();

        // Update the user
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();

        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setLogin(UPDATED_LOGIN);
        userDTO.setFirstName(UPDATED_FIRSTNAME);
        userDTO.setLastName(UPDATED_LASTNAME);
        userDTO.setEmail(UPDATED_EMAIL);
        userDTO.setActivated(updatedUser.isActivated());
        userDTO.setImageUrl(UPDATED_IMAGEURL);
        userDTO.setLangKey(UPDATED_LANGKEY);
        userDTO.setCreatedBy(updatedUser.getCreatedBy());
        userDTO.setCreatedDate(updatedUser.getCreatedDate());
        userDTO.setLastModifiedBy(updatedUser.getLastModifiedBy());
        userDTO.setLastModifiedDate(updatedUser.getLastModifiedDate());
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        restUserMockMvc
            .perform(put("/api/admin/users").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userDTO)))
            .andExpect(status().isOk());

        // Validate the User in the database
        assertPersistedUsers(users -> {
            assertThat(users).hasSize(databaseSizeBeforeUpdate);
            User testUser = users.stream().filter(usr -> usr.getId().equals(updatedUser.getId())).findFirst().orElseThrow();
            assertThat(testUser.getLogin()).isEqualTo(UPDATED_LOGIN);
            assertThat(testUser.getFirstName()).isEqualTo(UPDATED_FIRSTNAME);
            assertThat(testUser.getLastName()).isEqualTo(UPDATED_LASTNAME);
            assertThat(testUser.getEmail()).isEqualTo(UPDATED_EMAIL);
            assertThat(testUser.getImageUrl()).isEqualTo(UPDATED_IMAGEURL);
            assertThat(testUser.getLangKey()).isEqualTo(UPDATED_LANGKEY);
        });
    }

    @Test
    @Transactional
    void updateUserExistingEmail() throws Exception {
        // Initialize the database with 2 users
        userRepository.saveAndFlush(user);

        User anotherUser = new User();
        anotherUser.setLogin("jhipster");
        anotherUser.setPassword(RandomStringUtils.randomAlphanumeric(60));
        anotherUser.setActivated(true);
        anotherUser.setEmail("jhipster@localhost");
        anotherUser.setFirstName("java");
        anotherUser.setLastName("hipster");
        anotherUser.setImageUrl("");
        anotherUser.setLangKey("en");
        userRepository.saveAndFlush(anotherUser);

        // Update the user
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();

        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setLogin(updatedUser.getLogin());
        userDTO.setFirstName(updatedUser.getFirstName());
        userDTO.setLastName(updatedUser.getLastName());
        userDTO.setEmail("jhipster@localhost"); // this email should already be used by anotherUser
        userDTO.setActivated(updatedUser.isActivated());
        userDTO.setImageUrl(updatedUser.getImageUrl());
        userDTO.setLangKey(updatedUser.getLangKey());
        userDTO.setCreatedBy(updatedUser.getCreatedBy());
        userDTO.setCreatedDate(updatedUser.getCreatedDate());
        userDTO.setLastModifiedBy(updatedUser.getLastModifiedBy());
        userDTO.setLastModifiedDate(updatedUser.getLastModifiedDate());
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        restUserMockMvc
            .perform(put("/api/admin/users").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userDTO)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void updateUserExistingLogin() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(user);

        User anotherUser = new User();
        anotherUser.setLogin("jhipster");
        anotherUser.setPassword(RandomStringUtils.randomAlphanumeric(60));
        anotherUser.setActivated(true);
        anotherUser.setEmail("jhipster@localhost");
        anotherUser.setFirstName("java");
        anotherUser.setLastName("hipster");
        anotherUser.setImageUrl("");
        anotherUser.setLangKey("en");
        userRepository.saveAndFlush(anotherUser);

        // Update the user
        User updatedUser = userRepository.findById(user.getId()).orElseThrow();

        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setId(updatedUser.getId());
        userDTO.setLogin("jhipster"); // this login should already be used by anotherUser
        userDTO.setFirstName(updatedUser.getFirstName());
        userDTO.setLastName(updatedUser.getLastName());
        userDTO.setEmail(updatedUser.getEmail());
        userDTO.setActivated(updatedUser.isActivated());
        userDTO.setImageUrl(updatedUser.getImageUrl());
        userDTO.setLangKey(updatedUser.getLangKey());
        userDTO.setCreatedBy(updatedUser.getCreatedBy());
        userDTO.setCreatedDate(updatedUser.getCreatedDate());
        userDTO.setLastModifiedBy(updatedUser.getLastModifiedBy());
        userDTO.setLastModifiedDate(updatedUser.getLastModifiedDate());
        userDTO.setAuthorities(Collections.singleton(AuthoritiesConstants.USER));

        restUserMockMvc
            .perform(put("/api/admin/users").contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userDTO)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void deleteUser() throws Exception {
        // Initialize the database
        userRepository.saveAndFlush(user);
        int databaseSizeBeforeDelete = userRepository.findAll().size();

        // Delete the user
        restUserMockMvc
            .perform(delete("/api/admin/users/{login}", user.getLogin()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        assertThat(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE).get(user.getLogin())).isNull();

        // Validate the database is empty
        assertPersistedUsers(users -> assertThat(users).hasSize(databaseSizeBeforeDelete - 1));
    }

    @Test
    void testUserEquals() throws Exception {
        TestUtil.equalsVerifier(User.class);
        User user1 = new User();
        user1.setId(DEFAULT_ID);
        User user2 = new User();
        user2.setId(user1.getId());
        assertThat(user1).isEqualTo(user2);
        user2.setId(2L);
        assertThat(user1).isNotEqualTo(user2);
        user1.setId(null);
        assertThat(user1).isNotEqualTo(user2);
    }

    private void assertPersistedUsers(Consumer<List<User>> userAssertion) {
        userAssertion.accept(userRepository.findAll());
    }
}
