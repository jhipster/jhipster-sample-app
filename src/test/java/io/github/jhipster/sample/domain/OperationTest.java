package io.github.jhipster.sample.domain;

import static io.github.jhipster.sample.domain.BankAccountTestSamples.*;
import static io.github.jhipster.sample.domain.LabelTestSamples.*;
import static io.github.jhipster.sample.domain.OperationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import io.github.jhipster.sample.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class OperationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Operation.class);
        Operation operation1 = getOperationSample1();
        Operation operation2 = new Operation();
        assertThat(operation1).isNotEqualTo(operation2);

        operation2.setId(operation1.getId());
        assertThat(operation1).isEqualTo(operation2);

        operation2 = getOperationSample2();
        assertThat(operation1).isNotEqualTo(operation2);
    }

    @Test
    void bankAccountTest() throws Exception {
        Operation operation = getOperationRandomSampleGenerator();
        BankAccount bankAccountBack = getBankAccountRandomSampleGenerator();

        operation.setBankAccount(bankAccountBack);
        assertThat(operation.getBankAccount()).isEqualTo(bankAccountBack);

        operation.bankAccount(null);
        assertThat(operation.getBankAccount()).isNull();
    }

    @Test
    void labelTest() throws Exception {
        Operation operation = getOperationRandomSampleGenerator();
        Label labelBack = getLabelRandomSampleGenerator();

        operation.addLabel(labelBack);
        assertThat(operation.getLabels()).containsOnly(labelBack);

        operation.removeLabel(labelBack);
        assertThat(operation.getLabels()).doesNotContain(labelBack);

        operation.labels(new HashSet<>(Set.of(labelBack)));
        assertThat(operation.getLabels()).containsOnly(labelBack);

        operation.setLabels(new HashSet<>());
        assertThat(operation.getLabels()).doesNotContain(labelBack);
    }
}
