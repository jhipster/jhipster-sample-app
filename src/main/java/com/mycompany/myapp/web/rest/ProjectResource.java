package com.mycompany.myapp.web.rest;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class ProjectResource {

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
		
		return suite;
	}
	
}
