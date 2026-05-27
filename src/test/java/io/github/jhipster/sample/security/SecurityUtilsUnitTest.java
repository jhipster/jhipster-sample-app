package io.github.jhipster.sample.security;

import static io.github.jhipster.sample.security.SecurityUtils.USER_ID_CLAIM;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Test class for the {@link SecurityUtils} utility class.
 */
class SecurityUtilsUnitTest {

    @BeforeEach
    @AfterEach
    void cleanup() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void testGetCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("admin", "admin"));
        SecurityContextHolder.setContext(securityContext);
        Optional<String> login = SecurityUtils.getCurrentUserLogin();
        assertThat(login).contains("admin");
    }

    @Test
    void testGetCurrentUserJWT() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("admin", "token"));
        SecurityContextHolder.setContext(securityContext);
        Optional<String> jwt = SecurityUtils.getCurrentUserJWT();
        assertThat(jwt).contains("token");
    }

    @Test
    void testGetCurrentUserJWTFromJwtCredentials() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        var now = Instant.now();
        var jwt = Jwt.withTokenValue("token").issuedAt(now).expiresAt(now.plusSeconds(60)).header("Test", "test").build();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("admin", jwt));
        SecurityContextHolder.setContext(securityContext);
        Optional<String> currentUserJwt = SecurityUtils.getCurrentUserJWT();
        assertThat(currentUserJwt).contains("token");
    }

    @Test
    void testGetCurrentUserId() {
        var userId = 1L;
        var securityContext = SecurityContextHolder.createEmptyContext();
        var now = Instant.now();
        var jwt = Jwt.withTokenValue("token")
            .issuedAt(now)
            .expiresAt(now.plusSeconds(60))
            .claim(USER_ID_CLAIM, userId)
            .header("Test", "test")
            .build();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken(jwt, "token"));
        SecurityContextHolder.setContext(securityContext);
        var contextUserId = SecurityUtils.getCurrentUserId();
        assertThat(contextUserId.orElse(null)).isEqualTo(userId);
    }

    @Test
    void testIsAuthenticated() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("admin", "admin"));
        SecurityContextHolder.setContext(securityContext);
        boolean isAuthenticated = SecurityUtils.isAuthenticated();
        assertThat(isAuthenticated).isTrue();
    }

    @Test
    void testAnonymousIsNotAuthenticated() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        var authorities = List.of(new SimpleGrantedAuthority(AuthoritiesConstants.ANONYMOUS));
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("anonymous", "anonymous", authorities));
        SecurityContextHolder.setContext(securityContext);
        boolean isAuthenticated = SecurityUtils.isAuthenticated();
        assertThat(isAuthenticated).isFalse();
    }

    @Test
    void testHasCurrentUserThisAuthority() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        var authorities = List.of(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("anonymous", "anonymous", authorities));
        SecurityContextHolder.setContext(securityContext);

        assertThat(SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.USER)).isTrue();
        assertThat(SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)).isFalse();
    }

    @Test
    void testHasCurrentUserAnyOfAuthorities() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        var authorities = List.of(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("anonymous", "anonymous", authorities));
        SecurityContextHolder.setContext(securityContext);

        assertThat(SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.USER, AuthoritiesConstants.ADMIN)).isTrue();
        assertThat(SecurityUtils.hasCurrentUserAnyOfAuthorities(AuthoritiesConstants.ANONYMOUS, AuthoritiesConstants.ADMIN)).isFalse();
    }

    @Test
    void testHasCurrentUserNoneOfAuthorities() {
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        var authorities = List.of(new SimpleGrantedAuthority(AuthoritiesConstants.USER));
        securityContext.setAuthentication(new UsernamePasswordAuthenticationToken("anonymous", "anonymous", authorities));
        SecurityContextHolder.setContext(securityContext);

        assertThat(SecurityUtils.hasCurrentUserNoneOfAuthorities(AuthoritiesConstants.USER, AuthoritiesConstants.ADMIN)).isFalse();
        assertThat(SecurityUtils.hasCurrentUserNoneOfAuthorities(AuthoritiesConstants.ANONYMOUS, AuthoritiesConstants.ADMIN)).isTrue();
    }
}
