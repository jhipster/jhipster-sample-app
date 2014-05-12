package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/**
 * A project.
 */
@Entity
@Table(name = "T_TEST")
// @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@JsonInclude(Include.NON_NULL)
public class Test implements Serializable {

	@Id
	// @GeneratedValue(generator="system-uuid")
	// @GenericGenerator(name="system-uuid", strategy="uuid")
	@Column(name = "test_id")
	private UUID testId;

	@NotNull
	@Column(name = "test_name")
	@Size(min = 0, max = 100)
	private String testName;

	@NotNull
	@Column(name = "test_type")
	@Size(min = 0, max = 100)
	private String testType;

	// entity suites in this side is inverse and owner resides in Suite
	@ManyToOne
	@JoinColumn(name = "suite_id")
	@JsonBackReference
	private Suite suite;

	@OneToOne(cascade = CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private TestConfig testConfig;

	/* @ManyToOne
	 * @JoinColumn(name = "test_input_id")
	 * @JsonBackReference private TestRun testRuns; */
	// each test run (or history) will have the actual testConfig (json)
	// test input (json) after replacement with parameter values
	// and the response (json/xml) the result (pass/fail)
	// response will contain headers, codes, cookies and body

	public UUID getTestId() {
		return testId;
	}

	public void setTestId(UUID testId) {
		this.testId = testId;
	}

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}

	public Suite getSuite() {
		return suite;
	}

	public void setSuite(Suite suite) {
		this.suite = suite;
	}

	public String getTestType() {
		return testType;
	}

	public void setTestType(String testType) {
		this.testType = testType;
	}

	public TestConfig getTestConfig() {
		return testConfig;
	}

	public void setTestConfig(TestConfig testConfig) {
		this.testConfig = testConfig;
	}

}
