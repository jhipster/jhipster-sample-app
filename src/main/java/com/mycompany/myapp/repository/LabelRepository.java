package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Label;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Label entity.
 */
@SuppressWarnings("unused")
public interface LabelRepository extends JpaRepository<Label,Long> {

}
