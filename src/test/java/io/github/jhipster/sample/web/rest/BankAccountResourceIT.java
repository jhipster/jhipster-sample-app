package io.github.jhipster.sample.web.rest;

import static io.github.jhipster.sample.domain.BankAccountAsserts.*;
import static io.github.jhipster.sample.web.rest.TestUtil.createUpdateProxyForBean;
import static io.github.jhipster.sample.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.jhipster.sample.IntegrationTest;
import io.github.jhipster.sample.domain.BankAccount;
import io.github.jhipster.sample.repository.BankAccountRepository;
import io.github.jhipster.sample.repository.UserRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link BankAccountResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class BankAccountResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_BALANCE = new BigDecimal(1);
    private static final BigDecimal UPDATED_BALANCE = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/bank-accounts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private BankAccountRepository bankAccountRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBankAccountMockMvc;

    private BankAccount bankAccount;

    private BankAccount insertedBankAccount;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankAccount createEntity() {
        return new BankAccount().name(DEFAULT_NAME).balance(DEFAULT_BALANCE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankAccount createUpdatedEntity() {
        return new BankAccount().name(UPDATED_NAME).balance(UPDATED_BALANCE);
    }

    @BeforeEach
    public void initTest() {
        bankAccount = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedBankAccount != null) {
            bankAccountRepository.delete(insertedBankAccount);
            insertedBankAccount = null;
        }
    }

    @Test
    @Transactional
    void createBankAccount() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the BankAccount
        var returnedBankAccount = om.readValue(
            restBankAccountMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankAccount)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            BankAccount.class
        );

        // Validate the BankAccount in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertBankAccountUpdatableFieldsEquals(returnedBankAccount, getPersistedBankAccount(returnedBankAccount));

        insertedBankAccount = returnedBankAccount;
    }

    @Test
    @Transactional
    void createBankAccountWithExistingId() throws Exception {
        // Create the BankAccount with an existing ID
        bankAccount.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restBankAccountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankAccount)))
            .andExpect(status().isBadRequest());

        // Validate the BankAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bankAccount.setName(null);

        // Create the BankAccount, which fails.

        restBankAccountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankAccount)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkBalanceIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        bankAccount.setBalance(null);

        // Create the BankAccount, which fails.

        restBankAccountMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankAccount)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllBankAccounts() throws Exception {
        // Initialize the database
        insertedBankAccount = bankAccountRepository.saveAndFlush(bankAccount);

        // Get all the bankAccountList
        restBankAccountMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bankAccount.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(sameNumber(DEFAULT_BALANCE))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBankAccountsWithEagerRelationshipsIsEnabled() throws Exception {
        when(bankAccountRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBankAccountMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(bankAccountRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllBankAccountsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(bankAccountRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restBankAccountMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(bankAccountRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getBankAccount() throws Exception {
        // Initialize the database
        insertedBankAccount = bankAccountRepository.saveAndFlush(bankAccount);

        // Get the bankAccount
        restBankAccountMockMvc
            .perform(get(ENTITY_API_URL_ID, bankAccount.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bankAccount.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.balance").value(sameNumber(DEFAULT_BALANCE)));
    }

    @Test
    @Transactional
    void getNonExistingBankAccount() throws Exception {
        // Get the bankAccount
        restBankAccountMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingBankAccount() throws Exception {
        // Initialize the database
        insertedBankAccount = bankAccountRepository.saveAndFlush(bankAccount);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bankAccount
        BankAccount updatedBankAccount = bankAccountRepository.findById(bankAccount.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedBankAccount are not directly saved in db
        em.detach(updatedBankAccount);
        updatedBankAccount.name(UPDATED_NAME).balance(UPDATED_BALANCE);

        restBankAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedBankAccount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedBankAccount))
            )
            .andExpect(status().isOk());

        // Validate the BankAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedBankAccountToMatchAllProperties(updatedBankAccount);
    }

    @Test
    @Transactional
    void putNonExistingBankAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankAccount.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, bankAccount.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(bankAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchBankAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankAccount.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankAccountMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(bankAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamBankAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankAccount.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankAccountMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bankAccount)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BankAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateBankAccountWithPatch() throws Exception {
        // Initialize the database
        insertedBankAccount = bankAccountRepository.saveAndFlush(bankAccount);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bankAccount using partial update
        BankAccount partialUpdatedBankAccount = new BankAccount();
        partialUpdatedBankAccount.setId(bankAccount.getId());

        partialUpdatedBankAccount.balance(UPDATED_BALANCE);

        restBankAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBankAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBankAccount))
            )
            .andExpect(status().isOk());

        // Validate the BankAccount in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBankAccountUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedBankAccount, bankAccount),
            getPersistedBankAccount(bankAccount)
        );
    }

    @Test
    @Transactional
    void fullUpdateBankAccountWithPatch() throws Exception {
        // Initialize the database
        insertedBankAccount = bankAccountRepository.saveAndFlush(bankAccount);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the bankAccount using partial update
        BankAccount partialUpdatedBankAccount = new BankAccount();
        partialUpdatedBankAccount.setId(bankAccount.getId());

        partialUpdatedBankAccount.name(UPDATED_NAME).balance(UPDATED_BALANCE);

        restBankAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedBankAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedBankAccount))
            )
            .andExpect(status().isOk());

        // Validate the BankAccount in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertBankAccountUpdatableFieldsEquals(partialUpdatedBankAccount, getPersistedBankAccount(partialUpdatedBankAccount));
    }

    @Test
    @Transactional
    void patchNonExistingBankAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankAccount.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, bankAccount.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bankAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchBankAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankAccount.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankAccountMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(bankAccount))
            )
            .andExpect(status().isBadRequest());

        // Validate the BankAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamBankAccount() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        bankAccount.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restBankAccountMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(bankAccount)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the BankAccount in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteBankAccount() throws Exception {
        // Initialize the database
        insertedBankAccount = bankAccountRepository.saveAndFlush(bankAccount);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the bankAccount
        restBankAccountMockMvc
            .perform(delete(ENTITY_API_URL_ID, bankAccount.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return bankAccountRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected BankAccount getPersistedBankAccount(BankAccount bankAccount) {
        return bankAccountRepository.findById(bankAccount.getId()).orElseThrow();
    }

    protected void assertPersistedBankAccountToMatchAllProperties(BankAccount expectedBankAccount) {
        assertBankAccountAllPropertiesEquals(expectedBankAccount, getPersistedBankAccount(expectedBankAccount));
    }

    protected void assertPersistedBankAccountToMatchUpdatableProperties(BankAccount expectedBankAccount) {
        assertBankAccountAllUpdatablePropertiesEquals(expectedBankAccount, getPersistedBankAccount(expectedBankAccount));
    }
}
