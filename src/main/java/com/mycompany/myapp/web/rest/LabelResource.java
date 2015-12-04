package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Label;
import com.mycompany.myapp.repository.LabelRepository;
import com.mycompany.myapp.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Label.
 */
@RestController
@RequestMapping("/api")
public class LabelResource {

    private final Logger log = LoggerFactory.getLogger(LabelResource.class);
        
    @Inject
    private LabelRepository labelRepository;
    
    /**
     * POST  /labels -> Create a new label.
     */
    @RequestMapping(value = "/labels",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Label> createLabel(@Valid @RequestBody Label label) throws URISyntaxException {
        log.debug("REST request to save Label : {}", label);
        if (label.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("label", "idexists", "A new label cannot already have an ID")).body(null);
        }
        Label result = labelRepository.save(label);
        return ResponseEntity.created(new URI("/api/labels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("label", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /labels -> Updates an existing label.
     */
    @RequestMapping(value = "/labels",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Label> updateLabel(@Valid @RequestBody Label label) throws URISyntaxException {
        log.debug("REST request to update Label : {}", label);
        if (label.getId() == null) {
            return createLabel(label);
        }
        Label result = labelRepository.save(label);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("label", label.getId().toString()))
            .body(result);
    }

    /**
     * GET  /labels -> get all the labels.
     */
    @RequestMapping(value = "/labels",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Label> getAllLabels() {
        log.debug("REST request to get all Labels");
        return labelRepository.findAll();
            }

    /**
     * GET  /labels/:id -> get the "id" label.
     */
    @RequestMapping(value = "/labels/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Label> getLabel(@PathVariable Long id) {
        log.debug("REST request to get Label : {}", id);
        Label label = labelRepository.findOne(id);
        return Optional.ofNullable(label)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /labels/:id -> delete the "id" label.
     */
    @RequestMapping(value = "/labels/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteLabel(@PathVariable Long id) {
        log.debug("REST request to delete Label : {}", id);
        labelRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("label", id.toString())).build();
    }
}
