package com.mycompany.myapp.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.mycompany.myapp.domain.Test;

/**
 * Spring Data JPA repository for the User entity.
 */
@Transactional
public interface TestRepository extends JpaRepository<Test, UUID> {

	List<Test> findByTestName(String testName);

	@Query("delete from Test where testId = ?1")
	void deleteByTestId(UUID testId);

}
