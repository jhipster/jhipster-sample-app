package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Label;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Label entity.
 */
public interface LabelRepository extends JpaRepository<Label,Long> {

}
