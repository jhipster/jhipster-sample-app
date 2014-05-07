package com.mycompany.myapp.web.rest;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.repository.ProjectRepository;
import com.mycompany.myapp.web.rest.dto.LoggerDTO;

/**
 * Controller for view and managing Log Level at runtime.
 */
@RestController
@RequestMapping("/app")
public class LogsResource {
	
	private final Logger log = LoggerFactory.getLogger(LogsResource.class);

	@Inject
	private ProjectRepository projectRepository;

	@RequestMapping(value = "/rest/logs",
            method = RequestMethod.GET,
            produces = "application/json")
    @Timed
    public List<LoggerDTO> getList() {
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();

        List<LoggerDTO> loggers = new ArrayList<LoggerDTO>();
        for (ch.qos.logback.classic.Logger logger : context.getLoggerList()) {
            loggers.add(new LoggerDTO(logger));
        }
        return loggers;
    }

    @RequestMapping(value = "/rest/logs",
            method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Timed
    public void changeLevel(@RequestBody LoggerDTO jsonLogger) {
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        context.getLogger(jsonLogger.getName()).setLevel(Level.valueOf(jsonLogger.getLevel()));
    }
}
