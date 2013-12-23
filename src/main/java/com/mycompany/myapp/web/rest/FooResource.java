package com.mycompany.myapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Foo;
import com.mycompany.myapp.repository.FooRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * REST controller for managing Foo.
 */
@RestController
public class FooResource {

    private static final Logger log = LoggerFactory.getLogger(FooResource.class);

    @Inject
    private FooRepository fooRepository;

    /**
     * POST  /rest/foos -> Create a new foo.
     */
    @RequestMapping(value = "/rest/foos",
            method = RequestMethod.POST,
            produces = "application/json")
    @Timed
    public void create(@RequestBody Foo foo) {
        fooRepository.save(foo);
    }

    /**
     * GET  /rest/foos -> get all the foos.
     */
    @RequestMapping(value = "/rest/foos",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public List<Foo> getAll() {
        return fooRepository.findAll();
    }

    /**
     * GET  /rest/foos/:id -> get the "id" foo.
     */
    @RequestMapping(value = "/rest/foos/{id}",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public Foo get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get Foo : {}", id);
        Foo foo = fooRepository.findOne(id);
        if (foo == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
        return foo;
    }

    /**
     * DELETE  /rest/foos/:id -> delete the "id" foo.
     */
    @RequestMapping(value = "/rest/foos/{id}",
            method = RequestMethod.DELETE,
            produces = "application/json")
    @Timed
    public void delete(@PathVariable Long id, HttpServletResponse response) {
        fooRepository.delete(id);
    }
}
