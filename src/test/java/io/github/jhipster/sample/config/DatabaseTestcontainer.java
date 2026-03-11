package io.github.jhipster.sample.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.testcontainers.containers.JdbcDatabaseContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.postgresql.PostgreSQLContainer;

public class DatabaseTestcontainer implements SqlTestContainer, InitializingBean, DisposableBean {

    private static final Logger LOG = LoggerFactory.getLogger(DatabaseTestcontainer.class);

    private PostgreSQLContainer databaseContainer;

    @Override
    public void destroy() {
        if (null != databaseContainer && databaseContainer.isRunning()) {
            databaseContainer.stop();
        }
    }

    @Override
    public void afterPropertiesSet() {
        if (null == databaseContainer) {
            databaseContainer = new PostgreSQLContainer("postgres:18.3")
                .withDatabaseName("jhipsterSampleApplication")
                .withLogConsumer(new Slf4jLogConsumer(LOG))
                .withReuse(true);
        }
        if (!databaseContainer.isRunning()) {
            databaseContainer.start();
        }
    }

    @Override
    public JdbcDatabaseContainer<?> getTestContainer() {
        return databaseContainer;
    }
}
