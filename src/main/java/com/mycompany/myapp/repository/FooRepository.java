package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Foo;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository for the Foo entity.
 */
public interface FooRepository extends JpaRepository<Foo, Long> {

}
