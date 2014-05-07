package com.mycompany.myapp.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myapp.domain.Suite;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface SuiteRepository extends JpaRepository<Suite, UUID> {

}
