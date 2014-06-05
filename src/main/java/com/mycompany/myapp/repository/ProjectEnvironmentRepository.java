package com.mycompany.myapp.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.ProjectEnvironment;

/**
 * Spring Data JPA repository for the User entity.
 */
@Transactional
public interface ProjectEnvironmentRepository extends JpaRepository<ProjectEnvironment, UUID> {

	ProjectEnvironment findByEnvironmentName(UUID environmentId);

	@Query("select projectEnvironment from ProjectEnvironment projectEnvironment where projectEnvironment.project.projectId = ?1")
	List<ProjectEnvironment> findAllByProjectId(UUID projectId);

	@Query("delete from ProjectEnvironment where environment_id = ?1")
	void deleteByEnvironmentId(UUID projectEnvironmentId);

}
