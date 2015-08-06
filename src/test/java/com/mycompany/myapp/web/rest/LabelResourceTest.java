package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.Application;
import com.mycompany.myapp.domain.Label;
import com.mycompany.myapp.repository.LabelRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the LabelResource REST controller.
 *
 * @see LabelResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = Application.class)
@WebAppConfiguration
@IntegrationTest
public class LabelResourceTest {

    private static final String DEFAULT_LABEL = "SAMPLE_TEXT";
    private static final String UPDATED_LABEL = "UPDATED_TEXT";

    @Inject
    private LabelRepository labelRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    private MockMvc restLabelMockMvc;

    private Label label;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        LabelResource labelResource = new LabelResource();
        ReflectionTestUtils.setField(labelResource, "labelRepository", labelRepository);
        this.restLabelMockMvc = MockMvcBuilders.standaloneSetup(labelResource).setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        label = new Label();
        label.setLabel(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    public void createLabel() throws Exception {
        int databaseSizeBeforeCreate = labelRepository.findAll().size();

        // Create the Label

        restLabelMockMvc.perform(post("/api/labels")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(label)))
                .andExpect(status().isCreated());

        // Validate the Label in the database
        List<Label> labels = labelRepository.findAll();
        assertThat(labels).hasSize(databaseSizeBeforeCreate + 1);
        Label testLabel = labels.get(labels.size() - 1);
        assertThat(testLabel.getLabel()).isEqualTo(DEFAULT_LABEL);
    }

    @Test
    @Transactional
    public void checkLabelIsRequired() throws Exception {
        int databaseSizeBeforeTest = labelRepository.findAll().size();
        // set the field null
        label.setLabel(null);

        // Create the Label, which fails.

        restLabelMockMvc.perform(post("/api/labels")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(label)))
                .andExpect(status().isBadRequest());

        List<Label> labels = labelRepository.findAll();
        assertThat(labels).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLabels() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);

        // Get all the labels
        restLabelMockMvc.perform(get("/api/labels"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(label.getId().intValue())))
                .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL.toString())));
    }

    @Test
    @Transactional
    public void getLabel() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);

        // Get the label
        restLabelMockMvc.perform(get("/api/labels/{id}", label.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(label.getId().intValue()))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLabel() throws Exception {
        // Get the label
        restLabelMockMvc.perform(get("/api/labels/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLabel() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);

		int databaseSizeBeforeUpdate = labelRepository.findAll().size();

        // Update the label
        label.setLabel(UPDATED_LABEL);
        

        restLabelMockMvc.perform(put("/api/labels")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(label)))
                .andExpect(status().isOk());

        // Validate the Label in the database
        List<Label> labels = labelRepository.findAll();
        assertThat(labels).hasSize(databaseSizeBeforeUpdate);
        Label testLabel = labels.get(labels.size() - 1);
        assertThat(testLabel.getLabel()).isEqualTo(UPDATED_LABEL);
    }

    @Test
    @Transactional
    public void deleteLabel() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);

		int databaseSizeBeforeDelete = labelRepository.findAll().size();

        // Get the label
        restLabelMockMvc.perform(delete("/api/labels/{id}", label.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Label> labels = labelRepository.findAll();
        assertThat(labels).hasSize(databaseSizeBeforeDelete - 1);
    }
}
