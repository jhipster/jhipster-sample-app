package io.github.jhipster.sample.aop.logging;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import java.util.List;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;

class LoggingAspectTest {

    private static final String DECLARING_TYPE = "io.github.jhipster.sample.service.LoggedService";
    private static final String METHOD = "loggedMethod";

    private final Environment env = mock(Environment.class);
    private final ProceedingJoinPoint joinPoint = mock(ProceedingJoinPoint.class);
    private final ListAppender<ILoggingEvent> appender = new ListAppender<>();
    private LoggingAspect aspect;
    private Logger logger;

    @BeforeEach
    void setup() {
        Signature signature = mock(Signature.class);
        when(signature.getDeclaringTypeName()).thenReturn(DECLARING_TYPE);
        when(signature.getName()).thenReturn(METHOD);
        when(joinPoint.getSignature()).thenReturn(signature);
        when(joinPoint.getArgs()).thenReturn(new Object[] { "arg" });
        when(env.acceptsProfiles(any(Profiles.class))).thenReturn(true);

        logger = (Logger) LoggerFactory.getLogger(DECLARING_TYPE);
        logger.setLevel(Level.DEBUG);
        appender.start();
        logger.addAppender(appender);

        aspect = new LoggingAspect(env);
    }

    @AfterEach
    void teardown() {
        logger.detachAppender(appender);
        logger.setLevel(null);
    }

    private List<String> messages() {
        return appender.list.stream().map(ILoggingEvent::getFormattedMessage).toList();
    }

    @Test
    void logAroundLogsEnterAndExit() throws Throwable {
        when(joinPoint.proceed()).thenReturn("result");

        Object result = aspect.logAround(joinPoint);

        assertThat(result).isEqualTo("result");
        assertThat(messages()).containsExactly(
            "Enter: loggedMethod() with argument[s] = [arg]",
            "Exit: loggedMethod() with result = result"
        );
    }

    @Test
    void logAroundRethrowsIllegalArgumentException() throws Throwable {
        when(joinPoint.proceed()).thenThrow(new IllegalArgumentException("invalid"));

        assertThatThrownBy(() -> aspect.logAround(joinPoint))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessage("invalid");

        assertThat(messages()).contains("Illegal argument: [arg] in loggedMethod()");
    }

    @Test
    void logAfterThrowingLogsExceptionWithStackTraceInDevProfile() {
        aspect.logAfterThrowing(joinPoint, new IllegalStateException("failed"));

        assertThat(messages()).containsExactly("Exception in loggedMethod() with cause = 'NULL' and exception = 'failed'");
        assertThat(appender.list.get(0).getThrowableProxy()).isNotNull();
    }

    @Test
    void logAfterThrowingLogsCauseOnlyOutsideDevProfile() {
        when(env.acceptsProfiles(any(Profiles.class))).thenReturn(false);

        aspect.logAfterThrowing(joinPoint, new IllegalStateException("failed", new RuntimeException("root")));

        assertThat(messages()).containsExactly("Exception in loggedMethod() with cause = java.lang.RuntimeException: root");
        assertThat(appender.list.get(0).getThrowableProxy()).isNull();
    }
}
