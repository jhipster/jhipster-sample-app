package io.github.jhipster.sample.service;

import io.github.jhipster.sample.domain.PersistentAuditEvent;
import io.github.jhipster.sample.repository.PersistenceAuditEventRepository;
import io.github.jhipster.sample.JhipsterSampleApplicationApp;
import io.github.jhipster.config.JHipsterProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Integration tests for {@link AuditEventService}.
 */
@SpringBootTest(classes = JhipsterSampleApplicationApp.class)
@Transactional
public class AuditEventServiceIT  {
    @Autowired
    private AuditEventService auditEventService;

    @Autowired
    private PersistenceAuditEventRepository persistenceAuditEventRepository;

    @Autowired
    private JHipsterProperties jHipsterProperties;

    private PersistentAuditEvent auditEventOld;

    private PersistentAuditEvent auditEventWithinRetention;

    private PersistentAuditEvent auditEventNew;

    @BeforeEach
    public void init() {
        auditEventOld = new PersistentAuditEvent();
        auditEventOld.setAuditEventDate(Instant.now().minus(jHipsterProperties.getAuditEvents().getRetentionPeriod() + 1, ChronoUnit.DAYS));
        auditEventOld.setPrincipal("test-user-old");
        auditEventOld.setAuditEventType("test-type");

        auditEventWithinRetention = new PersistentAuditEvent();
        auditEventWithinRetention.setAuditEventDate(Instant.now().minus(jHipsterProperties.getAuditEvents().getRetentionPeriod() - 1, ChronoUnit.DAYS));
        auditEventWithinRetention.setPrincipal("test-user-retention");
        auditEventWithinRetention.setAuditEventType("test-type");

        auditEventNew = new PersistentAuditEvent();
        auditEventNew.setAuditEventDate(Instant.now());
        auditEventNew.setPrincipal("test-user-new");
        auditEventNew.setAuditEventType("test-type");
    }

    @Test
    @Transactional
    public void verifyOldAuditEventsAreDeleted() {
        persistenceAuditEventRepository.deleteAll();
        persistenceAuditEventRepository.save(auditEventOld);
        persistenceAuditEventRepository.save(auditEventWithinRetention);
        persistenceAuditEventRepository.save(auditEventNew);

        persistenceAuditEventRepository.flush();
        auditEventService.removeOldAuditEvents();
        persistenceAuditEventRepository.flush();

        assertThat(persistenceAuditEventRepository.findAll().size()).isEqualTo(2);
        assertThat(persistenceAuditEventRepository.findByPrincipal("test-user-old")).isEmpty();
        assertThat(persistenceAuditEventRepository.findByPrincipal("test-user-retention")).isNotEmpty();
        assertThat(persistenceAuditEventRepository.findByPrincipal("test-user-new")).isNotEmpty();
    }
}
