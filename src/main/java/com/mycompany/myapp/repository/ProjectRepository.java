package com.mycompany.myapp.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.Project;

/**
 * Spring Data JPA repository for the User entity.
 */
@Transactional
public interface ProjectRepository extends JpaRepository<Project, UUID> {

	public Project findByProjectName(String projectName);
	
}
