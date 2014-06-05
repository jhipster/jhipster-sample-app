package com.mycompany.myapp.web.rest;

import java.util.List;
import java.util.UUID;

import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.codahale.metrics.annotation.Timed;
import com.mycompany.myapp.domain.Test;
import com.mycompany.myapp.repository.ProjectRepository;
import com.mycompany.myapp.repository.SuiteRepository;
import com.mycompany.myapp.repository.TestRepository;

/**
 * REST controller for managing users.
 */
@RestController
@RequestMapping("/app")
public class TestResource {

	private final Logger log = LoggerFactory.getLogger(UserResource.class);

	@Inject
	private TestRepository testRepository;
	
	@RequestMapping(value = "/rest/test/{testId}", 
			method = RequestMethod.GET, 
			produces = "application/json")
	@Timed
	public Test getTest(
			@PathVariable UUID testId,
			HttpServletResponse response) {
		log.debug("getting test with testId: " + testId);
		
		Test test = testRepository.findOne(testId);
		return test;
	}
	
	@RequestMapping(value = "/rest/test/name/{testName}", 
			method = RequestMethod.GET, 
			produces = "application/json")
	@Timed
	public List<Test> getTests(
			@PathVariable String testName,
			HttpServletResponse response) {
		log.debug("getting tests by name: " + testName);
		
		List<Test> tests = testRepository.findByTestName(testName);
		if (tests == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		return tests;
	}
	
}
