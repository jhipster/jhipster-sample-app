package com.mycompany.myapp.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.Suite;

/**
 * Spring Data JPA repository for the User entity.
 */
@Transactional
public interface SuiteRepository extends JpaRepository<Suite, UUID> {

	Suite findBySuiteName(UUID suiteId);

	@Query("select suite from Suite suite where suite.project.projectId = ?1")
	List<Suite> findAllByProjectId(UUID projectId);

	@Query("delete from Suite where suiteName = ?1")
	void deleteBySuiteId(UUID suiteId);

}
