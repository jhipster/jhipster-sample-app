package io.github.jhipster.sample.web.rest;

import static io.github.jhipster.sample.domain.LabelAsserts.*;
import static io.github.jhipster.sample.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.jhipster.sample.IntegrationTest;
import io.github.jhipster.sample.domain.Label;
import io.github.jhipster.sample.repository.LabelRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LabelResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LabelResourceIT {

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/labels";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LabelRepository labelRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLabelMockMvc;

    private Label label;

    private Label insertedLabel;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Label createEntity() {
        return new Label().label(DEFAULT_LABEL);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Label createUpdatedEntity() {
        return new Label().label(UPDATED_LABEL);
    }

    @BeforeEach
    public void initTest() {
        label = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedLabel != null) {
            labelRepository.delete(insertedLabel);
            insertedLabel = null;
        }
    }

    @Test
    @Transactional
    void createLabel() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Label
        var returnedLabel = om.readValue(
            restLabelMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(label)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Label.class
        );

        // Validate the Label in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertLabelUpdatableFieldsEquals(returnedLabel, getPersistedLabel(returnedLabel));

        insertedLabel = returnedLabel;
    }

    @Test
    @Transactional
    void createLabelWithExistingId() throws Exception {
        // Create the Label with an existing ID
        label.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLabelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(label)))
            .andExpect(status().isBadRequest());

        // Validate the Label in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLabelIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        label.setLabel(null);

        // Create the Label, which fails.

        restLabelMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(label)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLabels() throws Exception {
        // Initialize the database
        insertedLabel = labelRepository.saveAndFlush(label);

        // Get all the labelList
        restLabelMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(label.getId().intValue())))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)));
    }

    @Test
    @Transactional
    void getLabel() throws Exception {
        // Initialize the database
        insertedLabel = labelRepository.saveAndFlush(label);

        // Get the label
        restLabelMockMvc
            .perform(get(ENTITY_API_URL_ID, label.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(label.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL));
    }

    @Test
    @Transactional
    void getNonExistingLabel() throws Exception {
        // Get the label
        restLabelMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLabel() throws Exception {
        // Initialize the database
        insertedLabel = labelRepository.saveAndFlush(label);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the label
        Label updatedLabel = labelRepository.findById(label.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLabel are not directly saved in db
        em.detach(updatedLabel);
        updatedLabel.label(UPDATED_LABEL);

        restLabelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLabel.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedLabel))
            )
            .andExpect(status().isOk());

        // Validate the Label in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLabelToMatchAllProperties(updatedLabel);
    }

    @Test
    @Transactional
    void putNonExistingLabel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        label.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLabelMockMvc
            .perform(put(ENTITY_API_URL_ID, label.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(label)))
            .andExpect(status().isBadRequest());

        // Validate the Label in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLabel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        label.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLabelMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(label))
            )
            .andExpect(status().isBadRequest());

        // Validate the Label in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLabel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        label.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLabelMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(label)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Label in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLabelWithPatch() throws Exception {
        // Initialize the database
        insertedLabel = labelRepository.saveAndFlush(label);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the label using partial update
        Label partialUpdatedLabel = new Label();
        partialUpdatedLabel.setId(label.getId());

        restLabelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLabel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLabel))
            )
            .andExpect(status().isOk());

        // Validate the Label in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLabelUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedLabel, label), getPersistedLabel(label));
    }

    @Test
    @Transactional
    void fullUpdateLabelWithPatch() throws Exception {
        // Initialize the database
        insertedLabel = labelRepository.saveAndFlush(label);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the label using partial update
        Label partialUpdatedLabel = new Label();
        partialUpdatedLabel.setId(label.getId());

        partialUpdatedLabel.label(UPDATED_LABEL);

        restLabelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLabel.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLabel))
            )
            .andExpect(status().isOk());

        // Validate the Label in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLabelUpdatableFieldsEquals(partialUpdatedLabel, getPersistedLabel(partialUpdatedLabel));
    }

    @Test
    @Transactional
    void patchNonExistingLabel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        label.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLabelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, label.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(label))
            )
            .andExpect(status().isBadRequest());

        // Validate the Label in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLabel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        label.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLabelMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(label))
            )
            .andExpect(status().isBadRequest());

        // Validate the Label in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLabel() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        label.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLabelMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(label)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Label in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLabel() throws Exception {
        // Initialize the database
        insertedLabel = labelRepository.saveAndFlush(label);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the label
        restLabelMockMvc
            .perform(delete(ENTITY_API_URL_ID, label.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return labelRepository.count();
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

    protected Label getPersistedLabel(Label label) {
        return labelRepository.findById(label.getId()).orElseThrow();
    }

    protected void assertPersistedLabelToMatchAllProperties(Label expectedLabel) {
        assertLabelAllPropertiesEquals(expectedLabel, getPersistedLabel(expectedLabel));
    }

    protected void assertPersistedLabelToMatchUpdatableProperties(Label expectedLabel) {
        assertLabelAllUpdatablePropertiesEquals(expectedLabel, getPersistedLabel(expectedLabel));
    }
}
