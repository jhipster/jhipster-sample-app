package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "T_SUITE")
// @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Suite implements Serializable {

	@Id
	// @GeneratedValue(generator="system-uuid")
	// @GenericGenerator(name="system-uuid", strategy="uuid")
	@Column(name = "suite_id")
	private UUID suiteId;

	@NotNull
	@Column(name = "suite_name")
	@Size(min = 0, max = 100)
	private String suiteName;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "project_id")
	@JsonBackReference
	private Project project;

	@OneToMany(mappedBy = "suite", cascade = CascadeType.ALL, 
			fetch = FetchType.LAZY)
	@JsonManagedReference
	private List<Test> tests;

	public List<Test> getTests() {
		return tests;
	}

	public void setTests(List<Test> tests) {
		this.tests = tests;
	}

	public UUID getSuiteId() {
		return suiteId;
	}

	public void setSuiteId(UUID suiteId) {
		this.suiteId = suiteId;
	}

	public String getSuiteName() {
		return suiteName;
	}

	public void setSuiteName(String suiteName) {
		this.suiteName = suiteName;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

}
