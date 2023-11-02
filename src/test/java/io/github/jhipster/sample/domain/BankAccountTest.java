package io.github.jhipster.sample.domain;

import static io.github.jhipster.sample.domain.BankAccountTestSamples.*;
import static io.github.jhipster.sample.domain.OperationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import io.github.jhipster.sample.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class BankAccountTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BankAccount.class);
        BankAccount bankAccount1 = getBankAccountSample1();
        BankAccount bankAccount2 = new BankAccount();
        assertThat(bankAccount1).isNotEqualTo(bankAccount2);

        bankAccount2.setId(bankAccount1.getId());
        assertThat(bankAccount1).isEqualTo(bankAccount2);

        bankAccount2 = getBankAccountSample2();
        assertThat(bankAccount1).isNotEqualTo(bankAccount2);
    }

    @Test
    void operationTest() throws Exception {
        BankAccount bankAccount = getBankAccountRandomSampleGenerator();
        Operation operationBack = getOperationRandomSampleGenerator();

        bankAccount.addOperation(operationBack);
        assertThat(bankAccount.getOperations()).containsOnly(operationBack);
        assertThat(operationBack.getBankAccount()).isEqualTo(bankAccount);

        bankAccount.removeOperation(operationBack);
        assertThat(bankAccount.getOperations()).doesNotContain(operationBack);
        assertThat(operationBack.getBankAccount()).isNull();

        bankAccount.operations(new HashSet<>(Set.of(operationBack)));
        assertThat(bankAccount.getOperations()).containsOnly(operationBack);
        assertThat(operationBack.getBankAccount()).isEqualTo(bankAccount);

        bankAccount.setOperations(new HashSet<>());
        assertThat(bankAccount.getOperations()).doesNotContain(operationBack);
        assertThat(operationBack.getBankAccount()).isNull();
    }
}
