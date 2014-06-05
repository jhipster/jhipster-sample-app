package com.mycompany.myapp.domain;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
	
	@Column(name="url")
	private String url;
	
	/**
	 * Dropdown and capital case method such as GET, POST, DELETE
	 */
	@Column(name="http_method")
	//@Type(type="org.springframework.http.HttpMethod")
	//private HttpMethod httpMethod;
	private String httpMethod;
	
	/**
	 * environment are the properties that will be replaced using
	 * the placeholders in headers, url and as well as BODY
	 */
	@Column
	@Type(type="com.mycompany.myapp.domain.type.MapAsJsonType")
	private Map<String, String> environment;

	/**
	 * HTTP headers for the request
	 */
	@Column
	@Type(type="com.mycompany.myapp.domain.type.MapAsJsonType")
	private Map<String, String> headers;

	/**
	 * Map to MediaType: XML/JSON
	 */
	@Column
	@Enumerated(EnumType.ORDINAL)
	private MediaType inputMediaType;

	// TODO: XML and JSON
	@Column
	private String inputXMLBody;

	@Column
	private String inputJSONBody;
	
	/**
	 * Map to MediaType 
	 */
	@Column
	@Enumerated(EnumType.ORDINAL)
	private MediaType outputMediaType;

	/**
	 * Can be used for outputBody validation
	 */
	@Column
	private String outputXMLBody;

	@Column
	private String outputJSONBody;

	@Column
	@Type(type="com.mycompany.myapp.domain.type.ListAsJsonType")
	private List<Assertion> assertions;

	public Test getTest() {
		return test;
	}

	public void setTest(Test test) {
		this.test = test;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getHttpMethod() {
		return httpMethod;
	}

	public void setHttpMethod(String httpMethod) {
		this.httpMethod = httpMethod;
	}

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

	public MediaType getInputMediaType() {
		return inputMediaType;
	}

	public void setInputMediaType(MediaType inputMediaType) {
		this.inputMediaType = inputMediaType;
	}

	public String getInputXMLBody() {
		return inputXMLBody;
	}

	public void setInputXMLBody(String inputXMLBody) {
		this.inputXMLBody = inputXMLBody;
	}

	public String getInputJSONBody() {
		return inputJSONBody;
	}

	public void setInputJSONBody(String inputJSONBody) {
		this.inputJSONBody = inputJSONBody;
	}

	public MediaType getOutputMediaType() {
		return outputMediaType;
	}

	public void setOutputMediaType(MediaType outputMediaType) {
		this.outputMediaType = outputMediaType;
	}

	public String getOutputXMLBody() {
		return outputXMLBody;
	}

	public void setOutputXMLBody(String outputXMLBody) {
		this.outputXMLBody = outputXMLBody;
	}

	public String getOutputJSONBody() {
		return outputJSONBody;
	}

	public void setOutputJSONBody(String outputJSONBody) {
		this.outputJSONBody = outputJSONBody;
	}

	public List<Assertion> getAssertions() {
		return assertions;
	}

	public void setAssertions(List<Assertion> assertions) {
		this.assertions = assertions;
	}

}
