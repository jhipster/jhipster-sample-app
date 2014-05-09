package com.mycompany.myapp.web.rest;

import java.util.List;
import java.util.UUID;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Project;
import com.mycompany.myapp.domain.Suite;
import com.mycompany.myapp.repository.ProjectRepository;
import com.mycompany.myapp.repository.SuiteRepository;

/**
 * REST controller for managing users.
 */
@RestController
@RequestMapping("/app")
public class ProjectSuiteResource {

	private final Logger log = LoggerFactory.getLogger(UserResource.class);

	@Inject
	private ProjectRepository projectRepository;

	@Inject
	private SuiteRepository suiteRepository;
	
	@RequestMapping(value = "/rest/project", 
			method = RequestMethod.GET, 
			produces = "application/json")
	@Timed
	public List<Project> getProjects(
			HttpServletResponse response) {
		log.debug("fetching projects");
		List<Project> projects = projectRepository.findAll();
		if (projects == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		return projects;
	}
	
	@RequestMapping(value = "/rest/suite/{suiteId}", 
			method = RequestMethod.GET, 
			produces = "application/json")
	@Timed
	public Suite getSuite(
			@PathVariable UUID suiteId,
			HttpServletResponse response) {
		log.debug("getting suite with suiteId: " + suiteId);
		
		Suite suite = suiteRepository.findOne(suiteId);
		return suite;
	}
	
	@RequestMapping(value = "/rest/suite", 
			method = RequestMethod.POST, 
			produces = "application/json")
	@Timed
	public Suite createSuite(
			@RequestBody Suite suite,
			HttpServletResponse response) {
		log.debug("creating suite");
		
		Project project = projectRepository.findOne(suite.getProject().getProjectId());
		suite.setProject(project);
		suite.setSuiteId(UUID.randomUUID());
		suiteRepository.save(suite);
		
		log.debug("new Suite created with suiteId: " + suite.getSuiteId() 
				+ " for suiteName: " + suite.getSuiteName());
		return suite;
	}
	
	@RequestMapping(value = "/rest/suite/{suiteId}", 
		method = RequestMethod.DELETE, 
		produces = "application/json")
	@Timed
	public void deleteSuite(
		@PathVariable UUID suiteId,
		HttpServletResponse response) {
		log.debug("deleting suite");
		
		suiteRepository.deleteBySuiteId(suiteId);
	}
	
}
