package io.github.jhipster.sample;

import io.github.jhipster.sample.config.AsyncSyncConfiguration;
import io.github.jhipster.sample.config.EmbeddedSQL;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(
    classes = {
        JhipsterSampleApplicationApp.class,
        AsyncSyncConfiguration.class,
        io.github.jhipster.sample.config.JacksonHibernateConfiguration.class,
    }
)
@EmbeddedSQL
public @interface IntegrationTest {}
