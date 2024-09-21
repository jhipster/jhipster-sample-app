package io.github.jhipster.sample.web.rest;

import static io.github.jhipster.sample.domain.OperationAsserts.*;
import static io.github.jhipster.sample.web.rest.TestUtil.createUpdateProxyForBean;
import static io.github.jhipster.sample.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.jhipster.sample.IntegrationTest;
import io.github.jhipster.sample.domain.Operation;
import io.github.jhipster.sample.repository.OperationRepository;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link OperationResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class OperationResourceIT {

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_AMOUNT = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/operations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private OperationRepository operationRepository;

    @Mock
    private OperationRepository operationRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOperationMockMvc;

    private Operation operation;

    private Operation insertedOperation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Operation createEntity() {
        return new Operation().date(DEFAULT_DATE).description(DEFAULT_DESCRIPTION).amount(DEFAULT_AMOUNT);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Operation createUpdatedEntity() {
        return new Operation().date(UPDATED_DATE).description(UPDATED_DESCRIPTION).amount(UPDATED_AMOUNT);
    }

    @BeforeEach
    public void initTest() {
        operation = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedOperation != null) {
            operationRepository.delete(insertedOperation);
            insertedOperation = null;
        }
    }

    @Test
    @Transactional
    void createOperation() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Operation
        var returnedOperation = om.readValue(
            restOperationMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operation)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Operation.class
        );

        // Validate the Operation in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertOperationUpdatableFieldsEquals(returnedOperation, getPersistedOperation(returnedOperation));

        insertedOperation = returnedOperation;
    }

    @Test
    @Transactional
    void createOperationWithExistingId() throws Exception {
        // Create the Operation with an existing ID
        operation.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOperationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operation)))
            .andExpect(status().isBadRequest());

        // Validate the Operation in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        operation.setDate(null);

        // Create the Operation, which fails.

        restOperationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operation)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkAmountIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        operation.setAmount(null);

        // Create the Operation, which fails.

        restOperationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operation)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllOperations() throws Exception {
        // Initialize the database
        insertedOperation = operationRepository.saveAndFlush(operation);

        // Get all the operationList
        restOperationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(operation.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(sameNumber(DEFAULT_AMOUNT))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOperationsWithEagerRelationshipsIsEnabled() throws Exception {
        when(operationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOperationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(operationRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllOperationsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(operationRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restOperationMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(operationRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getOperation() throws Exception {
        // Initialize the database
        insertedOperation = operationRepository.saveAndFlush(operation);

        // Get the operation
        restOperationMockMvc
            .perform(get(ENTITY_API_URL_ID, operation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(operation.getId().intValue()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.amount").value(sameNumber(DEFAULT_AMOUNT)));
    }

    @Test
    @Transactional
    void getNonExistingOperation() throws Exception {
        // Get the operation
        restOperationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingOperation() throws Exception {
        // Initialize the database
        insertedOperation = operationRepository.saveAndFlush(operation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the operation
        Operation updatedOperation = operationRepository.findById(operation.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedOperation are not directly saved in db
        em.detach(updatedOperation);
        updatedOperation.date(UPDATED_DATE).description(UPDATED_DESCRIPTION).amount(UPDATED_AMOUNT);

        restOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOperation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedOperation))
            )
            .andExpect(status().isOk());

        // Validate the Operation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedOperationToMatchAllProperties(updatedOperation);
    }

    @Test
    @Transactional
    void putNonExistingOperation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, operation.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOperation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(operation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOperation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(operation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Operation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOperationWithPatch() throws Exception {
        // Initialize the database
        insertedOperation = operationRepository.saveAndFlush(operation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the operation using partial update
        Operation partialUpdatedOperation = new Operation();
        partialUpdatedOperation.setId(operation.getId());

        partialUpdatedOperation.date(UPDATED_DATE).amount(UPDATED_AMOUNT);

        restOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOperation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOperation))
            )
            .andExpect(status().isOk());

        // Validate the Operation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOperationUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedOperation, operation),
            getPersistedOperation(operation)
        );
    }

    @Test
    @Transactional
    void fullUpdateOperationWithPatch() throws Exception {
        // Initialize the database
        insertedOperation = operationRepository.saveAndFlush(operation);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the operation using partial update
        Operation partialUpdatedOperation = new Operation();
        partialUpdatedOperation.setId(operation.getId());

        partialUpdatedOperation.date(UPDATED_DATE).description(UPDATED_DESCRIPTION).amount(UPDATED_AMOUNT);

        restOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOperation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedOperation))
            )
            .andExpect(status().isOk());

        // Validate the Operation in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertOperationUpdatableFieldsEquals(partialUpdatedOperation, getPersistedOperation(partialUpdatedOperation));
    }

    @Test
    @Transactional
    void patchNonExistingOperation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operation.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, operation.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(operation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOperation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(operation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Operation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOperation() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        operation.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOperationMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(operation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Operation in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOperation() throws Exception {
        // Initialize the database
        insertedOperation = operationRepository.saveAndFlush(operation);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the operation
        restOperationMockMvc
            .perform(delete(ENTITY_API_URL_ID, operation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return operationRepository.count();
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

    protected Operation getPersistedOperation(Operation operation) {
        return operationRepository.findById(operation.getId()).orElseThrow();
    }

    protected void assertPersistedOperationToMatchAllProperties(Operation expectedOperation) {
        assertOperationAllPropertiesEquals(expectedOperation, getPersistedOperation(expectedOperation));
    }

    protected void assertPersistedOperationToMatchUpdatableProperties(Operation expectedOperation) {
        assertOperationAllUpdatablePropertiesEquals(expectedOperation, getPersistedOperation(expectedOperation));
    }
}
