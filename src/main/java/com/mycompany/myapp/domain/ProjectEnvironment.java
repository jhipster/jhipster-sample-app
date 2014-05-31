package com.mycompany.myapp.domain;

import java.io.Serializable;
import java.util.Map;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.annotations.Type;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

/**
 * A project.
 */
@Entity
@Table(name = "T_PROJECT_ENVIRONMENT")
// @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@JsonInclude(Include.NON_NULL)
public class ProjectEnvironment implements Serializable {

	@Id
	// @GeneratedValue(generator="system-uuid")
	// @GenericGenerator(name="system-uuid", strategy="uuid")
	@Column(name = "environment_id")
	private UUID environmentId;

	@NotNull
	@Column(name = "environment_name")
	@Size(min = 0, max = 100)
	private String environmentName;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "project_id")
	@JsonBackReference
	private Project project;
	
	// A project can have multiple environments
	// A suite can have only one environment
	// A test can override a suite's environment via testConfig.environment
	@Column
	@Type(type="com.mycompany.myapp.domain.type.MapAsJsonType")
	private Map<String, String> environment;

	public UUID getEnvironmentId() {
		return environmentId;
	}

	public void setEnvironmentId(UUID environmentId) {
		this.environmentId = environmentId;
	}

	public String getEnvironmentName() {
		return environmentName;
	}

	public void setEnvironmentName(String environmentName) {
		this.environmentName = environmentName;
	}

	public Project getProject() {
		return project;
	}

	public void setProject(Project project) {
		this.project = project;
	}

	public Map<String, String> getEnvironment() {
		return environment;
	}

	public void setEnvironment(Map<String, String> environment) {
		this.environment = environment;
	}

	

}
