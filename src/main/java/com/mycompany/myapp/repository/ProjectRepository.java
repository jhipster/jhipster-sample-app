package com.mycompany.myapp.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mycompany.myapp.domain.Project;

/**
 * Spring Data JPA repository for the User entity.
 */
public interface ProjectRepository extends JpaRepository<Project, UUID> {

}
