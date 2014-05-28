package com.mycompany.myapp.domain;

import java.util.Map;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonBackReference;

/**
 * For a RestTest, TestConfig will contain
 * 	each test has 
 * 	 environment variables and headers
 * 	 input and output as JSON or XML, strings in Java
 * 	 assertions
 * @author rproddaturi
 *
 */
@Entity
@Table(name = "T_TEST_CONFIG")
public class TestConfig {

	@Id
	@Column(name = "test_id", nullable = false)
	@GeneratedValue(generator = "gen")
	@GenericGenerator(name = "gen", strategy = "foreign", parameters = @Parameter(name = "property", value = "test"))
	private UUID testId;

	@OneToOne(mappedBy = "testConfig", cascade = CascadeType.ALL)
	@JsonBackReference
	private Test test;
	
	@Column
	@Type(type="com.mycompany.myapp.domain.type.MapAsJsonType")
	private Map<String, String> environment;

	@Column
	@Type(type="com.mycompany.myapp.domain.type.MapAsJsonType")
	private Map<String, String> headers;

	@Column
	private String inputBody;

	@Column
	private String outputBody;

	@Column
	@Type(type="com.mycompany.myapp.domain.type.MapAsJsonType")
	private Map<String, String> assertions;

	public UUID getTestId() {
		return testId;
	}

	public void setTestId(UUID testId) {
		this.testId = testId;
	}

	public Map<String, String> getEnvironment() {
		return environment;
	}

	public void setEnvironment(Map<String, String> environment) {
		this.environment = environment;
	}

	public Map<String, String> getHeaders() {
		return headers;
	}

	public void setHeaders(Map<String, String> headers) {
		this.headers = headers;
	}

	public String getInputBody() {
		return inputBody;
	}

	public void setInputBody(String inputBody) {
		this.inputBody = inputBody;
	}

	public String getOutputBody() {
		return outputBody;
	}

	public void setOutputBody(String outputBody) {
		this.outputBody = outputBody;
	}

	public Map<String, String> getAssertions() {
		return assertions;
	}

	public void setAssertions(Map<String, String> assertions) {
		this.assertions = assertions;
	}

	public Test getTest() {
		return test;
	}

	public void setTest(Test test) {
		this.test = test;
	}

}
