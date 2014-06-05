package com.mycompany.myapp.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.mycompany.myapp.domain.Test;
import com.mycompany.myapp.domain.TestHistory;

public interface TestHistoryRepository extends JpaRepository<Test, UUID> {

	@Query("select * from Test where testId = ?1")
	TestHistory findByTestId(UUID testHistoryId);
}
