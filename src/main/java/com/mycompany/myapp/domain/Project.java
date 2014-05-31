package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonManagedReference;

/**
 * A project.
 */
@Entity
@Table(name = "T_PROJECT")
// @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@JsonInclude(Include.NON_NULL)
public class Project implements Serializable {

	@Id
	// @GeneratedValue(generator="system-uuid")
	// @GenericGenerator(name="system-uuid", strategy="uuid")
	@Column(name = "project_id")
	private UUID projectId;

	@NotNull
	@Column(name = "project_name")
	@Size(min = 0, max = 100)
	private String projectName;

	// entity suites in this side is inverse and owner resides in Suite
	@OneToMany(mappedBy = "project", cascade=CascadeType.ALL, fetch=FetchType.EAGER)
	@JsonManagedReference
	private List<Suite> suites;
	
	// A project can have multiple environments
	// A suite can have only one environment
	// A test can override a suite's environment via testConfig.environment
	
	@OneToMany(mappedBy = "project", cascade=CascadeType.ALL, fetch=FetchType.EAGER)
	@JsonManagedReference
	private List<ProjectEnvironment> projectEnvironments;
	
	public UUID getProjectId() {
		return projectId;
	}

	public void setProjectId(UUID projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public List<Suite> getSuites() {
		return suites;
	}

	public void setSuites(List<Suite> suites) {
		this.suites = suites;
	}

	public List<ProjectEnvironment> getProjectEnvironments() {
		return projectEnvironments;
	}

	public void setProjectEnvironments(List<ProjectEnvironment> projectEnvironments) {
		this.projectEnvironments = projectEnvironments;
	}
	
	

}
